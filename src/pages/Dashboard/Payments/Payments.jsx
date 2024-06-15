import Donations from "~/components/DashboardComponents/Payments/Donations";
import PaymentMethod from "~/components/DashboardComponents/Payments/PaymentMethod";
import Subscriptions from "~/components/DashboardComponents/Payments/Subscriptions";
import Button from "~/components/Global/Button/Button";
import Tabs from "~/components/Global/Tabs/Tabs";

const DashboardPaymentsPage = () => {
  const PAYMENT_TABS = [
    { label: "Subscriptions", content: <Subscriptions /> },
    { label: "Donations", content: <Donations /> },
    { label: "Payment Methods", content: <PaymentMethod /> },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center gap-y-3 md:justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Manage Payments</h2>
        <Button label="Make a Donation" />
      </div>

      <div className="my-6">
        <Tabs tabs={PAYMENT_TABS} />
      </div>
    </div>
  );
};

export default DashboardPaymentsPage;
