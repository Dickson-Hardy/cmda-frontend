import { useState } from "react";
import { MdInfoOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import icons from "~/assets/js/icons";
import ConfirmSubscriptionModal from "~/components/DashboardComponents/Payments/ConfirmSubscriptionModal";
import Donations from "~/components/DashboardComponents/Payments/Donations";
import MakeDonationModal from "~/components/DashboardComponents/Payments/MakeDonationModal";
import Subscriptions from "~/components/DashboardComponents/Payments/Subscriptions";
import Button from "~/components/Global/Button/Button";
import Modal from "~/components/Global/Modal/Modal";
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
    setResponse(res);
    setRedirectModal(true);
  };

  const [response, setResponse] = useState(null);
  const [redirectModal, setRedirectModal] = useState(false);

  const handleNextStep = () => {
    setRedirectModal(false);
    if (user.role === "GlobalNetwork") return response.id;
    else window.open(response.checkout_url, "_self");
  };

  const onSubscribe = async () => {
    const res = await initSubscription({}).unwrap();
    setResponse(res);
    setRedirectModal(true);
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

      <Modal isOpen={redirectModal} onClose={() => {}}>
        <div className="flex flex-col justify-center items-center gap-3">
          <MdInfoOutline className="text-primary h-14 w-14" />
          <h3 className="text-lg font-medium">Redirecting to Payment Channel...</h3>
          <p className="text-center">
            After completing your payment, you will be automatically redirected back to the website. Please be patient
            and wait for the redirection to ensure your payment is logged correctly.
          </p>
          <Button label="I Understand" className="w-full" onClick={handleNextStep} />
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPaymentsPage;
