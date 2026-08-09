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
  const reference = searchParams.get("reference") || searchParams.get("token");
  const source = searchParams.get("source");
  const cancelled = searchParams.get("cancelled") === "true";
  const [saveDonation, { isLoading }] = useSaveDonationMutation();
  const [saveSubscription, { isLoading: isSubscribing }] = useSaveSubscriptionMutation();
  const wasCalled = useRef(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (wasCalled.current) return;
    wasCalled.current = true;
    setErrorMessage("");
    if (cancelled) {
      setErrorMessage("The PayPal payment was cancelled. No charge was recorded.");
      setLoading(false);
    } else if (reference && ["donation", "subscription"].includes(type)) {
      // if (source?.toUpperCase() === "PAYPAL") {
      if (type === "donation") {
        saveDonation({ reference, source: source })
          .unwrap()
          .then(() => setLoading(false))
          .catch((err) => {
            if (err.status === 409) setAlreadyConfirmed(true);
            else setErrorMessage(err?.data?.message || "The donation payment could not be verified.");
          })
          .finally(() => setLoading(false));
      }
      if (type === "subscription") {
        saveSubscription({ reference, source: source })
          .unwrap()
          .then((res) => {
            dispatch(setUser(res.user));
            setLoading(false);
          })
          .catch((err) => {
            if (err.status === 409) setAlreadyConfirmed(true);
            else setErrorMessage(err?.data?.message || "The subscription payment could not be verified.");
          })
          .finally(() => setLoading(false));
      }
      // } else {
      //   setTimeout(() => {
      //     setLoading(false);
      //   }, 2000);
      // }
    } else {
      setErrorMessage(
        "The payment type or reference is missing or invalid. Check your transaction history before trying again."
      );
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const retryVerification = () => {
    wasCalled.current = false;
    setLoading(true);
    setAlreadyConfirmed(false);
    setErrorMessage("");
    setAttempt((value) => value + 1);
  };

  return (
    <section className="h-[70vh] w-full flex justify-center items-center">
      <div className="flex flex-col gap-4 text-center p-6 rounded-xl max-w-screen-sm w-full bg-white shadow">
        {loading || isLoading || isSubscribing ? (
          <div className="flex justify-center items-center">
            <Loading className="my-12 size-20 text-primary" />
          </div>
        ) : (
          <>
            <span className={`text-6xl mx-auto ${errorMessage ? "text-red-600" : "text-primary"}`}>
              {errorMessage ? icons.close : icons.checkAlt}
            </span>
            <h3 className="text-xl font-bold capitalize">
              {errorMessage
                ? "Payment Verification Failed"
                : `${type || "Payment"} ${alreadyConfirmed ? "Already Confirmed" : "Successful"}`}
            </h3>
            {errorMessage && <p className="text-base text-red-600">{errorMessage}</p>}
            {type === "donation" && !alreadyConfirmed && !errorMessage && (
              <p className="text-base text-gray-600">
                Thank you for your generous donation! Your contribution will help us continue our work and make a
                difference.
              </p>
            )}
            {type === "subscription" && !alreadyConfirmed && !errorMessage && (
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
            ) : !errorMessage ? (
              <p className="text-base text-gray-600">
                An email confirmation has been sent to your inbox. If you have any questions, please don&apos;t hesitate
                to contact us.
              </p>
            ) : null}
            {errorMessage ? (
              <Button label="Try Verification Again" large onClick={retryVerification} />
            ) : (
              <Button
                label="Continue"
                large
                loading={isLoading || isSubscribing}
                onClick={() => navigate(`/dashboard/payments?active=${type === "donation" ? 1 : 0}`)}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PaymentSuccessful;
