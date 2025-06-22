import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import icons from "~/assets/js/icons";
import PaypalPaymentButton from "~/components/DashboardComponents/Payments/PaypalPaymentButton";
import BackButton from "~/components/Global/BackButton/BackButton";
import Button from "~/components/Global/Button/Button";
import Modal from "~/components/Global/Modal/Modal";
import {
  useConfirmEventPaymentMutation,
  useGetSingleEventQuery,
  useGetUserPaymentPlansQuery,
  usePayForEventMutation,
  useRegisterForEventMutation,
} from "~/redux/api/events/eventsApi";
import { selectAuth } from "~/redux/features/auth/authSlice";
import { classNames } from "~/utilities/classNames";
import formatDate from "~/utilities/fomartDate";
import { formatCurrency } from "~/utilities/formatCurrency";

const DashboardStoreSingleEventPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const paymentSuccess = searchParams.get("payment");
  const reference = searchParams.get("reference");
  const source = searchParams.get("source");
  const navigate = useNavigate();
  const { data: singleEvent, refetch } = useGetSingleEventQuery(slug, { refetchOnMountOrArgChange: true });

  const { data: paymentPlansData } = useGetUserPaymentPlansQuery(slug, {
    skip: !slug,
    refetchOnMountOrArgChange: true,
  });

  const [registerForEvent, { isLoading: isRegistering }] = useRegisterForEventMutation();
  const [payForEvent, { isLoading: isPaying }] = usePayForEventMutation();
  const [confirmRegister, setConfirmRegister] = useState(false);
  const { user } = useSelector(selectAuth);
  const [openSuccess, setOpenSuccess] = useState(false);

  const [confirmPayment, { isLoading: isConfirming }] = useConfirmEventPaymentMutation();

  const wasCalled = useRef(false);

  useEffect(() => {
    setConfirmRegister(false);
    if (wasCalled.current) return;
    if (paymentSuccess && reference) {
      setOpenSuccess(true);
      wasCalled.current = true;
      // if (source?.toUpperCase() === "PAYPAL") {
      confirmPayment({ reference, source })
        .unwrap()
        .then(() => {
          toast.success("Event registeration successfully");
        });
      // }
    }
  }, [reference, paymentSuccess, source, confirmPayment]);
  const getPaymentBreakdown = () => {
    return paymentPlansData?.paymentBreakdown || null;
  };

  const getCurrentPrice = () => {
    // Use the paymentBreakdown if available (includes fees)
    if (paymentPlansData?.paymentBreakdown) {
      return paymentPlansData.paymentBreakdown.chargeAmount || 0;
    }

    // Fallback to payment plans from singleEvent
    if (!singleEvent?.paymentPlans || singleEvent.paymentPlans.length === 0) return 0;

    const plan = singleEvent.paymentPlans.find((p) => p.role === user?.role);
    return plan?.price || 0;
  };

  const handleSocialsShare = (social) => {
    const pageUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(singleEvent?.name);
    // socials
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${shareText}`;
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${shareText}`;
    const whatsAppUrl = `https://wa.me/?text=${shareText}%20${pageUrl}`;
    //
    switch (social) {
      case "facebook":
        window.open(facebookUrl, "_blank");
        break;
      case "twitter":
        window.open(twitterUrl, "_blank");
        break;
      case "linkedIn":
        window.open(linkedInUrl, "_blank");
        break;
      case "whatsapp":
        window.open(whatsAppUrl, "_blank");
        break;
      default:
        break;
    }
  };

  const handleRegisterEvent = async () => {
    if (singleEvent?.isPaid) {
      const res = await payForEvent({ slug }).unwrap();
      if (user.role === "GlobalNetwork") return res.id;
      else window.open(res.checkout_url, "_self");
      //
    } else {
      registerForEvent({ slug })
        .unwrap()
        .then(() => {
          toast.success("Registered for event successfully");
          setConfirmRegister(false);
        });
    }
  };

  return (
    <div>
      {/* SEO Starts */}
      <Helmet>
        <title>{singleEvent?.name}</title>
        {/* Open Graph tags for social sharing */}
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={singleEvent?.name} />
        <meta property="og:description" content={singleEvent?.description} />
        <meta property="og:image" content={singleEvent?.featuredImageUrl} />
        {/* Twitter Card tags for Twitter sharing */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={singleEvent?.name} />
        <meta name="twitter:description" content={singleEvent?.description} />
        <meta name="twitter:image" content={singleEvent?.featuredImageUrl} />
      </Helmet>
      {/* SEO Ends */}

      <BackButton label="Back to Events List" to="/dashboard/events" />

      <section className="bg-white rounded-2xl p-6 shadow w-full mt-6">
        <span className="capitalize bg-onTertiary text-tertiary px-4 py-2 rounded-lg text-xs font-semibold mb-4 inline-block">
          {singleEvent?.eventType}
        </span>

        <h2 className="font-bold mb-4 text-2xl">{singleEvent?.name}</h2>

        <img src={singleEvent?.featuredImageUrl} className="w-full max-h-[500px] mb-6" />

        <p className="text-base">{singleEvent?.description}</p>

        <div className="mt-6">
          <h4 className="text-sm text-gray-600 font-semibold uppercase mb-1">
            Event {singleEvent?.eventType === "Physical" ? "Location" : "Link"}
          </h4>
          <p className="text-base mb-1">{singleEvent?.linkOrLocation}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {" "}
          {singleEvent?.isPaid ? (
            <div>
              <h4 className="text-sm text-gray-600 font-semibold uppercase mb-1">Payment Plans</h4>
              {singleEvent?.paymentPlans.map((x, index) => (
                <p
                  className="text-sm mb-2"
                  key={`payment-plan-${x.role}-${index}-${x.registrationPeriod || "regular"}`}
                >
                  {x.role}
                  {x.registrationPeriod ? ` - ${x.registrationPeriod}` : ""}
                  {" - "}
                  {formatCurrency(x.price, x.role === "GlobalNetwork" ? "USD" : "NGN")}{" "}
                </p>
              ))}
              {/* Payment Breakdown */}
              {getPaymentBreakdown() && (
                <div className="bg-blue-50 p-3 rounded-lg mt-3">
                  <h5 className="text-sm font-semibold text-blue-800 mb-2">
                    {getPaymentBreakdown().includesFees ? "Your Payment Breakdown:" : "Payment Information:"}
                  </h5>
                  <div className="space-y-1 text-xs">
                    {getPaymentBreakdown().includesFees ? (
                      // Show detailed breakdown when fees are included
                      <>
                        <div className="flex justify-between">
                          <span>Event Fee:</span>
                          <span>
                            {formatCurrency(
                              getPaymentBreakdown().baseAmount,
                              user?.role === "GlobalNetwork" ? "USD" : "NGN"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Processing Fee:</span>
                          <span>
                            {formatCurrency(
                              getPaymentBreakdown().feeBreakdown.totalFees,
                              user?.role === "GlobalNetwork" ? "USD" : "NGN"
                            )}
                          </span>
                        </div>
                        <div className="border-t pt-1 flex justify-between font-semibold text-blue-800">
                          <span>Total Amount:</span>
                          <span>
                            {formatCurrency(getCurrentPrice(), user?.role === "GlobalNetwork" ? "USD" : "NGN")}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          <strong>Note:</strong> Processing fee ensures the organization receives the full event fee.
                        </div>
                      </>
                    ) : (
                      // Show simple payment info when no fees
                      <>
                        <div className="flex justify-between font-semibold text-blue-800">
                          <span>Registration Fee:</span>
                          <span>
                            {formatCurrency(
                              getPaymentBreakdown().baseAmount,
                              user?.role === "GlobalNetwork" ? "USD" : "NGN"
                            )}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          <strong>Payment Method:</strong> {getPaymentBreakdown().paymentMethod} (
                          {getPaymentBreakdown().currency})
                        </div>
                        <div className="text-xs text-orange-600 mt-1">
                          <strong>Note:</strong> This event does not include additional processing fees.
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : null}
          <div>
            <h4 className="text-sm text-gray-600 font-semibold uppercase mb-1">Event Date &amp; Time</h4>
            <p className="text-base mb-1">{formatDate(singleEvent?.eventDateTime).dateTime}</p>
          </div>
          <div className="col-span-2">
            <h4 className="text-sm text-gray-600 font-semibold uppercase mb-2">Members Group</h4>
            <p className="flex flex-wrap gap-4">
              {" "}
              {singleEvent?.membersGroup?.map((grp, index) => (
                <span
                  key={`member-group-${grp}-${index}`}
                  className={classNames(
                    "capitalize px-4 py-2 rounded text-xs font-medium",
                    grp === "Student"
                      ? "bg-onPrimaryContainer text-primary"
                      : grp === "Doctor"
                        ? "bg-onSecondaryContainer text-secondary"
                        : "bg-onTertiaryContainer text-tertiary"
                  )}
                >
                  {grp}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm text-gray-600 font-semibold uppercase mb-1">Additional Information</h4>
          <p className="text-base mb-1">{singleEvent?.additionalInformation}</p>
        </div>

        <div className="flex flex-wrap gap-4 my-6">
          {" "}
          {singleEvent?.eventTags?.map((tag, index) => (
            <span
              key={`event-tag-${tag}-${index}`}
              className="capitalize bg-gray-light px-4 py-2 rounded text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-1">
          <h4 className="text-sm text-gray-600 font-semibold uppercase mb-1">Share this Event</h4>
          <div className="flex flex-wrap gap-x-5">
            {["facebook", "twitter", "whatsapp", "linkedIn"].map((item) => (
              <button
                key={item}
                type="button"
                className="bg-gray-light rounded-full text-xl h-10 w-10 inline-flex justify-center items-center hover:text-primary"
                onClick={() => handleSocialsShare(item)}
              >
                {icons[item]}
              </button>
            ))}
          </div>
        </div>

        {new Date(singleEvent?.eventDateTime).getTime() > Date.now() && (
          <div className="flex flex-wrap gap-2 lg:gap-4 justify-end mt-4 mb-4">
            <Button
              label={
                singleEvent?.registeredUsers?.find((x) => x.userId == user._id)
                  ? "Already Registered"
                  : "Register for Event"
              }
              large
              disabled={singleEvent?.registeredUsers?.find((x) => x.userId == user._id)}
              onClick={() => setConfirmRegister(true)}
            />
          </div>
        )}
      </section>

      <Modal isOpen={confirmRegister} onClose={() => setConfirmRegister(false)} className="m-4" maxWidth={480}>
        <div className="flex flex-col gap-4">
          <span
            className={classNames(
              "text-3xl rounded-full w-14 h-14 inline-flex justify-center items-center mx-auto p-2",
              "bg-onPrimary text-primary"
            )}
          >
            {icons.calendar}
          </span>

          <div>
            <h4 className={classNames("text-lg font-semibold mb-1 text-center")}>Register For This Event?</h4>
            <p className={classNames("text-sm capitalize")}>
              <b>NAME:</b> {singleEvent?.name}
            </p>
            <p className={classNames("text-sm")}>
              <b>DATE:</b> {formatDate(singleEvent?.eventDateTime).dateTime}
            </p>
            <p className={classNames("text-sm")}>
              <b>LOCATION:</b> {singleEvent?.linkOrLocation}
            </p>{" "}
            {singleEvent?.isPaid && (
              <div>
                <p className={classNames("text-sm mt-1")}>
                  <b className="text-error font-bold">NOTE:</b> This is a paid event, you will be redirected to pay a
                  payment channel to complete payment. After completing your payment, you will be automatically
                  redirected back to the website. Please be patient and wait for the redirection to ensure your payment
                  is logged correctly.
                </p>{" "}
                {/* Fee Breakdown in Modal */}
                {getPaymentBreakdown() && (
                  <div className="bg-blue-50 p-3 rounded-lg mt-3">
                    <p className="text-sm font-semibold text-blue-800 mb-2">
                      {getPaymentBreakdown().includesFees ? "Payment Details:" : "Payment Information:"}
                    </p>
                    <div className="space-y-1 text-xs">
                      {getPaymentBreakdown().includesFees ? (
                        // Show detailed breakdown when fees are included
                        <>
                          <div className="flex justify-between">
                            <span>Event Fee:</span>
                            <span>
                              {formatCurrency(
                                getPaymentBreakdown().baseAmount,
                                user?.role === "GlobalNetwork" ? "USD" : "NGN"
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Processing Fee:</span>
                            <span>
                              {formatCurrency(
                                getPaymentBreakdown().feeBreakdown.totalFees,
                                user?.role === "GlobalNetwork" ? "USD" : "NGN"
                              )}
                            </span>
                          </div>
                          <div className="border-t pt-1 flex justify-between font-semibold text-blue-800">
                            <span>Total Amount:</span>
                            <span>
                              {formatCurrency(getCurrentPrice(), user?.role === "GlobalNetwork" ? "USD" : "NGN")}
                            </span>
                          </div>
                        </>
                      ) : (
                        // Show simple payment info when no fees
                        <>
                          <div className="flex justify-between font-semibold text-blue-800">
                            <span>Registration Fee:</span>
                            <span>
                              {formatCurrency(
                                getPaymentBreakdown().baseAmount,
                                user?.role === "GlobalNetwork" ? "USD" : "NGN"
                              )}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            <strong>Payment Method:</strong> {getPaymentBreakdown().paymentMethod}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {user?.role === "GlobalNetwork" && (
            <div className="text-sm text-center text-tertiary font-medium">
              If the PayPal button does not appear, please reload the page.
            </div>
          )}

          <div className={classNames("grid grid-cols-2 gap-4 items-center")}>
            <Button className="w-full mb-1.5" variant="outlined" large onClick={() => setConfirmRegister(false)}>
              No, Cancel
            </Button>

            {user.role === "GlobalNetwork" && singleEvent?.isPaid ? (
              <PaypalPaymentButton
                onApprove={(data) => {
                  navigate(
                    `/dashboard/events/${singleEvent.slug}?payment=successful&reference=${data.orderID}&source=PAYPAL`
                  );
                }}
                createOrder={handleRegisterEvent}
              />
            ) : (
              <Button className="w-full mb-1.5" large loading={isRegistering || isPaying} onClick={handleRegisterEvent}>
                {singleEvent?.isPaid ? "Yes, Make Payment" : "Yes, Proceed"}
              </Button>
            )}
          </div>
        </div>
      </Modal>

      <Modal isOpen={openSuccess}>
        <div className="flex flex-col gap-4 text-center">
          <span className="text-6xl text-primary mx-auto">{icons.checkAlt}</span>
          <h3 className="text-xl font-bold capitalize">Event Payment Successful</h3>

          <p className="text-base text-gray-600">
            You have successfully paid and registered for this event - {singleEvent?.name?.toUpperCase()}
          </p>
          <Button
            label="Continue"
            large
            loading={isConfirming}
            onClick={() => {
              setOpenSuccess(false);
              refetch();
              navigate(`/dashboard/events/${slug}`);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default DashboardStoreSingleEventPage;
