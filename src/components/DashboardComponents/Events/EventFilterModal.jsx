import { useForm } from "react-hook-form";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Select from "~/components/Global/FormElements/Select/Select";

import Modal from "~/components/Global/Modal/Modal";

const EventFilterModal = ({ isOpen, onClose, onSubmit = console.log }) => {
  const { control, handleSubmit } = useForm({ mode: "all" });

  const EVENT_LOCATIONS = ["Physical", "Virtual"].map((x) => ({ label: x, value: x }));
  const EVENT_TYPES = ["Free", "Paid"].map((x) => ({ label: x, value: x }));
  const EVENT_CATEGORIES = ["Webinar", "Seminar"].map((x) => ({ label: x, value: x }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={480}>
      <form onSubmit={handleSubmit(onSubmit)} className="gap-5 grid grid-cols-2">
        <div className="flex justify-between col-span-2">
          <h3 className="text-lg font-semibold">Filter Events</h3>
          <button type="button" onClick={onClose} className="text-xl text-gray">
            {icons.close}
          </button>
        </div>
        <Select label="eventLocation" control={control} options={EVENT_LOCATIONS} required={false} />
        <Select label="eventType" control={control} options={EVENT_TYPES} required={false} />
        <Select label="eventCategory" control={control} options={EVENT_CATEGORIES} required={false} />
        <Select label="eventRegion" control={control} options={[]} required={false} />
        <div />
        <Button label="Apply Filter" large className="w-full" />
      </form>
    </Modal>
  );
};

export default EventFilterModal;
