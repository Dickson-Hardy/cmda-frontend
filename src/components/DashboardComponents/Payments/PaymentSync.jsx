import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Button from "~/components/Global/Button/Button";
import { selectAuth } from "~/redux/features/auth/authSlice";
import { useGetAllDonationsQuery, useSyncDonationPaymentStatusMutation } from "~/redux/api/payments/donationApi";
import { useSyncSubscriptionPaymentStatusMutation } from "~/redux/api/payments/subscriptionApi";
import { useGetOrderHistoryQuery, useSyncOrderPaymentStatusMutation } from "~/redux/api/products/productsApi";
import { useGetRegisteredEventsQuery, useSyncEventPaymentStatusMutation } from "~/redux/api/events/eventsApi";

const PaymentSync = ({ showTitle = true, compact = false }) => {
  const { user } = useSelector(selectAuth);
  const [syncingPayments, setSyncingPayments] = useState([]);

  // Get user's payment history to identify pending transactions
  const { data: donations } = useGetAllDonationsQuery({ page: 1, limit: 100 });
  const { data: orders } = useGetOrderHistoryQuery({ page: 1, limit: 100 });
  const { data: events } = useGetRegisteredEventsQuery({ page: 1, limit: 100 });

  // Payment sync mutations
  const [syncDonationPayment] = useSyncDonationPaymentStatusMutation();
  const [syncSubscriptionPayment] = useSyncSubscriptionPaymentStatusMutation();
  const [syncOrderPayment] = useSyncOrderPaymentStatusMutation();
  const [syncEventPayment] = useSyncEventPaymentStatusMutation();

  // Find pending transactions that need sync
  const pendingTransactions = useMemo(() => {
    const pending = [];

    // Add pending donations
    if (donations?.items) {
      donations.items.forEach((donation) => {
        if (!donation.isPaid && donation.reference) {
          pending.push({
            id: donation._id,
            type: "donation",
            reference: donation.reference,
            amount: donation.totalAmount,
            name: `Donation - ${donation.areasOfNeed?.[0]?.name || "General"}`,
            isPaid: donation.isPaid,
          });
        }
      });
    }

    // Add pending orders
    if (orders?.items) {
      orders.items.forEach((order) => {
        if (!order.isPaid && order.paymentReference) {
          pending.push({
            id: order._id,
            type: "order",
            reference: order.paymentReference,
            amount: order.totalAmount,
            name: `Order - ${order.products?.length || 0} item(s)`,
            isPaid: order.isPaid,
          });
        }
      });
    }

    // Add pending event payments
    if (events?.items) {
      events.items.forEach((event) => {
        const userRegistration = event.registeredUsers?.find(
          (reg) => reg.userId === user?._id && reg.paymentReference && !reg.isPaid
        );
        if (userRegistration) {
          pending.push({
            id: event._id,
            type: "event",
            reference: userRegistration.paymentReference,
            amount: userRegistration.amount,
            name: `${event.isConference ? "Conference" : "Event"} - ${event.name}`,
            isPaid: false,
          });
        }
      });
    }

    return pending;
  }, [donations, orders, events, user]);

  const syncPaymentStatus = async (transaction) => {
    if (syncingPayments.includes(transaction.id)) return;

    setSyncingPayments((prev) => [...prev, transaction.id]);

    try {
      let result;
      const payload = { reference: transaction.reference };

      switch (transaction.type) {
        case "donation":
          result = await syncDonationPayment(payload).unwrap();
          break;
        case "subscription":
          result = await syncSubscriptionPayment(payload).unwrap();
          break;
        case "order":
          result = await syncOrderPayment(payload).unwrap();
          break;
        case "event":
          result = await syncEventPayment(payload).unwrap();
          break;
        default:
          throw new Error("Unknown transaction type");
      }

      toast.success(`Payment Synced: ${result.message || "Payment status updated successfully"}`);
    } catch (error) {
      toast.error(`Sync Failed: ${error.data?.message || "Failed to sync payment status"}`);
    } finally {
      setSyncingPayments((prev) => prev.filter((id) => id !== transaction.id));
    }
  };

  const syncAllPayments = async () => {
    if (pendingTransactions.length === 0) {
      toast.info("No pending payments to sync");
      return;
    }

    toast.info(`Checking ${pendingTransactions.length} payment(s)...`);

    for (const transaction of pendingTransactions) {
      await syncPaymentStatus(transaction);
      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  if (pendingTransactions.length === 0) {
    return null;
  }
  if (compact) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 text-blue-600">ℹ</div>
            <span className="text-sm text-blue-800">{pendingTransactions.length} pending payment(s) found</span>
          </div>
          <Button
            label="Sync All"
            size="sm"
            variant="outline"
            onClick={syncAllPayments}
            loading={syncingPayments.length > 0}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {showTitle && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment Status</h3>
          <Button label="Sync All" variant="outline" onClick={syncAllPayments} loading={syncingPayments.length > 0} />
        </div>
      )}

      <p className="text-sm text-gray-600 mb-4">
        Found {pendingTransactions.length} pending payment(s) that may need status updates
      </p>

      <div className="space-y-3">
        {pendingTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{transaction.name}</p>
              <p className="text-sm text-gray-600">
                {transaction.amount ? `₦${transaction.amount.toLocaleString()}` : "Amount pending"}
              </p>
              <p className="text-xs text-gray-500">Ref: {transaction.reference.substring(0, 12)}...</p>
            </div>
            <Button
              label="Sync"
              size="sm"
              variant="outline"
              onClick={() => syncPaymentStatus(transaction)}
              loading={syncingPayments.includes(transaction.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentSync;
