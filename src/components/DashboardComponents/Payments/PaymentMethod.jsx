import Button from "~/components/Global/Button/Button";
import Table from "~/components/Global/Table/Table";

const PaymentMethod = () => {
  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row gap-10">
        <div className="border p-4 bg-white rounded-2xl flex flex-col md:flex-row gap-6 justify-between md:items-center w-full md:w-1/2">
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

      <div className="bg-white shadow py-6 rounded-3xl">
        <div className="mb-4 px-6">
          <h3 className="text-lg font-semibold">Payment History</h3>
        </div>
        <Table tableData={[]} tableColumns={[]} />
      </div>
    </div>
  );
};

export default PaymentMethod;
