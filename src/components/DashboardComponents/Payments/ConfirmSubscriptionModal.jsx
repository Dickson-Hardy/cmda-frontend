import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Modal from "~/components/Global/Modal/Modal";
import { classNames } from "~/utilities/classNames";
import { useState } from "react";

const ConfirmSubscriptionModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const currentYear = new Date().getFullYear();
  const [targetYear, setTargetYear] = useState(currentYear);
  const availableYears = Array.from({ length: 3 }, (_, index) => currentYear - 2 + index);

  const handleSubmit = () => {
    // Pass standard annual subscription payload for Nigerian members
    onSubmit({ isAnnualSubscription: true, targetYear });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="m-2" maxWidth={480}>
      <div className="flex flex-col gap-4">
        <span
          className={classNames(
            "text-3xl rounded-full w-14 h-14 inline-flex justify-center items-center mx-auto p-2",
            "bg-onPrimary text-primary"
          )}
        >
          {icons.card}
        </span>

        <div className="text-center">
          <h4 className={classNames("text-lg font-semibold mb-1")}>Pay Annual Subscription</h4>
          <p className={classNames("text-sm")}>
            Select payment year. Access runs from January 1 to December 31 of that same year.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Subscription Year</label>
          <select
            value={targetYear}
            onChange={(event) => setTargetYear(Number(event.target.value))}
            className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 focus:border-primary focus:outline-none"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className={classNames("grid grid-cols-2 gap-2 items-center")}>
          <Button className="w-full mb-1.5" variant="outlined" large onClick={onClose}>
            No, Cancel
          </Button>

          <Button className="w-full mb-1.5" loading={loading} large onClick={handleSubmit}>
            Yes, Proceed
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmSubscriptionModal;
