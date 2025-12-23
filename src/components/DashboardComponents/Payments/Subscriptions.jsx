import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "~/components/Global/Button/Button";
import StatusChip from "~/components/Global/StatusChip/StatusChip";
import Table from "~/components/Global/Table/Table";
import { SUBSCRIPTION_PRICES, GLOBAL_INCOME_BASED_PRICING } from "~/constants/subscription";
import { useExportSubscriptionsMutation, useGetAllSubscriptionsQuery } from "~/redux/api/payments/subscriptionApi";
import { selectAuth } from "~/redux/features/auth/authSlice";
import { downloadFile } from "~/utilities/fileDownloader";
import formatDate from "~/utilities/fomartDate";
import { formatCurrency } from "~/utilities/formatCurrency";

// Selector for token from Redux store
const selectToken = (state) => state.token?.accessToken;

const Subscriptions = () => {
  const { user } = useSelector(selectAuth);
  const accessToken = useSelector(selectToken);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: subscriptions, isLoading } = useGetAllSubscriptionsQuery({ page, limit });

  const [loadingReceipt, setLoadingReceipt] = useState(null);

  const handleDownloadReceipt = async (subscriptionId, downloadOnly = false) => {
    try {
      setLoadingReceipt(subscriptionId);
      const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, ""); // Remove trailing slash
      const response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}/receipt`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Receipt error:", response.status, errorText);
        throw new Error(`Failed to download receipt: ${response.status}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) throw new Error("Empty PDF received");

      // Create a PDF blob
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);

      if (downloadOnly) {
        const a = document.createElement("a");
        a.href = url;
        a.download = `CMDA-Receipt-${subscriptionId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const newWindow = window.open(url, "_blank");
        if (!newWindow) {
          throw new Error("Pop-up blocked. Please allow pop-ups for this site.");
        }
      }

      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error("Error downloading receipt:", error);
      alert(error.message || "Failed to download receipt. Please try again.");
    } finally {
      setLoadingReceipt(null);
    }
  };

  const COLUMNS = [
    { header: "Reference", accessor: "reference" },
    { header: "Date", accessor: "createdAt" },
    { header: "Amount", accessor: "amount" },
    { header: "Frequency", accessor: "frequency" },
    { header: "ExpiryDate", accessor: "expiryDate" },
    { header: "Receipt", accessor: "_id" },
  ];

  const formattedColumns = COLUMNS.map((col) => ({
    ...col,
    cell: (info) => {
      const value = info.getValue();
      const row = info.row.original;
      return col.accessor === "_id" ? (
        row.isPaid ? (
          <button
            onClick={() => handleDownloadReceipt(value)}
            className="text-primary hover:text-primary-dark underline text-sm font-medium"
          >
            Download PDF
          </button>
        ) : (
          <span className="text-gray-400 text-sm">Pending Payment</span>
        )
      ) : col.accessor === "recurring" ? (
        value ? (
          "Yes"
        ) : (
          "No"
        )
      ) : col.accessor === "createdAt" || col.accessor === "expiryDate" ? (
        <span className="whitespace-nowrap">{formatDate(value).dateTime}</span>
      ) : col.accessor === "amount" ? (
        formatCurrency(value, user.role === "GlobalNetwork" ? "USD" : "NGN")
      ) : (
        value || "--"
      );
    },
    enableSorting: false,
  }));

  // Filter to show only paid subscriptions
  const paidSubscriptions = (subscriptions?.items || []).filter((sub) => sub.isPaid);

  const [exportSubscriptions, { isLoading: isExporting }] = useExportSubscriptionsMutation();

  const handleExport = async () => {
    const callback = (result) => {
      downloadFile(result.data, "Subscriptions.csv");
    };
    exportSubscriptions({ callback, userId: user._id });
  };

  return (
    <div data-tutorial="subscription-section">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <div className="border p-4 bg-white rounded-xl">
          <h6 className="text-gray text-sm font-medium mb-4">Subscription Status</h6>
          <StatusChip status={user.subscribed ? "Active" : "Inactive"} />
          {user.hasLifetimeMembership && (
            <div className="mt-3 flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg p-3">
              <span className="text-2xl">👑</span>
              <div>
                <p className="text-sm font-bold text-orange-700">Lifetime Member</p>
                <p className="text-xs text-orange-600">
                  {user.lifetimeMembershipType === "lifetime"
                    ? "Nigerian Lifetime"
                    : `${user.lifetimeMembershipType.charAt(0).toUpperCase() + user.lifetimeMembershipType.slice(1)}`}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="border p-4 bg-white rounded-xl">
          <h6 className="text-gray text-sm font-medium mb-4">Subscription Package</h6>
          {user.role === "GlobalNetwork" ? (
            <div>
              {user.incomeBracket ? (
                <div>
                  <p className="font-semibold text-sm mb-2">Income-Based Pricing</p>
                  <p className="text-xs text-gray-600 mb-1">
                    Income Level: {GLOBAL_INCOME_BASED_PRICING[user.incomeBracket]?.label}
                  </p>
                  <p className="font-semibold">
                    Annual: {formatCurrency(GLOBAL_INCOME_BASED_PRICING[user.incomeBracket]?.annual || 100, "USD")}
                    {" | "}
                    Monthly: {formatCurrency(GLOBAL_INCOME_BASED_PRICING[user.incomeBracket]?.monthly || 10, "USD")}
                  </p>
                  {user.hasLifetimeMembership && (
                    <p className="text-sm text-success mt-2">✓ Lifetime Member ({user.lifetimeMembershipType})</p>
                  )}
                </div>
              ) : (
                <p className="font-semibold">
                  {formatCurrency(SUBSCRIPTION_PRICES[user.role], "USD")} / Annually
                  <span className="block text-xs text-orange-600 mt-1">Consider upgrading to income-based pricing</span>
                </p>
              )}
            </div>
          ) : (
            <p className="font-semibold">
              {formatCurrency(
                user.role === "Doctor" && user.yearsOfExperience?.toLowerCase()?.includes("above")
                  ? SUBSCRIPTION_PRICES["DoctorSenior"]
                  : SUBSCRIPTION_PRICES[user.role],
                "NGN"
              )}{" "}
              / Annually
            </p>
          )}
        </div>
      </div>

      <div className="bg-white shadow py-6 rounded-3xl">
        <div className="mb-4 px-6 flex flex-col md:flex-row gap-4">
          <h3 className="text-lg font-semibold">Subscription History</h3>
          <Button label="Export" variant="outlined" loading={isExporting} className="ml-auto" onClick={handleExport} />
        </div>
        <Table
          tableData={paidSubscriptions}
          tableColumns={formattedColumns}
          loading={isLoading}
          serverSidePagination
          totalItemsCount={paidSubscriptions.length}
          totalPageCount={Math.ceil(paidSubscriptions.length / limit)}
          onPaginationChange={({ currentPage, perPage }) => {
            setPage(currentPage);
            setLimit(perPage);
          }}
        />
      </div>
    </div>
  );
};

export default Subscriptions;
