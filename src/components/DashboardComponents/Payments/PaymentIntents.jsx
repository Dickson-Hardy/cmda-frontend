import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Button from "~/components/Global/Button/Button";
import { selectAuth } from "~/redux/features/auth/authSlice";
import { useGetMyPaymentIntentsQuery, useRequeryPaymentIntentsMutation } from "~/redux/api/payments/paymentIntentsApi";

const getStatusColor = (status) => {
  switch (status) {
    case "SUCCESSFUL":
      return "bg-green-100 text-green-800 border-green-200";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-200";
    case "ABANDONED":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getContextLabel = (context) => {
  switch (context) {
    case "DONATION":
      return "Donation";
    case "SUBSCRIPTION":
      return "Subscription";
    case "ORDER":
      return "Order";
    case "EVENT":
      return "Event/Conference";
    default:
      return context;
  }
};

const PaymentIntents = ({ showTitle = true, compact = false }) => {
  const { user } = useSelector(selectAuth);
  const [requeryingIntents, setRequeryingIntents] = useState([]);

  const { data, isLoading, refetch } = useGetMyPaymentIntentsQuery({ page: 1, limit: 100 });
  const [requeryPaymentIntents] = useRequeryPaymentIntentsMutation();

  const paymentIntents = data?.items || [];

  // Filter to show only pending/failed transactions
  const requiresAttention = paymentIntents.filter(
    (intent) => intent.status === "PENDING" || intent.status === "FAILED" || intent.status === "PROCESSING"
  );

  const handleRequery = async (intent) => {
    if (requeryingIntents.includes(intent._id)) return;

    setRequeryingIntents((prev) => [...prev, intent._id]);

    try {
      const result = await requeryPaymentIntents({
        intentId: intent._id,
      }).unwrap();

      const outcome = result.data?.[0];
      if (outcome?.providerStatus === "success") {
        toast.success(`Payment verified and synced successfully!`);
        refetch();
      } else if (outcome?.error) {
        toast.error(`Requery failed: ${outcome.error}`);
      } else {
        toast.info(`Payment status: ${outcome?.providerStatus || "No update available"}`);
      }
    } catch (error) {
      toast.error(`Requery failed: ${error.data?.message || "Unable to verify payment"}`);
    } finally {
      setRequeryingIntents((prev) => prev.filter((id) => id !== intent._id));
    }
  };

  const handleRequeryAll = async () => {
    if (requiresAttention.length === 0) {
      toast.info("No pending payments to requery");
      return;
    }

    toast.info(`Checking ${requiresAttention.length} payment(s)...`);

    for (const intent of requiresAttention) {
      await handleRequery(intent);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Loading payment history...</p>
      </div>
    );
  }

  if (requiresAttention.length === 0 && compact) {
    return null;
  }

  if (compact) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 text-blue-600">ℹ️</div>
            <span className="text-sm text-blue-800">{requiresAttention.length} payment(s) pending verification</span>
          </div>
          <Button
            label="Verify All"
            size="sm"
            variant="outline"
            onClick={handleRequeryAll}
            loading={requeryingIntents.length > 0}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Payment Transactions</h3>
            <p className="text-sm text-gray-600">
              {requiresAttention.length > 0
                ? `${requiresAttention.length} payment(s) need verification`
                : "All payments verified"}
            </p>
          </div>
          {requiresAttention.length > 0 && (
            <Button
              label="Verify All"
              variant="outline"
              onClick={handleRequeryAll}
              loading={requeryingIntents.length > 0}
            />
          )}
        </div>
      )}

      {paymentIntents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No payment transactions found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paymentIntents.map((intent) => {
            const needsRequery = ["PENDING", "FAILED", "PROCESSING"].includes(intent.status);
            const isRequerying = requeryingIntents.includes(intent._id);

            return (
              <div
                key={intent._id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  needsRequery ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{getContextLabel(intent.context)}</p>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getStatusColor(intent.status)}`}>
                      {intent.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {intent.currency} {intent.amount?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Code: {intent.intentCode}
                    {intent.providerReference && (
                      <span className="ml-2">Ref: {intent.providerReference.substring(0, 12)}...</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(intent.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-2">
                  {needsRequery && (
                    <Button
                      label={isRequerying ? "Verifying..." : "Verify Payment"}
                      size="sm"
                      variant={intent.status === "FAILED" ? "danger" : "primary"}
                      onClick={() => handleRequery(intent)}
                      loading={isRequerying}
                      disabled={isRequerying}
                    />
                  )}
                  {intent.status === "SUCCESSFUL" && (
                    <div className="text-green-600 text-sm font-medium flex items-center gap-1">
                      <span>✓</span>
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentIntents;
