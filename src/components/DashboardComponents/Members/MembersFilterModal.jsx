import { useForm } from "react-hook-form";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Select from "~/components/Global/FormElements/Select/Select";

import Modal from "~/components/Global/Modal/Modal";

const MembersFilterModal = ({ isOpen, onClose, onSubmit = console.log }) => {
  const { control, handleSubmit } = useForm({ mode: "all" });

  const MEMBER_TYPES = ["Student", "Doctor", "Global Network Member"].map((x) => ({ label: x, value: x }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth={360}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Filter Members</h3>
          <button type="button" onClick={onClose} className="text-xl text-gray">
            {icons.close}
          </button>
        </div>
        <Select label="memberType" control={control} options={MEMBER_TYPES} required={false} />
        <Select label="chapter" control={control} options={[]} required={false} />
        <Button label="Apply Filter" large className="w-full" />
      </form>
    </Modal>
  );
};

export default MembersFilterModal;
