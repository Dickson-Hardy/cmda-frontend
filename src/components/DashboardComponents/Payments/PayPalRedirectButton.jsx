import { useState } from "react";
import Button from "~/components/Global/Button/Button";
import { getApiErrorMessage } from "~/utilities/getApiErrorMessage";

const PayPalRedirectButton = ({ createOrder, label = "Continue to PayPal", className = "" }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRedirect = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const order = await createOrder();
      const isApprovalLink = (link) =>
        ["approve", "approval_url", "authorization_url", "payer-action"].includes(link.rel);
      const approvalUrl = order?.links?.find(isApprovalLink)?.href || order?.approvalUrl;

      if (!approvalUrl) {
        throw new Error("PayPal did not return an approval link. Please try again.");
      }

      window.location.assign(approvalUrl);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "We couldn’t open PayPal checkout. Please try again."));
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <Button type="button" label={label} large loading={loading} onClick={handleRedirect} className="w-full" />
      {errorMessage && (
        <p role="alert" className="mt-2 text-sm text-center text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default PayPalRedirectButton;
