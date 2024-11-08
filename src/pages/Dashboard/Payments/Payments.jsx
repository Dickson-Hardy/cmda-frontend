import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import icons from "~/assets/js/icons";
import ConfirmSubscriptionModal from "~/components/DashboardComponents/Payments/ConfirmSubscriptionModal";
import Donations from "~/components/DashboardComponents/Payments/Donations";
import MakeDonationModal from "~/components/DashboardComponents/Payments/MakeDonationModal";
import Subscriptions from "~/components/DashboardComponents/Payments/Subscriptions";
import Button from "~/components/Global/Button/Button";
import Tabs from "~/components/Global/Tabs/Tabs";
import { useInitDonationSessionMutation } from "~/redux/api/payments/donationApi";
import { useInitSubscriptionSessionMutation } from "~/redux/api/payments/subscriptionApi";
import { selectAuth } from "~/redux/features/auth/authSlice";

const DashboardPaymentsPage = () => {
  const PAYMENT_TABS = [
    { label: "Subscriptions", content: <Subscriptions /> },
    { label: "Donations", content: <Donations /> },
  ];
  const { user } = useSelector(selectAuth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("active");
  const [activeIndex, setActiveIndex] = useState(+activeTab || 0);
  const [openDonate, setOpenDonate] = useState(false);
  const [initDonation, { isLoading }] = useInitDonationSessionMutation();
  const [openSubscribe, setOpenSubscribe] = useState(false);
  const [initSubscription, { isLoading: isSubscribing }] = useInitSubscriptionSessionMutation();

  const onSubmit = async (payload) => {
    const res = await initDonation({ ...payload, amount: +payload.amount }).unwrap();
    if (user.role === "GlobalNetwork") return res.id;
    else window.open(res.checkout_url, "_self");
  };

  const onSubscribe = async () => {
    const res = await initSubscription({}).unwrap();
    if (user.role === "GlobalNetwork") return res.id;
    else window.open(res.checkout_url, "_self");
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center gap-y-3 md:justify-between md:items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">Manage Payments</h2>
        {activeIndex ? (
          <Button label="Make a Donation" onClick={() => setOpenDonate(true)} />
        ) : (
          <Button
            icon={user?.subscribed ? icons.checkAlt : null}
            label={user?.subscribed ? "Subscribed" : "Subscribe Now"}
            color={user?.subscribed ? "secondary" : "primary"}
            disabled={user?.subscribed}
            onClick={() => setOpenSubscribe(true)}
            className="ml-auto"
          />
        )}
      </div>
      <div className="my-6">
        <Tabs tabs={PAYMENT_TABS} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />
      </div>
      {/*  */}
      <MakeDonationModal
        isOpen={openDonate}
        onClose={() => setOpenDonate(false)}
        loading={isLoading}
        onSubmit={onSubmit}
        onApprove={(data) => {
          navigate(`/dashboard/payments/successful?type=donation&source=paypal&reference=${data.orderID}`);
        }}
      />

      <ConfirmSubscriptionModal
        isOpen={openSubscribe}
        onClose={() => setOpenSubscribe(false)}
        onSubmit={onSubscribe}
        loading={isSubscribing}
        onApprove={(data) => {
          navigate(`/dashboard/payments/successful?type=subscription&source=paypal&reference=${data.orderID}`);
        }}
        isGlobalMember={user.role === "GlobalNetwork"}
      />
    </div>
  );
};

export default DashboardPaymentsPage;
