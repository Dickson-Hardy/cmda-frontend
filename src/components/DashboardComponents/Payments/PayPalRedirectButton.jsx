import { useState } from "react";
import Button from "~/components/Global/Button/Button";

const PayPalRedirectButton = ({ createOrder, label = "Continue to PayPal", className = "" }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRedirect = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const order = await createOrder();
      const isApprovalLink = (link) => link.rel === "approve" || link.rel === "approval_url";
      const approvalUrl = order?.links?.find(isApprovalLink)?.href || order?.approvalUrl;

      if (!approvalUrl) {
        throw new Error("PayPal did not return an approval link. Please try again.");
      }

      window.location.assign(approvalUrl);
    } catch (error) {
      const message = Array.isArray(error?.data?.message)
        ? error.data.message.join(" ")
        : error?.data?.message || error?.message || "Unable to start PayPal checkout.";
      setErrorMessage(message);
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <Button type="button" label={label} large loading={loading} onClick={handleRedirect} className="w-full" />
      {errorMessage && <p className="mt-2 text-xs text-center text-error">{errorMessage}</p>}
    </div>
  );
};

export default PayPalRedirectButton;
