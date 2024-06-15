import BackButton from "~/components/Global/BackButton/BackButton";
import Table from "~/components/Global/Table/Table";

function DashboardStoreOrderHistoryPage() {
  return (
    <div>
      <BackButton label="Back to Store" />

      <div className="py-6">
        <Table />
      </div>
    </div>
  );
}

export default DashboardStoreOrderHistoryPage;
