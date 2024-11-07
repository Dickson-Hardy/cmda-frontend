import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaypalPaymentButton = ({ createOrder, onApprove }) => {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  return (
    <PayPalScriptProvider options={{ clientId, environment: "sandbox" }}>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        style={{ layout: "horizontal", label: "pay", height: 48 }}
        fundingSource="paypal"
      />
    </PayPalScriptProvider>
  );
};

export default PaypalPaymentButton;
