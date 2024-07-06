import { useState } from "react";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import Table from "~/components/Global/Table/Table";
import { useGetAllDonationsQuery } from "~/redux/api/payments/donationApi";
import formatDate from "~/utilities/fomartDate";
import { formatCurrency } from "~/utilities/formatCurrency";

const Donations = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchBy, setSearchBy] = useState("");
  const { data: donations, isLoading } = useGetAllDonationsQuery({ page, limit, searchBy });

  const COLUMNS = [
    { header: "Reference", accessor: "reference" },
    { header: "Date", accessor: "createdAt" },
    { header: "Amount", accessor: "amount" },
    { header: "Recurring", accessor: "recurring" },
    { header: "Frequency", accessor: "frequency" },
  ];

  const formattedColumns = COLUMNS.map((col) => ({
    ...col,
    cell: (info) => {
      const value = info.getValue();
      return col.accessor === "recurring"
        ? value
          ? "Yes"
          : "No"
        : col.accessor === "createdAt"
          ? formatDate(value).dateTime
          : col.accessor === "amount"
            ? formatCurrency(value)
            : value || "--";
    },
    enableSorting: false,
  }));

  return (
    <div>
      <div className="bg-white shadow py-6 rounded-xl">
        <div className="mb-4 px-6 flex items-center gap-4 justify-between">
          <h3 className="text-lg font-semibold">Donation History</h3>
          <SearchBar onSearch={setSearchBy} />
        </div>
        <Table
          tableData={donations?.items || []}
          tableColumns={formattedColumns}
          loading={isLoading}
          emptyDataTitle="No Donation History"
          emptyDataSubtitle="You have not made any donation yet. All donations made will appear here. Click the 'Make a Donation' button to make one."
          serverSidePagination
          totalItemsCount={donations?.meta?.totalItems}
          totalPageCount={donations?.meta?.totalPages}
          onPaginationChange={({ currentPage, perPage }) => {
            setPage(currentPage);
            setLimit(perPage);
          }}
        />
      </div>
    </div>
  );
};

export default Donations;
