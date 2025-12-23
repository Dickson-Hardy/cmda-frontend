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

// Selector for token from Redux store
const selectToken = (state) => state.token?.accessToken;

const Donations = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchBy, setSearchBy] = useState("");
  const { data: donations, isLoading } = useGetAllDonationsQuery({ page, limit, searchBy });
  const accessToken = useSelector(selectToken);

  const [loadingReceipt, setLoadingReceipt] = useState(null);

  const handleDownloadReceipt = async (donationId, downloadOnly = false) => {
    try {
      setLoadingReceipt(donationId);
      const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, ""); // Remove trailing slash
      const response = await fetch(`${baseUrl}/donations/${donationId}/receipt`, {
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
        a.download = `CMDA-Donation-Receipt-${donationId}.pdf`;
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
    { header: "Date", accessor: "createdAt" },
    { header: "Reference", accessor: "reference" },
    { header: "Source", accessor: "source" },
    { header: "Total Amount", accessor: "totalAmount" },
    { header: "Recurring", accessor: "recurring" },
    { header: "Frequency", accessor: "frequency" },
    { header: "Areas of Need", accessor: "areasOfNeed" },
    { header: "Receipt", accessor: "_id" },
  ];

  const formattedColumns = COLUMNS.map((col) => ({
    ...col,
    cell: (info) => {
      const [value, item] = [info.getValue(), info.row.original];
      return col.accessor === "_id" ? (
        item.isPaid ? (
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
        `${value ? "Yes" : "No"}`
      ) : col.accessor === "createdAt" ? (
        <span className="whitespace-nowrap">{formatDate(value).dateTime}</span>
      ) : col.accessor === "areasOfNeed" ? (
        typeof value === "string" ? (
          value
        ) : (
          value?.map((x) => x.name + " - " + formatCurrency(x.amount, item.currency)).join(", ")
        )
      ) : col.accessor === "totalAmount" ? (
        formatCurrency(value || item.amount, item.currency)
      ) : (
        value || "--"
      );
    },
    enableSorting: false,
  }));

  const { user } = useSelector(selectAuth);

  // Filter to show only paid donations
  const paidDonations = (donations?.items || []).filter((don) => don.isPaid);

  const [exportDonations, { isLoading: isExporting }] = useExportDonationsMutation();

  const handleExport = async () => {
    const callback = (result) => {
      downloadFile(result.data, "Donations.csv");
    };
    exportDonations({ callback, userId: user._id });
  };

  return (
    <div data-tutorial="donation-section">
      <div className="bg-white shadow py-6 rounded-xl">
        <div className="mb-4 px-4 md:px-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <h3 className="text-lg font-semibold">Donation History</h3>
          <div className="flex flex-row-reverse justify-between md:flex-row items-center gap-4">
            <Button label="Export" variant="outlined" loading={isExporting} onClick={handleExport} />
            <SearchBar onSearch={setSearchBy} placeholder="reference or amount" />
          </div>
        </div>
        <Table
          tableData={paidDonations}
          tableColumns={formattedColumns}
          loading={isLoading}
          emptyDataTitle="No Donation History"
          emptyDataSubtitle="You have not made any donation yet. All donations made will appear here. Click the 'Make a Donation' button to make one."
          serverSidePagination
          totalItemsCount={paidDonations.length}
          totalPageCount={Math.ceil(paidDonations.length / limit)}
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
