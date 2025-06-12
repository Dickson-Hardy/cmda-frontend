import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetPublicConferencesQuery, useCheckUserExistsMutation } from "~/redux/api/events/eventsApi";
import { formatDateTime } from "~/utilities/formatDateTime";
import { formatCurrency } from "~/utilities/formatCurrency";
import Button from "~/components/Global/Button/Button";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import Select from "~/components/Global/FormElements/Select/Select";
import { conferenceTypes, conferenceZones, conferenceRegions } from "~/constants/conferences";
import { useForm } from "react-hook-form";
import Loading from "~/components/Global/Loading/Loading";

const PublicConferences = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedConference, setSelectedConference] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { control, register, watch } = useForm();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
    reset: resetEmail,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const searchBy = watch("searchBy");
  const conferenceType = watch("conferenceType");
  const zone = watch("zone");
  const region = watch("region");
  const membersGroup = watch("membersGroup");

  const {
    data: conferences,
    isLoading,
    error,
  } = useGetPublicConferencesQuery({
    page: currentPage,
    limit: 12,
    ...(searchBy && { searchBy }),
    ...(conferenceType && { conferenceType }),
    ...(zone && { zone }),
    ...(region && { region }),
    ...(membersGroup && { membersGroup }),
  });

  const [
    checkUserExists,
    { isLoading: isCheckingUser, isError: isCheckUserError, error: checkUserErrorData, data: checkUserResponse },
  ] = useCheckUserExistsMutation();

  const conferenceData = conferences?.items || [];
  const meta = conferences?.meta || {};

  // Debug logging
  console.log("Conferences API Response:", conferences);
  console.log("Conference Data:", conferenceData);
  console.log("Meta:", meta);
  console.log("Error:", error);

  const getConferenceTypeDisplay = (conf) => {
    const type = conf.conferenceConfig?.conferenceType;
    if (type === "Zonal") {
      return `${type} - ${conf.conferenceConfig?.zone}`;
    } else if (type === "Regional") {
      return `${type} - ${conf.conferenceConfig?.region}`;
    }
    return type || "Conference";
  };

  const getRegistrationStatus = (conf) => {
    // Use the backend-provided registration status if available
    if (conf.registrationStatus) {
      switch (conf.registrationStatus) {
        case "regular":
          return "Early Bird";
        case "late":
          return "Late Registration";
        case "closed":
          return "Closed";
        default:
          return "Open";
      }
    }

    // Fallback to frontend calculation if backend status not available
    if (!conf.conferenceConfig) return "Open";

    const now = new Date();
    const regularEnd = new Date(conf.conferenceConfig.regularRegistrationEndDate);
    const lateEnd = new Date(conf.conferenceConfig.lateRegistrationEndDate);

    if (now <= regularEnd) return "Early Bird";
    if (now <= lateEnd) return "Late Registration";
    return "Closed";
  };

  const getLowestPrice = (conf) => {
    if (!conf.isPaid || !conf.paymentPlans?.length) return "Free";
    const prices = conf.paymentPlans.map((plan) => plan.price);
    return formatCurrency(Math.min(...prices));
  };
  const handleRegisterClick = (conference) => {
    setSelectedConference(conference);
    setShowRegistrationModal(true);
  };

  const handleEmailCheck = async (data) => {
    setEmailError("");
    if (!data.email) {
      setEmailError("Email is required.");
      toast.error("Email is required.");
      return;
    }
    // Basic email format check (consider a more robust one if needed)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setEmailError("Invalid email format.");
      toast.error("Invalid email format.");
      return;
    }

    const email = data.email.trim().toLowerCase();

    console.log("PublicConferences.jsx: Checking email:", email);
    try {
      // The RTK Query hook handles the async logic
      // The result will be in checkUserResponse, and errors in checkUserErrorData
      await checkUserExists({ email }).unwrap();
      // unwrap() will throw an error if the mutation fails, which is caught below
    } catch (error) {
      console.error("PublicConferences.jsx: Error during email check:", error);
      let errorMessage = "Failed to check email. Please try again.";
      if (error.status) {
        // This is likely an error from RTK Query (e.g., HTTP error)
        errorMessage = `Error ${error.status}: `;
        if (error.data && error.data.message) {
          if (Array.isArray(error.data.message)) {
            errorMessage += error.data.message.join(", ");
          } else {
            errorMessage += error.data.message;
          }
        } else if (typeof error.data === "string") {
          errorMessage += error.data;
        } else {
          errorMessage += "An unexpected error occurred.";
        }
      } else if (error.message) {
        // This might be a network error or other client-side error
        errorMessage = error.message;
      }

      setEmailError(errorMessage);
      toast.error(errorMessage);
    }
  };
  useEffect(() => {
    if (checkUserResponse && selectedConference) {
      console.log("PublicConferences.jsx: Email check response:", checkUserResponse);
      const email = checkUserResponse.email || "";

      if (checkUserResponse.exists) {
        // User exists, redirect to login with conference slug
        navigate(`/login?conference=${selectedConference.slug}&email=${email}`);
      } else {
        // User doesn't exist, redirect to signup with conference slug
        navigate(`/signup?conference=${selectedConference.slug}&email=${email}`);
      }
    }
  }, [checkUserResponse, navigate, selectedConference]);

  // It's good practice to also log the raw error object from the hook if it occurs
  useEffect(() => {
    if (isCheckUserError && checkUserErrorData) {
      console.error(
        "PublicConferences.jsx: RTK Query checkUserExists mutation error:",
        JSON.stringify(checkUserErrorData, null, 2) // Pretty print the error object
      );
      // The error is already handled by the catch block in handleEmailCheck if using unwrap()
      // If not using unwrap(), you would handle it here.
      // For now, the toast in handleEmailCheck's catch block should suffice.
    }
  }, [isCheckUserError, checkUserErrorData]);

  const closeModal = () => {
    setShowRegistrationModal(false);
    setSelectedConference(null);
    resetEmail();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading height={64} width={64} className="text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">CMDA Conferences</h1>
          <p className="mt-2 text-gray-600">
            Join our upcoming conferences and connect with medical professionals worldwide
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filter Conferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TextInput label="Search" placeholder="Search conferences..." register={register} name="searchBy" />
            <Select
              label="Conference Type"
              control={control}
              name="conferenceType"
              options={[{ value: "", label: "All Types" }, ...conferenceTypes]}
            />
            {conferenceType === "Zonal" && (
              <Select
                label="Zone"
                control={control}
                name="zone"
                options={[{ value: "", label: "All Zones" }, ...conferenceZones]}
              />
            )}
            {conferenceType === "Regional" && (
              <Select
                label="Region"
                control={control}
                name="region"
                options={[{ value: "", label: "All Regions" }, ...conferenceRegions]}
              />
            )}
            <Select
              label="Target Audience"
              control={control}
              name="membersGroup"
              options={[
                { value: "", label: "All Audiences" },
                { value: "Student", label: "Students" },
                { value: "Doctor", label: "Doctors" },
                { value: "GlobalNetwork", label: "Global Network" },
              ]}
            />
          </div>
        </div>{" "}
        {/* Conference Grid */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Error loading conferences: {error.message || "Unknown error"}</p>
            <p className="text-gray-500 text-sm mt-2">Check the console for more details.</p>
          </div>
        )}
        {!error && conferenceData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No conferences found matching your criteria.</p>
            <p className="text-gray-400 text-sm mt-2">
              Total conferences in response: {conferences?.items?.length || 0}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conferenceData.map((conference) => (
              <div
                key={conference._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {conference.featuredImageUrl && (
                  <img src={conference.featuredImageUrl} alt={conference.name} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-primary font-medium">{getConferenceTypeDisplay(conference)}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        getRegistrationStatus(conference) === "Early Bird"
                          ? "bg-green-100 text-green-800"
                          : getRegistrationStatus(conference) === "Late Registration"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {getRegistrationStatus(conference)}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{conference.name}</h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{conference.description}</p>

                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <span className="font-medium">Date:</span>
                      <span className="ml-2">{formatDateTime(conference.eventDateTime)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Type:</span>
                      <span className="ml-2">{conference.eventType}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">Price:</span>
                      <span className="ml-2 font-semibold text-primary">
                        {getLowestPrice(conference)}
                        {conference.isPaid && conference.paymentPlans?.length > 1 && " (starting from)"}
                      </span>
                    </div>
                  </div>

                  <Button
                    label={getRegistrationStatus(conference) === "Closed" ? "Registration Closed" : "Register Now"}
                    className="w-full"
                    disabled={getRegistrationStatus(conference) === "Closed"}
                    onClick={() => handleRegisterClick(conference)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    page === currentPage ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-50 border"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Register for Conference</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>
              <div className="mb-4">
                <h4 className="font-medium text-gray-900">{selectedConference?.name}</h4>
                <p className="text-sm text-gray-600">{formatDateTime(selectedConference?.eventDateTime)}</p>
              </div>{" "}
              <form onSubmit={handleEmailSubmit(handleEmailCheck)}>
                {" "}
                <TextInput
                  name="email"
                  label="email" // This ensures the field is registered as 'email'
                  title="Email Address" // This is what is displayed to the user
                  placeholder="Enter your email to continue"
                  register={registerEmail}
                  type="email"
                  required
                  errors={emailErrors}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  }}
                />
                <div className="mt-4 text-sm text-gray-600">
                  <p>We&apos;ll check if you&apos;re already a member:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>If you&apos;re a member, you&apos;ll be directed to sign in</li>
                    <li>If you&apos;re new, you&apos;ll be directed to create an account</li>
                  </ul>
                </div>
                <div className="flex space-x-3 mt-6">
                  <Button label="Cancel" variant="outlined" onClick={closeModal} className="flex-1" />
                  <Button
                    label={isCheckingUser ? "Checking..." : "Continue"}
                    type="submit"
                    disabled={isCheckingUser}
                    className="flex-1"
                  />
                </div>
              </form>
              <div className="mt-4">
                {emailError && <p className="text-red-500 text-xs italic mt-2">{emailError}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicConferences;
