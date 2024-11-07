import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Loading from "~/components/Global/Loading/Loading";
import { useSaveDonationMutation } from "~/redux/api/payments/donationApi";
import { useSaveSubscriptionMutation } from "~/redux/api/payments/subscriptionApi";
import { setUser } from "~/redux/features/auth/authSlice";

const PaymentSuccessful = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const reference = searchParams.get("reference");
  const source = searchParams.get("source");
  const [saveDonation, { isLoading }] = useSaveDonationMutation();
  const [saveSubscription, { isLoading: isSubscribing }] = useSaveSubscriptionMutation();
  const wasCalled = useRef(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);

  useEffect(() => {
    if (wasCalled.current) return;
    wasCalled.current = true;
    if (reference) {
      if (type === "donation") {
        saveDonation({ reference, source: source || "PAYSTACK" })
          .unwrap()
          .then(() => setLoading(false))
          .catch((err) => {
            if (err.status === 409) setAlreadyConfirmed(true);
          })
          .finally(() => setLoading(false));
      }
      if (type === "subscription") {
        saveSubscription({ reference, source: source || "PAYSTACK" })
          .unwrap()
          .then((res) => {
            dispatch(setUser(res.user));
            setLoading(false);
          })
          .catch((err) => {
            if (err.status === 409) setAlreadyConfirmed(true);
          })
          .finally(() => setLoading(false));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="h-[70vh] w-full flex justify-center items-center">
      <div className="flex flex-col gap-4 text-center p-6 rounded-xl max-w-screen-sm w-full bg-white shadow">
        {loading || isLoading || isSubscribing ? (
          <div className="flex justify-center items-center">
            <Loading className="my-12 size-20 text-primary" />
          </div>
        ) : (
          <>
            <span className="text-6xl text-primary mx-auto">{icons.checkAlt}</span>
            <h3 className="text-xl font-bold capitalize">
              {type || "Payment"} {alreadyConfirmed ? "Already Confirmed" : "Successful"}
            </h3>
            {type === "donation" && !alreadyConfirmed && (
              <p className="text-base text-gray-600">
                Thank you for your generous donation! Your contribution will help us continue our work and make a
                difference.
              </p>
            )}
            {type === "subscription" && !alreadyConfirmed && (
              <p className="text-base text-gray-600">
                Thank you for subscribing! Your annual subscription is now active, and you can enjoy all the benefits
                and features available to our subscribers.
              </p>
            )}
            {alreadyConfirmed ? (
              <p className="text-base text-gray-600">
                Your {type?.toUpperCase()} with this reference {reference} has already been confirmed. If you have any
                questions, please don&apos;t hesitate to contact us.
              </p>
            ) : (
              <p className="text-base text-gray-600">
                An email confirmation has been sent to your inbox. If you have any questions, please don&apos;t hesitate
                to contact us.
              </p>
            )}
            <Button
              label="Continue"
              large
              loading={isLoading || isSubscribing}
              onClick={() => navigate(`/dashboard/payments?active=${type === "donation" ? 1 : 0}`)}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default PaymentSuccessful;
