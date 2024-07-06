import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import { useSaveDonationMutation } from "~/redux/api/payments/donationApi";
import { useSaveSubscriptionMutation } from "~/redux/api/payments/subscriptionApi";
import { setUser } from "~/redux/features/auth/authSlice";

const PaymentSuccessful = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const reference = searchParams.get("reference");
  const [saveDonation, { isLoading }] = useSaveDonationMutation();
  const [saveSubscription, { isLoading: isSubscribing }] = useSaveSubscriptionMutation();
  const wasCalled = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wasCalled.current) return;
    wasCalled.current = true;
    if (type === "donation") saveDonation({ reference });
    if (type === "subscription")
      saveSubscription({ reference })
        .unwrap()
        .then((res) => {
          dispatch(setUser(res.user));
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="h-[70vh] w-full flex justify-center items-center">
      <div className="flex flex-col gap-4 text-center p-6 rounded-xl max-w-screen-sm bg-white shadow">
        <span className="text-6xl text-primary mx-auto">{icons.checkAlt}</span>
        <h3 className="text-xl font-bold capitalize">{type || "Payment"} Successful</h3>
        {type === "donation" && (
          <p className="text-base text-gray-600">
            Thank you for your generous donation! Your contribution will help us continue our work and make a
            difference.
          </p>
        )}
        {type === "subscription" && (
          <p className="text-base text-gray-600">
            Thank you for subscribing! Your annual subscription is now active, and you can enjoy all the benefits and
            features available to our subscribers.
          </p>
        )}
        <p className="text-base text-gray-600">
          An email confirmation has been sent to your inbox. If you have any questions, please don&apos;t hesitate to
          contact us.
        </p>
        <Button
          label="Continue"
          large
          loading={isLoading || isSubscribing}
          onClick={() => navigate("/dashboard/payments")}
        />
      </div>
    </section>
  );
};

export default PaymentSuccessful;
