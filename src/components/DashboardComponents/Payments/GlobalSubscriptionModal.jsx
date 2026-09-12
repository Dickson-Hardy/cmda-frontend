import { useState } from "react";
import { useForm } from "react-hook-form";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Modal from "~/components/Global/Modal/Modal";
import Select from "~/components/Global/FormElements/Select/Select";
import {
  GLOBAL_INCOME_BASED_PRICING,
  LIFETIME_MEMBERSHIPS,
  INCOME_BRACKETS,
  UK_EUROPE_SUBSCRIPTION,
  isUkEuropeGlobalMember,
} from "~/constants/subscription";
import { classNames } from "~/utilities/classNames";
import { formatCurrency } from "~/utilities/formatCurrency";
import PayPalRedirectButton from "./PayPalRedirectButton";

const GlobalSubscriptionModal = ({ isOpen, onClose, onSubmit, user, subscriptionStatus }) => {
  const [selectedTab, setSelectedTab] = useState("regular");
  const [paymentOption, setPaymentOption] = useState("monthly");
  const currentYear = new Date().getFullYear();
  const [targetYear, setTargetYear] = useState(currentYear);
  const isUkEuropeMember = isUkEuropeGlobalMember(user);
  const remainingAmount = subscriptionStatus?.remainingAmount ?? UK_EUROPE_SUBSCRIPTION.annualTarget;

  const {
    control,
    watch,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      incomeBracket: "less_than_50k",
      isVisionPartner: false,
      lifetimeType: "gold",
    },
  });

  const watchedIncomeBracket = watch("incomeBracket");
  const watchedLifetimeType = watch("lifetimeType");

  const getCurrentPrice = () => {
    if (selectedTab === "lifetime") {
      return LIFETIME_MEMBERSHIPS[watchedLifetimeType]?.price || 0;
    }

    const bracket = GLOBAL_INCOME_BASED_PRICING[watchedIncomeBracket];
    return bracket ? bracket.annual : 0;
  };

  const handleFormSubmit = (data) => {
    const subscriptionData = {
      selectedTab,
      ...(selectedTab === "lifetime"
        ? { lifetimeType: data.lifetimeType }
        : isUkEuropeMember
          ? { paymentOption }
          : { incomeBracket: data.incomeBracket, targetYear }),
    };
    onSubmit(subscriptionData);
  };

  const handleModalClose = () => {
    reset();
    setSelectedTab("regular");
    setPaymentOption("monthly");
    setTargetYear(currentYear);
    onClose();
  };

  const availableYears = Array.from({ length: 3 }, (_, index) => currentYear - 2 + index);

  const tabs = [
    { id: "regular", label: isUkEuropeMember ? "Membership Payments" : "Annual Subscriptions", icon: icons.card },
    { id: "lifetime", label: "Lifetime Membership", icon: icons.star },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} className="m-2" maxWidth={600}>
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <span
            className={classNames(
              "text-3xl rounded-full w-14 h-14 inline-flex justify-center items-center mx-auto p-2 mb-4",
              "bg-onPrimary text-primary"
            )}
          >
            {icons.card}
          </span>{" "}
          <h4 className="text-xl font-semibold mb-2">Choose Your Membership Plan</h4>
          <p className="text-sm text-gray-600 mb-4">
            {isUkEuropeMember
              ? `Pay toward your ${currentYear} UK/Europe membership at any time.`
              : "Select the plan that best fits your income level and commitment"}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4" role="tablist" aria-label="Membership plan type">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selectedTab === tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={classNames(
                "flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium border-b-2 transition-colors",
                selectedTab === tab.id
                  ? "border-primary text-primary bg-onPrimary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-center leading-tight">{tab.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Subscriptions Tab */}
          {selectedTab === "regular" && (
            <div className="space-y-4">
              {isUkEuropeMember ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: "monthly",
                      title: "£20 installment",
                      detail: "Pay whenever convenient",
                      amount: Math.min(UK_EUROPE_SUBSCRIPTION.monthlyAmount, remainingAmount),
                    },
                    {
                      id: "annual",
                      title: "Pay yearly balance",
                      detail: `Complete your ${currentYear} target`,
                      amount: remainingAmount,
                    },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={paymentOption === option.id}
                      onClick={() => setPaymentOption(option.id)}
                      className={classNames(
                        "rounded-lg border-2 p-4 text-left transition-colors",
                        paymentOption === option.id
                          ? "border-primary bg-onPrimary"
                          : "border-gray-200 hover:border-primary/50"
                      )}
                    >
                      <span className="block font-semibold text-sm">{option.title}</span>
                      <span className="block text-2xl font-bold text-primary my-1">
                        {formatCurrency(option.amount, UK_EUROPE_SUBSCRIPTION.currency)}
                      </span>
                      <span className="text-xs text-gray-600">{option.detail}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="incomeBracket"
                    title="Annual Income Level"
                    placeholder="Select your income bracket"
                    options={INCOME_BRACKETS}
                    control={control}
                    errors={errors}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Year</label>
                    <select
                      value={targetYear}
                      onChange={(event) => setTargetYear(Number(event.target.value))}
                      className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 focus:border-primary focus:outline-none"
                    >
                      {availableYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Pricing Display */}
              {!isUkEuropeMember && (
                <div className="bg-onPrimary border-2 border-primary rounded-lg p-4">
                  <div className="text-center">
                    <h5 className="text-lg font-semibold text-primary mb-2">
                      {GLOBAL_INCOME_BASED_PRICING[watchedIncomeBracket]?.label}
                    </h5>
                    <div className="text-3xl font-bold text-primary mb-2">
                      {formatCurrency(getCurrentPrice(), "USD")}
                    </div>
                    <p className="text-sm text-gray-600">Calendar Year {targetYear} (Jan 1 - Dec 31)</p>
                  </div>
                </div>
              )}
              {isUkEuropeMember && (
                <p className="text-xs text-gray-600 text-center">
                  Payments count only toward {currentYear}. Any unpaid balance does not roll into the next year.
                </p>
              )}
            </div>
          )}

          {/* Lifetime Membership Tab */}
          {selectedTab === "lifetime" && (
            <div className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg">
                <h5 className="text-lg font-semibold mb-2">Lifetime Membership</h5>
                <p className="text-sm opacity-90">Make a one-time investment in your CMDA membership</p>
              </div>

              <Select
                label="lifetimeType"
                title="Lifetime Plan"
                placeholder="Select lifetime plan"
                options={Object.entries(LIFETIME_MEMBERSHIPS).map(([key, value]) => ({
                  value: key,
                  label: `${value.label} - ${formatCurrency(value.price, "USD")}`,
                }))}
                control={control}
                errors={errors}
                required
              />

              {/* Lifetime Plan Details */}
              <div className="bg-onPrimary border-2 border-primary rounded-lg p-4">
                <div className="text-center">
                  <h5 className="text-lg font-semibold text-primary mb-2">
                    {LIFETIME_MEMBERSHIPS[watchedLifetimeType]?.label}
                  </h5>
                  <div className="text-3xl font-bold text-primary mb-2">{formatCurrency(getCurrentPrice(), "USD")}</div>
                  <p className="text-sm text-gray-600">
                    {LIFETIME_MEMBERSHIPS[watchedLifetimeType]?.years} Years Coverage
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button type="button" variant="outlined" large onClick={handleModalClose} className="w-full">
              Cancel
            </Button>

            <PayPalRedirectButton
              createOrder={async () => {
                // Validate form first
                const isValid = isUkEuropeMember && selectedTab === "regular" ? true : await trigger();
                if (!isValid) {
                  throw new Error("Please fill in all required fields");
                }

                // Get form values and create order
                const data = watch();
                const subscriptionData = {
                  selectedTab,
                  ...(selectedTab === "lifetime"
                    ? { lifetimeType: data.lifetimeType }
                    : isUkEuropeMember
                      ? { paymentOption }
                      : { incomeBracket: data.incomeBracket, targetYear }),
                };

                const order = await onSubmit(subscriptionData);
                if (!order) {
                  throw new Error("Failed to create PayPal order");
                }
                return order;
              }}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default GlobalSubscriptionModal;
