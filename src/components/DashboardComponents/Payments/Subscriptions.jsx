import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "~/components/Global/Button/Button";
import StatusChip from "~/components/Global/StatusChip/StatusChip";
import Table from "~/components/Global/Table/Table";
import { SUBSCRIPTION_PRICES } from "~/constants/subscription";
import { useExportSubscriptionsMutation, useGetAllSubscriptionsQuery } from "~/redux/api/payments/subscriptionApi";
import { selectAuth } from "~/redux/features/auth/authSlice";
import { downloadFile } from "~/utilities/fileDownloader";
import formatDate from "~/utilities/fomartDate";
import { formatCurrency } from "~/utilities/formatCurrency";

const Subscriptions = () => {
  const { user } = useSelector(selectAuth);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: subscriptions, isLoading } = useGetAllSubscriptionsQuery({ page, limit });

  const COLUMNS = [
    { header: "Reference", accessor: "reference" },
    { header: "Date", accessor: "createdAt" },
    { header: "Amount", accessor: "amount" },
    { header: "Frequency", accessor: "frequency" },
    { header: "ExpiryDate", accessor: "expiryDate" },
  ];

  const formattedColumns = COLUMNS.map((col) => ({
    ...col,
    cell: (info) => {
      const value = info.getValue();
      return col.accessor === "recurring" ? (
        value ? (
          "Yes"
        ) : (
          "No"
        )
      ) : col.accessor === "createdAt" || col.accessor === "expiryDate" ? (
        <span className="whitespace-nowrap">{formatDate(value).dateTime}</span>
      ) : col.accessor === "amount" ? (
        formatCurrency(value)
      ) : (
        value || "--"
      );
    },
    enableSorting: false,
  }));

  const [exportSubscriptions, { isLoading: isExporting }] = useExportSubscriptionsMutation();

  const handleExport = async () => {
    const callback = (result) => {
      downloadFile(result.data, "Subscriptions.csv");
    };
    exportSubscriptions({ callback, userId: user._id });
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <div className="border p-4 bg-white rounded-xl">
          <h6 className="text-gray text-sm font-medium mb-4">Subscription Status</h6>
          <StatusChip status={user.subscribed ? "Active" : "Inactive"} />
        </div>
        <div className="border p-4 bg-white rounded-xl">
          <h6 className="text-gray text-sm font-medium mb-4">Subscription Package</h6>
          <p className="font-semibold">
            {formatCurrency(
              user.role === "Doctor" && user.yearsOfExperience?.toLowerCase()?.includes("above")
                ? SUBSCRIPTION_PRICES["GlobalNetwork"]
                : SUBSCRIPTION_PRICES[user.role]
            )}{" "}
            / Annually
          </p>
        </div>
      </div>

      <div className="bg-white shadow py-6 rounded-3xl">
        <div className="mb-4 px-6 flex flex-col md:flex-row gap-4">
          <h3 className="text-lg font-semibold">Subscription History</h3>
          <Button label="Export" variant="outlined" loading={isExporting} className="ml-auto" onClick={handleExport} />
        </div>
        <Table
          tableData={subscriptions?.items || []}
          tableColumns={formattedColumns}
          loading={isLoading}
          serverSidePagination
          totalItemsCount={subscriptions?.meta?.totalItems}
          totalPageCount={subscriptions?.meta?.totalPages}
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
