import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiClock, FiGlobe } from "react-icons/fi";
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
import formatDate from "~/utilities/fomartDate";
import { formatCurrency } from "~/utilities/formatCurrency";
import { conferenceTypes, conferenceZones, conferenceRegions } from "~/constants/conferences";

const SingleConferencePage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const paymentSuccess = searchParams.get("payment");
  const reference = searchParams.get("reference");
  const source = searchParams.get("source");
  const shouldRegister = searchParams.get("register");
  const navigate = useNavigate();
  const { data: conference, refetch } = useGetSingleEventQuery(slug, {
    refetchOnMountOrArgChange: true,
  });

  const { data: paymentPlansData } = useGetUserPaymentPlansQuery(slug, {
    skip: !slug,
    refetchOnMountOrArgChange: true,
  });

  const [registerForEvent, { isLoading: isRegistering }] = useRegisterForEventMutation();
  const [payForEvent, { isLoading: isPaying }] = usePayForEventMutation();
  const [confirmRegister, setConfirmRegister] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user } = useSelector(selectAuth);
  const [openSuccess, setOpenSuccess] = useState(false);

  const [confirmPayment] = useConfirmEventPaymentMutation();

  const wasCalled = useRef(false);

  useEffect(() => {
    setConfirmRegister(false);
    if (wasCalled.current) return;
    if (paymentSuccess && reference) {
      setOpenSuccess(true);
      wasCalled.current = true;
      confirmPayment({ reference, source })
        .unwrap()
        .then(() => {
          toast.success("Conference registration successful");
          refetch();
        });
    }
  }, [reference, paymentSuccess, source, confirmPayment, refetch]);

  // Auto-open registration modal if redirected from public page
  useEffect(() => {
    if (shouldRegister === "true" && conference && !conference.isRegistered) {
      setConfirmRegister(true);
    }
  }, [shouldRegister, conference]);

  const handleSocialsShare = (social) => {
    const pageUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(conference?.title);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${shareText}`;
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${shareText}`;
    const whatsAppUrl = `https://wa.me/?text=${shareText}%20${pageUrl}`;

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

  const getConferenceTypeLabel = (type) => {
    return conferenceTypes.find((t) => t.value === type)?.label || type;
  };

  const getConferenceZoneLabel = (zone) => {
    return conferenceZones.find((z) => z.value === zone)?.label || zone;
  };
  const getConferenceRegionLabel = (region) => {
    return conferenceRegions.find((r) => r.value === region)?.label || region;
  };

  const getCurrentRegistrationPeriod = () => {
    if (!paymentPlansData?.registrationInfo) return null;
    return paymentPlansData.registrationInfo.currentPeriod?.toLowerCase();
  };

  const getCurrentPrice = () => {
    // Use the paymentBreakdown if available (includes fees)
    if (paymentPlansData?.paymentBreakdown) {
      return paymentPlansData.paymentBreakdown.chargeAmount || 0;
    }

    // Fallback to payment plans
    if (!paymentPlansData?.paymentPlans || paymentPlansData.paymentPlans.length === 0) return 0;

    const currentPeriod = getCurrentRegistrationPeriod();
    if (!currentPeriod) return 0;

    // Find the payment plan for the current registration period
    const plan = paymentPlansData.paymentPlans.find((p) => p.registrationPeriod?.toLowerCase() === currentPeriod);

    return plan?.price || 0;
  };
  const getPaymentBreakdown = () => {
    console.log("Full paymentPlansData:", paymentPlansData);
    const breakdown = paymentPlansData?.paymentBreakdown || null;
    console.log("Payment breakdown:", breakdown);
    return breakdown;
  };

  const isRegistrationOpen = () => {
    if (!paymentPlansData?.registrationInfo) return false;
    return paymentPlansData.registrationInfo.isRegistrationOpen;
  };

  const handleRegisterConference = async () => {
    const currentPrice = getCurrentPrice();

    if (currentPrice > 0) {
      // Paid conference - proceed to payment
      setShowPaymentModal(true);
    } else {
      // Free conference - register directly
      registerForEvent({ slug })
        .unwrap()
        .then(() => {
          toast.success("Registered for conference successfully");
          setConfirmRegister(false);
          refetch();
        })
        .catch(() => {
          toast.error("Failed to register for conference");
        });
    }
  };

  const handlePayment = async (paymentMethod) => {
    try {
      const res = await payForEvent({
        slug,
        paymentMethod,
        amount: getCurrentPrice(),
        period: getCurrentRegistrationPeriod(),
      }).unwrap();

      if (paymentMethod === "paypal" || user.role === "GlobalNetwork") {
        return res.id;
      } else {
        // Paystack
        window.open(res.checkout_url, "_self");
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    }
  };

  if (!conference) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conference details...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {conference && typeof conference.title === "string" && (
        <Helmet>
          <title>{conference.title} - CMDA Conferences</title>
          <meta name="description" content={conference.description} />
        </Helmet>
      )}

      <div className="pb-8">
        <BackButton />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Conference Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {conference.image && (
            <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative">
              <img src={conference.image} alt={conference.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4">
                <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  {getConferenceTypeLabel(conference.conferenceConfig?.type)}
                </span>
              </div>
              {conference.isRegistered && (
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Registered</span>
                </div>
              )}
            </div>
          )}

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{conference.title}</h1>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <FiCalendar className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">Start Date</p>
                    <p className="text-sm">{formatDate(conference.startDate).date}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <FiClock className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">End Date</p>
                    <p className="text-sm">{formatDate(conference.endDate).date}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <FiMapPin className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm">{conference.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <FiUsers className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">Conference Type</p>
                    <p className="text-sm">{getConferenceTypeLabel(conference.conferenceConfig?.type)}</p>
                  </div>
                </div>
                {conference.conferenceConfig?.zone && (
                  <div className="flex items-center text-gray-700">
                    <FiGlobe className="w-5 h-5 mr-3" />
                    <div>
                      <p className="font-medium">Zone</p>
                      <p className="text-sm">{getConferenceZoneLabel(conference.conferenceConfig.zone)}</p>
                    </div>
                  </div>
                )}
                {conference.conferenceConfig?.region && (
                  <div className="flex items-center text-gray-700">
                    <FiGlobe className="w-5 h-5 mr-3" />
                    <div>
                      <p className="font-medium">Region</p>
                      <p className="text-sm">{getConferenceRegionLabel(conference.conferenceConfig.region)}</p>
                    </div>
                  </div>
                )}{" "}
                {getCurrentPrice() > 0 && (
                  <div className="flex items-center text-green-600">
                    <FiDollarSign className="w-5 h-5 mr-3" />
                    <div>
                      <p className="font-medium">Registration Fee</p>
                      <p className="text-sm">
                        {formatCurrency(getCurrentPrice())}
                        {getCurrentRegistrationPeriod() === "late" && (
                          <span className="text-orange-500 ml-1">(Late Registration)</span>
                        )}
                        {getPaymentBreakdown() && getPaymentBreakdown().includesFees && (
                          <span className="text-gray-500 ml-1">(includes processing fees)</span>
                        )}
                      </p>

                      {/* Debug info */}
                      <div className="text-xs text-red-500 mt-1">
                        DEBUG: Has breakdown: {getPaymentBreakdown() ? "Yes" : "No"} | Includes fees:{" "}
                        {getPaymentBreakdown()?.includesFees ? "Yes" : "No"}
                      </div>

                      {getPaymentBreakdown() && getPaymentBreakdown().includesFees && (
                        <div className="text-xs text-gray-500 mt-1">
                          Conference: {formatCurrency(getPaymentBreakdown().baseAmount)} + Processing:{" "}
                          {formatCurrency(getPaymentBreakdown().feeBreakdown.totalFees)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {getCurrentPrice() === 0 && (
                  <div className="flex items-center text-green-600">
                    <FiDollarSign className="w-5 h-5 mr-3" />
                    <div>
                      <p className="font-medium">Registration Fee</p>
                      <p className="text-sm">Free</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Button */}
            <div className="border-t pt-6">
              {conference.isRegistered ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">✓ You are registered for this conference</p>
                </div>
              ) : isRegistrationOpen() ? (
                <Button
                  onClick={() => setConfirmRegister(true)}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  Register for Conference
                </Button>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 font-medium">Registration Closed</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conference Description */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Conference</h2>
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: conference.description }}
          />
        </div>

        {/* Share Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Share This Conference</h3>
          <div className="flex space-x-3">
            <button
              onClick={() => handleSocialsShare("facebook")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Facebook
            </button>
            <button
              onClick={() => handleSocialsShare("twitter")}
              className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
              Twitter
            </button>
            <button
              onClick={() => handleSocialsShare("linkedIn")}
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              LinkedIn
            </button>
            <button
              onClick={() => handleSocialsShare("whatsapp")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Registration Confirmation Modal */}
      <Modal isOpen={confirmRegister} onClose={() => setConfirmRegister(false)} title="Confirm Registration">
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to register for <strong>{conference.title}</strong>?
          </p>

          {getCurrentPrice() > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-blue-800 mb-2">
                <strong>Registration Fee Details:</strong>
              </p>

              {getPaymentBreakdown() && getPaymentBreakdown().includesFees ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Conference Fee:</span>
                    <span>{formatCurrency(getPaymentBreakdown().baseAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Payment Processing Fees:</span>
                    <span>{formatCurrency(getPaymentBreakdown().feeBreakdown.totalFees)}</span>
                  </div>

                  <div className="text-xs text-gray-500 ml-4">
                    •{" "}
                    {(
                      (getPaymentBreakdown().feeBreakdown.percentageFee / getPaymentBreakdown().chargeAmount) *
                      100
                    ).toFixed(2)}
                    % + {formatCurrency(getPaymentBreakdown().feeBreakdown.fixedFee)} processing fee
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Amount to Pay:</span>
                    <span className="text-blue-600">{formatCurrency(getCurrentPrice())}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    <strong>Note:</strong> The processing fee ensures the organization receives the full conference fee
                    of {formatCurrency(getPaymentBreakdown().baseAmount)}.
                  </div>
                </div>
              ) : (
                <p className="text-blue-800">
                  <strong>Registration Fee:</strong> {formatCurrency(getCurrentPrice())}
                  {getCurrentRegistrationPeriod() === "late" && (
                    <span className="text-orange-600 ml-1">(Late Registration)</span>
                  )}
                </p>
              )}

              {getCurrentRegistrationPeriod() === "late" && (
                <div className="mt-2 text-orange-600 text-sm">
                  <strong>Late Registration</strong> - Higher fees apply after the early bird period.
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-3">
            <Button onClick={() => setConfirmRegister(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleRegisterConference}
              isLoading={isRegistering}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {getCurrentPrice() > 0 ? "Proceed to Payment" : "Register"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Payment Method Modal */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Choose Payment Method">
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Select your preferred payment method for {formatCurrency(getCurrentPrice())}
          </p>

          <div className="space-y-4">
            {/* Paystack Option */}
            <Button
              onClick={() => handlePayment("paystack")}
              isLoading={isPaying}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Pay with Paystack (Card/Bank Transfer)
            </Button>

            {/* PayPal Option for Global Network */}
            {(user?.role === "GlobalNetwork" || conference.conferenceConfig?.paymentMethods?.includes("paypal")) && (
              <div className="w-full">
                <PaypalPaymentButton
                  amount={getCurrentPrice()}
                  currency="USD"
                  createOrder={() => handlePayment("paypal")}
                  onApprove={(data) => {
                    navigate(
                      `/dashboard/events/conference/${conference.slug}?payment=successful&reference=${data.orderID}&source=PAYPAL`
                    );
                  }}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div className="mt-6">
            <Button onClick={() => setShowPaymentModal(false)} variant="outline" className="w-full">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={openSuccess} onClose={() => setOpenSuccess(false)} title="Registration Successful">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Successfully Registered!</h3>
          <p className="text-gray-600 mb-6">
            You have been registered for {conference.title}. You should receive a confirmation email shortly.
          </p>
          <Button
            onClick={() => {
              setOpenSuccess(false);
              navigate("/dashboard/events");
            }}
            className="w-full"
          >
            View My Conferences
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SingleConferencePage;
