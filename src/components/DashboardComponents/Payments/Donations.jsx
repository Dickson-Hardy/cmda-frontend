import Table from "~/components/Global/Table/Table";

const Donations = () => {
  return (
    <div>
      <div className="bg-white shadow py-6 rounded-3xl">
        <div className="mb-4 px-6">
          <h3 className="text-lg font-semibold">Donation History</h3>
        </div>
        <Table
          tableData={[]}
          tableColumns={[]}
          emptyDataTitle="No Donation History"
          emptyDataSubtitle="You have not made any donation yet. All donations made will appear here. Click the 'Make a Donation' button to make one."
        />
      </div>
    </div>
  );
};

export default Donations;
