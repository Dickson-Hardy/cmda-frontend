import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";

const PayPalButtonWrapper = ({ createOrder, onApprove, currency }) => {
  const [{ options, isPending, isResolved }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    // Only reset if currency actually changed and SDK is loaded
    if (isResolved && options.currency !== currency) {
      dispatch({
        type: "resetOptions",
        value: { ...options, currency },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, isResolved]);

  if (isPending) {
    return <div className="w-full bg-gray-100 text-gray-600 p-3 rounded text-center text-sm">Loading PayPal...</div>;
  }

  return (
    <PayPalButtons
      createOrder={async (data, actions) => {
        try {
          const orderId = await createOrder(data, actions);
          if (!orderId) {
            throw new Error("No order ID returned from createOrder");
          }
          return orderId;
        } catch (error) {
          console.error("Error creating PayPal order:", error);
          throw error;
        }
      }}
      onApprove={async (data, actions) => {
        try {
          await onApprove(data, actions);
        } catch (error) {
          console.error("Error approving PayPal payment:", error);
        }
      }}
      style={{ layout: "horizontal", label: "pay", height: 48 }}
      fundingSource="paypal"
      forceReRender={[currency]}
      onError={(err) => {
        console.error("PayPal Button Error:", err);
      }}
      onCancel={(data) => {
        console.log("PayPal payment cancelled:", data);
      }}
    />
  );
};

const PaypalPaymentButton = ({ createOrder, onApprove, currency = "USD", amount }) => {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const [key, setKey] = useState(0);

  // Force remount when currency changes to avoid zoid errors
  useEffect(() => {
    setKey((prev) => prev + 1);
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
      key={key}
      options={{
        clientId,
        currency,
        intent: "capture",
        disableFunding: "card,credit",
        vault: false,
      }}
      deferLoading={false}
    >
      <PayPalButtonWrapper createOrder={createOrder} onApprove={onApprove} currency={currency} />
    </PayPalScriptProvider>
  );
};

export default PaypalPaymentButton;
