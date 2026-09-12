import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "~/components/Global/Button/Button";
import StatusChip from "~/components/Global/StatusChip/StatusChip";
import LifetimeMemberStatus from "~/components/Global/LifetimeMemberStatus/LifetimeMemberStatus";
import Table from "~/components/Global/Table/Table";
import {
  SUBSCRIPTION_PRICES,
  GLOBAL_INCOME_BASED_PRICING,
  UK_EUROPE_SUBSCRIPTION,
  isUkEuropeGlobalMember,
} from "~/constants/subscription";
import {
  useExportSubscriptionsMutation,
  useGetAllSubscriptionsQuery,
  useGetSubscriptionStatusQuery,
} from "~/redux/api/payments/subscriptionApi";
import { selectAuth } from "~/redux/features/auth/authSlice";
import { downloadFile } from "~/utilities/fileDownloader";
import formatDate from "~/utilities/fomartDate";
import { formatCurrency } from "~/utilities/formatCurrency";
import { API_BASE_URL } from "~/utilities/apiBaseUrl";

// Selector for token from Redux store
const selectToken = (state) => state.token?.accessToken;

const Subscriptions = () => {
  const { user } = useSelector(selectAuth);
  const isUkEuropeMember = isUkEuropeGlobalMember(user);
  const accessToken = useSelector(selectToken);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: subscriptions, isLoading } = useGetAllSubscriptionsQuery({ page, limit });

  const [loadingReceipt, setLoadingReceipt] = useState(null);

  const { data: subscriptionStatus, isLoading: isLoadingStatus } = useGetSubscriptionStatusQuery();

  const getDaysUntilExpiry = () => {
    if (!subscriptionStatus?.expiryDate) return null;
    const now = new Date();
    const expiry = new Date(subscriptionStatus.expiryDate);
    const diff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysUntilExpiry = getDaysUntilExpiry();

  const handleDownloadReceipt = async (subscriptionId, downloadOnly = false) => {
    try {
      setLoadingReceipt(subscriptionId);
      const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}/receipt`, {
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
    { header: "Membership Year", accessor: "subscriptionYear" },
    { header: "Payment Date", accessor: "createdAt" },
    { header: "Amount", accessor: "amount" },
    { header: "Frequency", accessor: "frequency" },
    { header: "Valid Until", accessor: "expiryDate" },
    { header: "Receipt", accessor: "_id" },
  ];

  const formattedColumns = COLUMNS.map((col) => ({
    ...col,
    cell: (info) => {
      const value = info.getValue();
      const row = info.row.original;
      return col.accessor === "_id" ? (
        row.expiryDate ? (
          <button
            onClick={() => handleDownloadReceipt(value)}
            disabled={loadingReceipt === value}
            className="text-primary hover:text-primary-dark underline text-sm font-medium"
          >
            {loadingReceipt === value ? "Preparing..." : "Download PDF"}
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
      ) : col.accessor === "subscriptionYear" ? (
        <span className="whitespace-nowrap">
          {value || (row.createdAt ? new Date(row.createdAt).getFullYear() : "--")}
        </span>
      ) : col.accessor === "createdAt" || col.accessor === "expiryDate" ? (
        <span className="whitespace-nowrap">{formatDate(value).dateTime}</span>
      ) : col.accessor === "amount" ? (
        formatCurrency(value, row.currency || (user.role === "GlobalNetwork" ? "USD" : "NGN"))
      ) : (
        value || "--"
      );
    },
    enableSorting: false,
  }));

  // Show only valid paid subscriptions:
  // - Must have expiryDate (indicates payment was processed)
  // - Must NOT have INT- reference (those are pending payment intents)
  // - Valid references: Paystack/PayPal codes or ADMIN
  const paidSubscriptions = (subscriptions?.items || []).filter(
    (sub) => sub.expiryDate && (!sub.reference || !sub.reference.startsWith("INT-"))
  );

  const [exportSubscriptions, { isLoading: isExporting }] = useExportSubscriptionsMutation();

  const handleExport = async () => {
    const callback = (result) => {
      downloadFile(result.data, "Subscriptions.csv");
    };
    exportSubscriptions({ callback, userId: user._id });
  };

  return (
    <div data-tutorial="subscription-section">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div className="border p-4 bg-white rounded-xl">
          <h6 className="text-gray text-sm font-medium mb-4">Subscription Status</h6>
          {user.hasLifetimeMembership ? (
            <LifetimeMemberStatus membershipType={user.lifetimeMembershipType} />
          ) : (
            <StatusChip status={user.subscribed ? "Active" : "Inactive"} />
          )}

          {!user.hasLifetimeMembership && !isLoadingStatus && subscriptionStatus && (
            <div className="mt-3 space-y-2">
              {isUkEuropeMember && (
                <>
                  <p className="text-sm font-semibold">
                    {formatCurrency(subscriptionStatus.paidAmount, "GBP")} of{" "}
                    {formatCurrency(subscriptionStatus.annualTarget, "GBP")} paid for{" "}
                    {subscriptionStatus.subscriptionYear}
                  </p>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-gray-200"
                    role="progressbar"
                    aria-label="Annual payment progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={subscriptionStatus.progressPercent || 0}
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${subscriptionStatus.progressPercent || 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    {subscriptionStatus.isFullyPaid
                      ? "Your annual target is fully paid."
                      : `${formatCurrency(subscriptionStatus.remainingAmount, "GBP")} remaining this year.`}
                  </p>
                </>
              )}
              {subscriptionStatus.expiryDate && (
                <p className="text-xs text-gray-600">
                  Expires:{" "}
                  <span className="font-medium text-black">{formatDate(subscriptionStatus.expiryDate).date}</span>
                </p>
              )}
              {!isUkEuropeMember && subscriptionStatus.autoRenew !== undefined && (
                <p className="text-xs text-gray-600">
                  Auto-Renew:{" "}
                  <span
                    className={subscriptionStatus.autoRenew ? "text-success font-medium" : "text-error font-medium"}
                  >
                    {subscriptionStatus.autoRenew ? "Enabled" : "Disabled"}
                  </span>
                </p>
              )}
              {daysUntilExpiry !== null && daysUntilExpiry > 0 && (
                <p className={`text-xs font-medium ${daysUntilExpiry <= 30 ? "text-orange-600" : "text-gray-600"}`}>
                  {daysUntilExpiry} day{daysUntilExpiry !== 1 ? "s" : ""} until expiry
                </p>
              )}
              {daysUntilExpiry !== null && daysUntilExpiry <= 0 && (
                <p className="text-xs font-medium text-error">Expired</p>
              )}
            </div>
          )}
        </div>

        <div className="border p-4 bg-white rounded-xl">
          <h6 className="text-gray text-sm font-medium mb-4">Subscription Package</h6>
          {user.hasLifetimeMembership ? (
            <div>
              <p className="font-semibold text-sm">Lifetime membership</p>
              <p className="text-xs text-gray-600 mt-1">No annual renewal is required.</p>
            </div>
          ) : isUkEuropeMember ? (
            <div>
              <p className="font-semibold text-sm">UK/Europe membership</p>
              <p className="font-semibold mt-2">
                {formatCurrency(UK_EUROPE_SUBSCRIPTION.monthlyAmount, "GBP")} installments or{" "}
                {formatCurrency(UK_EUROPE_SUBSCRIPTION.annualTarget, "GBP")} yearly
              </p>
              <p className="text-xs text-gray-600 mt-1">Pay at any time. Balances reset each calendar year.</p>
            </div>
          ) : user.role === "GlobalNetwork" ? (
            <div>
              {user.incomeBracket ? (
                <div>
                  <p className="font-semibold text-sm mb-2">Income-Based Pricing</p>
                  <p className="text-xs text-gray-600 mb-1">
                    Income Level: {GLOBAL_INCOME_BASED_PRICING[user.incomeBracket]?.label}
                  </p>
                  <p className="font-semibold">
                    Annual: {formatCurrency(GLOBAL_INCOME_BASED_PRICING[user.incomeBracket]?.annual || 100, "USD")}
                  </p>
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

      {isUkEuropeMember && (
        <div className="border p-4 bg-white rounded-xl mb-6">
          <h6 className="font-semibold text-sm mb-2">Pay by UK/European bank transfer</h6>
          {subscriptionStatus?.bankDetails ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {Object.entries({
                "Account name": subscriptionStatus.bankDetails.accountName,
                Bank: subscriptionStatus.bankDetails.bankName,
                "Sort code": subscriptionStatus.bankDetails.sortCode,
                "Account number": subscriptionStatus.bankDetails.accountNumber,
                IBAN: subscriptionStatus.bankDetails.iban,
                "SWIFT/BIC": subscriptionStatus.bankDetails.swiftBic,
              })
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <p key={label}>
                    <span className="text-gray-600">{label}:</span> <span className="font-medium">{value}</span>
                  </p>
                ))}
              <p className="sm:col-span-2 mt-1 text-xs text-gray-600">
                Use <strong>{subscriptionStatus.bankTransferReference}</strong> as your payment reference. Your profile
                updates after an administrator confirms the transfer.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Bank details are being configured. Please use PayPal or contact the UK/Europe administrator.
            </p>
          )}
        </div>
      )}

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
          totalItemsCount={subscriptions?.meta?.totalItems || 0}
          totalPageCount={subscriptions?.meta?.totalPages || 1}
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
