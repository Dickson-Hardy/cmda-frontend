import { useState } from "react";
import { useNavigate } from "react-router-dom";
import icons from "~/assets/js/icons";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import StatusChip from "~/components/Global/StatusChip/StatusChip";
import Table from "~/components/Global/Table/Table";
import { useGetOrderHistoryQuery } from "~/redux/api/products/productsApi";
import formatDate from "~/utilities/fomartDate";
import { formatCurrency } from "~/utilities/formatCurrency";

function DashboardStoreOrderHistoryPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchBy, setSearchBy] = useState("");
  const { data: orderHistory, isLoading } = useGetOrderHistoryQuery({ page, limit, searchBy });

  const COLUMNS = [
    { header: "Reference", accessor: "paymentReference" },
    { header: "Date", accessor: "createdAt" },
    { header: "Amount", accessor: "totalAmount" },
    { header: "Total Items", accessor: "totalItems" },
    { header: "Shipping Address", accessor: "shippingAddress" },
    { header: "Status", accessor: "status" },
  ];

  const formattedColumns = COLUMNS.map((col) => ({
    ...col,
    cell: (info) => {
      const [value, item] = [info.getValue(), info.row.original];
      return col.accessor === "status" ? (
        <StatusChip status={value} />
      ) : col.accessor === "createdAt" ? (
        formatDate(value).dateTime
      ) : col.accessor === "totalAmount" ? (
        formatCurrency(value)
      ) : col.accessor === "totalItems" ? (
        item.products.length
      ) : (
        value || "--"
      );
    },
    enableSorting: false,
  }));

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center gap-y-3 md:justify-between items-center">
        <h2 className="text-xl font-bold text-primary">Order History</h2>
        <button type="button" onClick={() => navigate("/dashboard/store")} className="text-2xl text-primary">
          {icons.close}
        </button>
      </div>

      <div className="bg-white shadow py-6 rounded-xl mt-6">
        <div className="mb-4 px-6 flex items-center gap-4 justify-between">
          <h3 className="text-lg font-semibold">All Orders</h3>
          <SearchBar onSearch={setSearchBy} />
        </div>
        <Table
          tableData={orderHistory?.items || []}
          tableColumns={formattedColumns}
          loading={isLoading}
          serverSidePagination
          totalItemsCount={orderHistory?.meta?.totalItems}
          totalPageCount={orderHistory?.meta?.totalPages}
          onPaginationChange={({ currentPage, perPage }) => {
            setPage(currentPage);
            setLimit(perPage);
          }}
        />
      </div>
    </div>
  );
}

export default DashboardStoreOrderHistoryPage;
