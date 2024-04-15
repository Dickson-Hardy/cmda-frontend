import Button from "../../Global/Button/Button";
import Table from "../../Global/Table/Table";

const ProfileTabManageSubscriptions = () => {
  const COLUMNS = [
    { header: "Date", accessor: "id" },
    { header: "Subscription package", accessor: "package" },
    { header: "Payment method", accessor: "paymentMethod" },
    { header: "Amount", accessor: "amount" },
    { header: "Status", accessor: "status" },
  ];
  const tableColumns = COLUMNS.map((col) => ({
    ...col,
    enableSorting: col.accessor === "action" ? false : true,
    cell: (info) => {
      const value = info.getValue();
      return col.accessor === "title.rendered" ? (
        value.slice(0, 25) + "..."
      ) : col.accessor === "slug" ? (
        value.slice(0, 15) + "..."
      ) : col.accessor === "categories" ? (
        value.join(", ")
      ) : col.accessor === "date" ? (
        new Date(value).toDateString()
      ) : col.accessor === "modified" ? (
        new Date(value).toDateString()
      ) : col.accessor === "status" ? (
        <span className={"capitalize " + (value === "publish" ? "text-green-600" : "text-error")}>{value}</span>
      ) : (
        value || "---"
      );
    },
  }));

  return (
    <div className="p-4 pt-0">
      <div className="mb-8 flex flex-col md:flex-row gap-10">
        <div className="border p-4 rounded-2xl flex flex-col md:flex-row gap-6 justify-between md:items-center w-full md:w-1/2">
          <div>
            <h6 className="text-gray text-sm font-medium">Current Subscription</h6>
            <p className="font-semibold my-2">Annually</p>
            <p className="text-sm">NGN 12,000/year</p>
          </div>
          <Button label="Manage" variant="outlined" />
        </div>
        <div className="w-full md:w-1/2">
          <h3 className="text-base font-bold mb-2">Payment/Donation Method</h3>
          <p className="bg-white border p-3 rounded-xl">2390 **** ****</p>
          <div className="flex justify-end mt-4">
            <Button variant="text" label="Update payment method" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold mb-2 overflow-x-auto">Payment/Donation History</h3>
        <Table tableData={[]} tableColumns={tableColumns} />
      </div>
    </div>
  );
};

export default ProfileTabManageSubscriptions;
