import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Modal from "~/components/Global/Modal/Modal";
import { classNames } from "~/utilities/classNames";

const ConfirmSubscriptionModal = ({ isOpen, onClose, onSubmit, loading }) => {
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
            Would you like to subscribe annually to access premium features and enjoy enhanced benefits?
          </p>
        </div>

        <div className={classNames("grid grid-cols-2 gap-2 items-center")}>
          <Button className="w-full mb-1.5" variant="outlined" large onClick={onClose}>
            No, Cancel
          </Button>

          <Button className="w-full mb-1.5" loading={loading} large onClick={onSubmit}>
            Yes, Proceed
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmSubscriptionModal;
