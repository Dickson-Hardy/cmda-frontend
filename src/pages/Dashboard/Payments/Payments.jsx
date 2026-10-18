import { useEffect, useState } from "react";
import { MdInfoOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import icons from "~/assets/js/icons";
import ConfirmSubscriptionModal from "~/components/DashboardComponents/Payments/ConfirmSubscriptionModal";
import GlobalSubscriptionModal from "~/components/DashboardComponents/Payments/GlobalSubscriptionModal";
import NigerianLifetimeModal from "~/components/DashboardComponents/Payments/NigerianLifetimeModal";
import Donations from "~/components/DashboardComponents/Payments/Donations";
import MakeDonationModal from "~/components/DashboardComponents/Payments/MakeDonationModal";
import PaymentIntents from "~/components/DashboardComponents/Payments/PaymentIntents";
import Subscriptions from "~/components/DashboardComponents/Payments/Subscriptions";
import Button from "~/components/Global/Button/Button";
import Modal from "~/components/Global/Modal/Modal";
import Tabs from "~/components/Global/Tabs/Tabs";
import { useInitDonationSessionMutation } from "~/redux/api/payments/donationApi";
import {
  useGetSubscriptionStatusQuery,
  useInitSubscriptionSessionMutation,
} from "~/redux/api/payments/subscriptionApi";
import { useGetProfileQuery } from "~/redux/api/profile/profileApi";
import { selectAuth, setUser } from "~/redux/features/auth/authSlice";
import { ZelleTransfers } from "~/components/DashboardComponents/Payments/ZellePayment";

const DashboardPaymentsPage = () => {
  const PAYMENT_TABS = [
    { label: "Subscriptions", content: <Subscriptions /> },
    { label: "Donations", content: <Donations /> },
  ];
  const { user } = useSelector(selectAuth);
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("active");
  const [activeIndex, setActiveIndex] = useState(+activeTab || 0);

  const [openDonate, setOpenDonate] = useState(false);
  const [initDonation, { isLoading }] = useInitDonationSessionMutation();
  const [openSubscribe, setOpenSubscribe] = useState(false);
  const [openLifetime, setOpenLifetime] = useState(false);
  const [initSubscription, { isLoading: isSubscribing }] = useInitSubscriptionSessionMutation();
  const isGlobalMember = user?.role === "GlobalNetwork";
  const { data: subscriptionStatus, isLoading: isLoadingSubscriptionStatus } = useGetSubscriptionStatusQuery(
    undefined,
    {
      skip: user?.role !== "GlobalNetwork",
    }
  );
  const subscriptionComplete =
    user.role === "GlobalNetwork" && !user.hasLifetimeMembership ? subscriptionStatus?.isFullyPaid : user?.subscribed;
  const isSubscriptionActionDisabled = Boolean(subscriptionComplete || (isGlobalMember && isLoadingSubscriptionStatus));

  const { data: myProfile } = useGetProfileQuery(null, { refetchOnMountOrArgChange: true });
  const dispatch = useDispatch();

  useEffect(() => {
    if (myProfile && myProfile?.email) {
      dispatch(setUser(myProfile));
    }
  }, [myProfile, dispatch]);

  const onSubmit = async (payload) => {
    const res = await initDonation(payload).unwrap();
    if (user.role === "GlobalNetwork") {
      return res;
    } else {
      setResponse(res);
      setOpenDonate(false);
      setRedirectModal(true);
    }
  };

  const [response, setResponse] = useState(null);
  const [redirectModal, setRedirectModal] = useState(false);

  const handleNextStep = () => {
    setRedirectModal(false);
    window.open(response.checkout_url, "_self");
  };
  const onSubscribe = async (subscriptionData) => {
    // Handle different subscription types for Global Network members
    if (user.role === "GlobalNetwork" && subscriptionData) {
      const res = await initSubscription(subscriptionData).unwrap();
      return res;
    } else {
      // Pass subscriptionData for Nigerian lifetime membership
      const res = await initSubscription(subscriptionData || {}).unwrap();
      setResponse(res);
      setOpenSubscribe(false);
      setOpenLifetime(false);
      setRedirectModal(true);
    }
  };

  return (
    <div>
      <div className="flex flex-col xl:flex-row justify-center gap-y-3 xl:justify-between xl:items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">Manage Payments</h2>
        {activeIndex ? (
          <Button label="Make a Donation" onClick={() => setOpenDonate(true)} />
        ) : (
          <div className="flex flex-wrap gap-3">
            {user?.role !== "GlobalNetwork" && !user?.subscribed && (
              <Button label="Lifetime Membership" variant="outlined" onClick={() => setOpenLifetime(true)} />
            )}
            <Button
              icon={subscriptionComplete ? icons.checkAlt : null}
              label={
                subscriptionComplete
                  ? "Year Fully Paid"
                  : isGlobalMember && isLoadingSubscriptionStatus
                    ? "Loading Balance..."
                    : isGlobalMember
                      ? "Make a Payment"
                      : "Subscribe Now"
              }
              color={subscriptionComplete ? "secondary" : "primary"}
              disabled={isSubscriptionActionDisabled}
              onClick={() => setOpenSubscribe(true)}
              className="ml-auto"
            />
          </div>
        )}
      </div>
      <div className="my-6">
        {user.role === "GlobalNetwork" && subscriptionStatus?.annualTarget && (
          <div className="bg-white border rounded-lg p-4 mb-4 space-y-2">
            <h3 className="font-semibold">{subscriptionStatus.subscriptionYear} membership giving</h3>
            <p>
              {subscriptionStatus.currency} {Number(subscriptionStatus.paidAmount || 0).toFixed(2)} confirmed of{" "}
              {Number(subscriptionStatus.annualTarget).toFixed(2)} ·{" "}
              {Number(subscriptionStatus.remainingAmount).toFixed(2)} remaining
            </p>
            <progress
              className="w-full"
              max="100"
              value={subscriptionStatus.progressPercent || 0}
              aria-label="Annual membership payment progress"
            />
            <p className="text-sm text-gray-600">
              Pay in installments at any time. Only confirmed payments count toward your yearly target.
            </p>
          </div>
        )}
        <Tabs tabs={PAYMENT_TABS} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />
      </div>
      {user.role === "GlobalNetwork" && <ZelleTransfers />}
      {/* Payment Intents - Show all transactions with requery buttons */}
      <div className="mb-6">
        <PaymentIntents />
      </div>
      {/*  */}
      <MakeDonationModal
        isOpen={openDonate}
        onClose={() => setOpenDonate(false)}
        loading={isLoading}
        onSubmit={onSubmit}
      />{" "}
      {user.role === "GlobalNetwork" ? (
        <GlobalSubscriptionModal
          isOpen={openSubscribe}
          onClose={() => setOpenSubscribe(false)}
          onSubmit={onSubscribe}
          user={user}
          subscriptionStatus={subscriptionStatus}
        />
      ) : (
        <ConfirmSubscriptionModal
          isOpen={openSubscribe}
          onClose={() => setOpenSubscribe(false)}
          onSubmit={onSubscribe}
          loading={isSubscribing}
          isGlobalMember={false}
        />
      )}
      <NigerianLifetimeModal
        isOpen={openLifetime}
        onClose={() => setOpenLifetime(false)}
        onSubmit={onSubscribe}
        isLoading={isSubscribing}
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
