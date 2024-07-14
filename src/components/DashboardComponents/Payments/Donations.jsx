import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "~/components/Global/Button/Button";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import Table from "~/components/Global/Table/Table";
import { useExportDonationsMutation, useGetAllDonationsQuery } from "~/redux/api/payments/donationApi";
import { selectAuth } from "~/redux/features/auth/authSlice";
import { downloadFile } from "~/utilities/fileDownloader";
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
      return col.accessor === "recurring" ? (
        value ? (
          "Yes"
        ) : (
          "No"
        )
      ) : col.accessor === "createdAt" ? (
        <span className="whitespace-nowrap">{formatDate(value).dateTime}</span>
      ) : col.accessor === "amount" ? (
        formatCurrency(value)
      ) : (
        value || "--"
      );
    },
    enableSorting: false,
  }));

  const { user } = useSelector(selectAuth);

  const [exportDonations, { isLoading: isExporting }] = useExportDonationsMutation();

  const handleExport = async () => {
    const callback = (result) => {
      downloadFile(result.data, "Donations.csv");
    };
    exportDonations({ callback, userId: user._id });
  };

  return (
    <div>
      <div className="bg-white shadow py-6 rounded-xl">
        <div className="mb-4 px-4 md:px-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <h3 className="text-lg font-semibold">Donation History</h3>
          <div className="flex flex-row-reverse justify-between md:flex-row items-center gap-4">
            <Button label="Export" variant="outlined" loading={isExporting} onClick={handleExport} />
            <SearchBar onSearch={setSearchBy} />
          </div>
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
