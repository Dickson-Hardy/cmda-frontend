import Table from "~/components/Global/Table/Table";

const Subscriptions = () => {
  return (
    <div>
      <div className="bg-white shadow py-6 rounded-3xl">
        <div className="mb-4 px-6">
          <h3 className="text-lg font-semibold">Subscriptions</h3>
        </div>
        <Table tableData={[]} tableColumns={[]} />
      </div>
    </div>
  );
};

export default Subscriptions;
