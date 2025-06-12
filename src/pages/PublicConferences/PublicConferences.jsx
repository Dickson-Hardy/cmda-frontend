import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiArrowRight } from "react-icons/fi";
import { useGetPublicConferencesQuery, useCheckUserExistsMutation } from "~/redux/api/events/eventsApi";
import EmptyLayout from "~/layouts/EmptyLayout/EmptyLayout";
import LoadingSpinner from "~/components/LoadingSpinner/LoadingSpinner";
import { conferenceTypes, conferenceZones, conferenceRegions } from "~/constants/conferences";

export default function PublicConferences() {
  const navigate = useNavigate();
  const [selectedConference, setSelectedConference] = useState(null);
  const [email, setEmail] = useState("");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false);

  const { data: conferences, isLoading, error } = useGetPublicConferencesQuery();
  const [checkUserExists] = useCheckUserExistsMutation();

  const handleRegisterClick = (conference) => {
    setSelectedConference(conference);
    setShowRegistrationModal(true);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsCheckingUser(true);
    try {
      const result = await checkUserExists({ email }).unwrap();

      if (result.exists) {
        // User exists, redirect to login with conference registration intent
        const params = new URLSearchParams({
          email,
          conferenceId: selectedConference._id,
          returnTo: `/events/conferences/${selectedConference.slug}?register=true`,
        });
        navigate(`/login?${params.toString()}`);
      } else {
        // User doesn't exist, redirect to signup
        const params = new URLSearchParams({
          email,
          conferenceId: selectedConference._id,
          returnTo: `/events/conferences/${selectedConference.slug}?register=true`,
        });
        navigate(`/signup?${params.toString()}`);
      }
    } catch (error) {
      toast.error("Failed to check user status. Please try again.");
    } finally {
      setIsCheckingUser(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
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

  const isRegistrationOpen = (conference) => {
    if (!conference.conferenceConfig?.registrationPeriods) return false;

    const now = new Date();
    const lateEnd = new Date(conference.conferenceConfig.registrationPeriods.late.endDate);

    return now <= lateEnd;
  };

  const getCurrentRegistrationPeriod = (conference) => {
    if (!conference.conferenceConfig?.registrationPeriods) return null;

    const now = new Date();
    const regularEnd = new Date(conference.conferenceConfig.registrationPeriods.regular.endDate);

    return now <= regularEnd ? "regular" : "late";
  };

  const getCurrentPrice = (conference) => {
    if (!conference.conferenceConfig?.registrationPeriods) return 0;

    const period = getCurrentRegistrationPeriod(conference);
    if (!period) return 0;

    return conference.conferenceConfig.registrationPeriods[period].price || 0;
  };

  if (isLoading) {
    return (
      <EmptyLayout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </EmptyLayout>
    );
  }

  if (error) {
    return (
      <EmptyLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Conferences</h2>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      </EmptyLayout>
    );
  }

  return (
    <EmptyLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">CMDA Conferences</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join fellow Christian medical and dental professionals at our upcoming conferences. Grow in faith, learn
                from experts, and build lasting connections.
              </p>
            </div>
          </div>
        </div>

        {/* Conferences Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {conferences && conferences.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {conferences.map((conference) => (
                <div
                  key={conference._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Conference Image */}
                  {conference.image && (
                    <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                      <img src={conference.image} alt={conference.title} className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                          {getConferenceTypeLabel(conference.conferenceConfig?.type)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Conference Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{conference.title}</h3>

                    {/* Conference Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3">{conference.description}</p>

                    {/* Conference Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-700">
                        <FiCalendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">{formatDate(conference.startDate)}</span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <FiMapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {conference.conferenceConfig?.zone &&
                            getConferenceZoneLabel(conference.conferenceConfig.zone)}
                          {conference.conferenceConfig?.region &&
                            getConferenceRegionLabel(conference.conferenceConfig.region)}
                          {conference.location}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <FiUsers className="w-4 h-4 mr-2" />
                        <span className="text-sm">{getConferenceTypeLabel(conference.conferenceConfig?.type)}</span>
                      </div>

                      {getCurrentPrice(conference) > 0 && (
                        <div className="flex items-center text-green-600">
                          <FiDollarSign className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">
                            {formatPrice(getCurrentPrice(conference))}
                            {getCurrentRegistrationPeriod(conference) === "late" && (
                              <span className="text-orange-500 ml-1">(Late Registration)</span>
                            )}
                          </span>
                        </div>
                      )}

                      {getCurrentPrice(conference) === 0 && (
                        <div className="flex items-center text-green-600">
                          <FiDollarSign className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Free</span>
                        </div>
                      )}
                    </div>

                    {/* Registration Status */}
                    {isRegistrationOpen(conference) ? (
                      <button
                        onClick={() => handleRegisterClick(conference)}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                      >
                        Register Now
                        <FiArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    ) : (
                      <div className="w-full bg-gray-100 text-gray-500 py-3 px-4 rounded-lg font-medium text-center">
                        Registration Closed
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Conferences Available</h3>
              <p className="text-gray-600">Check back later for upcoming conferences.</p>
            </div>
          )}
        </div>

        {/* Registration Modal */}
        {showRegistrationModal && selectedConference && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Register for {selectedConference.title}</h3>

              <p className="text-gray-600 mb-6">
                Enter your email address to continue. We&apos;ll check if you&apos;re already a member or help you
                create an account.
              </p>

              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRegistrationModal(false);
                      setEmail("");
                      setSelectedConference(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCheckingUser}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {isCheckingUser ? "Checking..." : "Continue"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </EmptyLayout>
  );
}
