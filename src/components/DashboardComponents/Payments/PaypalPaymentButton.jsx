import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useEffect } from "react";

const PayPalButtonWrapper = ({ createOrder, onApprove, currency }) => {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    // Reset PayPal options when currency changes
    dispatch({
      type: "resetOptions",
      value: { ...options, currency },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, dispatch]);

  if (isPending) return <div>Loading...</div>;

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={onApprove}
      style={{ layout: "horizontal", label: "pay", height: 48 }}
      fundingSource="paypal"
    />
  );
};

const PaypalPaymentButton = ({ createOrder, onApprove, currency = "USD", amount }) => {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  useEffect(() => {
    const removeOldScript = () => {
      document.querySelectorAll("script[src*='paypal.com']").forEach((el) => el.remove());
    };
    removeOldScript();
  }, [currency]);

  if (!clientId) {
    return (
      <div className="w-full bg-red-50 text-red-600 p-3 rounded text-center text-sm">
        PayPal Client ID not configured
      </div>
    );
  }

  if (!amount || amount <= 0) {
    return (
      <div className="w-full bg-yellow-50 text-yellow-600 p-3 rounded text-center text-sm">
        Please select a valid amount
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        environment: "sandbox", // Changed to sandbox for testing
        currency,
        intent: "capture",
      }}
    >
      <PayPalButtonWrapper createOrder={createOrder} onApprove={onApprove} currency={currency} />
    </PayPalScriptProvider>
  );
};

export default PaypalPaymentButton;
