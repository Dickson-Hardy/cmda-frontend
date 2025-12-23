import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "~/components/Global/Button/Button";
import Modal from "~/components/Global/Modal/Modal";
import { NIGERIAN_LIFETIME_MEMBERSHIP } from "~/constants/subscription";
import { selectAuth } from "~/redux/features/auth/authSlice";
import { formatCurrency } from "~/utilities/formatCurrency";
import { MdCheckCircle, MdInfo } from "react-icons/md";

const NigerianLifetimeModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const { user } = useSelector(selectAuth);
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = () => {
    onSubmit({ isNigerianLifetime: true });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={600}>
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <MdCheckCircle className="text-4xl text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{NIGERIAN_LIFETIME_MEMBERSHIP.lifetime.label}</h2>
          <p className="text-gray-600">
            Secure your CMDA membership for life!
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">One-Time Payment</p>
            <p className="text-4xl font-bold text-primary mb-2">
              {formatCurrency(NIGERIAN_LIFETIME_MEMBERSHIP.lifetime.price, "NGN")}
            </p>
            <p className="text-sm text-gray-600">Valid for Lifetime</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <MdInfo className="text-primary" />
            Lifetime Membership Benefits:
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <MdCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>
                Access to all CMDA events and conferences for life
              </span>
            </li>
            <li className="flex items-start gap-2">
              <MdCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>No annual renewal required</span>
            </li>
            <li className="flex items-start gap-2">
              <MdCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>Full access to CMDA resources and network</span>
            </li>
            <li className="flex items-start gap-2">
              <MdCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>Priority support and exclusive benefits</span>
            </li>
            <li className="flex items-start gap-2">
              <MdCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>Save money compared to annual subscriptions</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> After clicking "Proceed to Payment", you'll be redirected to our secure payment
            gateway to complete your lifetime membership purchase.
          </p>
        </div>

        <div className="flex items-start gap-3 mb-6">
          <input
            type="checkbox"
            id="confirm-lifetime"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="confirm-lifetime" className="text-sm text-gray-700">
            I understand that this is a one-time payment of{" "}
            {formatCurrency(NIGERIAN_LIFETIME_MEMBERSHIP.lifetime.price, "NGN")}
            {" "}for a lifetime membership.
          </label>
        </div>

        <div className="flex gap-3">
          <Button variant="outlined" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!confirmed} loading={isLoading} className="flex-1">
            Proceed to Payment
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NigerianLifetimeModal;
