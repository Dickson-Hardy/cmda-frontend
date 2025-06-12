import { useState } from "react";
import { useForm } from "react-hook-form";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Modal from "~/components/Global/Modal/Modal";
import Select from "~/components/Global/FormElements/Select/Select";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import { GLOBAL_INCOME_BASED_PRICING, LIFETIME_MEMBERSHIPS, INCOME_BRACKETS } from "~/constants/subscription";
import { classNames } from "~/utilities/classNames";
import { formatCurrency } from "~/utilities/formatCurrency";
import PaypalPaymentButton from "./PaypalPaymentButton";

const GlobalSubscriptionModal = ({ isOpen, onClose, onSubmit, onApprove }) => {
  const [selectedTab, setSelectedTab] = useState("subscriptions");
  const [paymentFrequency, setPaymentFrequency] = useState("annual");

  const {
    control,
    register,
    watch,
    handleSubmit,
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
    return bracket ? bracket[paymentFrequency] : 0;
  };

  const handleFormSubmit = (data) => {
    const subscriptionData = {
      ...data,
      selectedTab,
      paymentFrequency,
      amount: getCurrentPrice(),
      currency: "USD",
    };
    onSubmit(subscriptionData);
  };

  const handleModalClose = () => {
    reset();
    setSelectedTab("subscriptions");
    setPaymentFrequency("annual");
    onClose();
  };

  const tabs = [
    { id: "subscriptions", label: "Subscriptions", icon: icons.card },
    { id: "donations", label: "Donations/Vision Partners", icon: icons.heart },
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
          <p className="text-sm text-gray-600 mb-4">Select the plan that best fits your income level and commitment</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={classNames(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors",
                selectedTab === tab.id
                  ? "border-primary text-primary bg-onPrimary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Subscriptions Tab */}
          {selectedTab === "subscriptions" && (
            <div className="space-y-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Frequency</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentFrequency("monthly")}
                      className={classNames(
                        "flex-1 py-2 px-4 text-sm rounded-lg border transition-colors",
                        paymentFrequency === "monthly"
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                      )}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentFrequency("annual")}
                      className={classNames(
                        "flex-1 py-2 px-4 text-sm rounded-lg border transition-colors",
                        paymentFrequency === "annual"
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                      )}
                    >
                      Annual
                    </button>
                  </div>
                </div>
              </div>

              {/* Pricing Display */}
              <div className="bg-onPrimary border-2 border-primary rounded-lg p-4">
                <div className="text-center">
                  <h5 className="text-lg font-semibold text-primary mb-2">
                    {GLOBAL_INCOME_BASED_PRICING[watchedIncomeBracket]?.label}
                  </h5>
                  <div className="text-3xl font-bold text-primary mb-2">{formatCurrency(getCurrentPrice(), "USD")}</div>
                  <p className="text-sm text-gray-600 capitalize">{paymentFrequency} Payment</p>
                </div>
              </div>
            </div>
          )}

          {/* Donations/Vision Partners Tab */}
          {selectedTab === "donations" && (
            <div className="space-y-4">
              <div className="text-center p-6 bg-gradient-to-r from-secondary to-tertiary text-white rounded-lg">
                <h5 className="text-lg font-semibold mb-2">Vision Partner Program</h5>
                <p className="text-sm opacity-90">
                  Join our vision partners and support CMDA&apos;s mission with monthly contributions
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  label="donationAmount"
                  title="Monthly Donation Amount (USD)"
                  type="number"
                  placeholder="Enter amount"
                  register={register}
                  errors={errors}
                  required
                  min="1"
                />

                <Select
                  label="incomeBracket"
                  title="Income Level (Optional)"
                  placeholder="Select your income bracket"
                  options={INCOME_BRACKETS}
                  control={control}
                  errors={errors}
                />
              </div>
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

          {/* Payment Note */}
          <div className="text-sm text-center text-tertiary font-medium bg-yellow-50 p-3 rounded-lg">
            {selectedTab === "donations"
              ? "Monthly donations will be processed automatically via PayPal"
              : "If the PayPal button does not appear, please reload the page."}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button type="button" variant="outlined" large onClick={handleModalClose} className="w-full">
              Cancel
            </Button>

            <PaypalPaymentButton
              onApprove={onApprove}
              createOrder={async () => {
                // Validate form and create order
                const isValid = await handleSubmit((data) => {
                  const subscriptionData = {
                    ...data,
                    selectedTab,
                    paymentFrequency,
                    amount: getCurrentPrice(),
                    currency: "USD",
                  };
                  return onSubmit(subscriptionData);
                })();
                return isValid;
              }}
              amount={selectedTab === "donations" ? watch("donationAmount") : getCurrentPrice()}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default GlobalSubscriptionModal;
