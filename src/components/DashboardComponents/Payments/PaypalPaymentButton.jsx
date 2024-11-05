import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaypalPaymentButton = () => {
  const createOrder = async () => {
    const response = await fetch("http://localhost:3000/paypal/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: "7.50" }), // Example amount
    });
    const data = await response.json();
    return data.id; // PayPal order ID
  };

  const onApprove = async (data) => {
    console.log("APPROVE", data);
    const response = await fetch(`http://localhost:3000/paypal/capture-order/${data.orderID}`, {
      method: "POST",
    });
    const details = await response.json();
    console.log("Transaction completed:", details);
  };

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  console.log({ clientId });

  return (
    <PayPalScriptProvider options={{ clientId, environment: "sandbox" }}>
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} style={{ layout: "vertical" }} />
    </PayPalScriptProvider>
  );
};

export default PaypalPaymentButton;
