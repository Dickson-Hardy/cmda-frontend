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

const PaypalPaymentButton = ({ createOrder, onApprove, currency = "USD" }) => {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  return (
    <PayPalScriptProvider options={{ clientId, environment: "sandbox", currency }}>
      <PayPalButtonWrapper createOrder={createOrder} onApprove={onApprove} currency={currency} />
    </PayPalScriptProvider>
  );
};

export default PaypalPaymentButton;
