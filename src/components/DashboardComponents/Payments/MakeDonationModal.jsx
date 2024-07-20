import { useForm } from "react-hook-form";
import Button from "~/components/Global/Button/Button";
import Select from "~/components/Global/FormElements/Select/Select";
import Switch from "~/components/Global/FormElements/Switch/Switch";
import TextArea from "~/components/Global/FormElements/TextArea/TextArea";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import Modal from "~/components/Global/Modal/Modal";

const MakeDonationModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const {
    register,
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm({ mode: "all", defaultValues: { recurring: false } });

  return (
    <Modal maxWidth={400} isOpen={isOpen} onClose={onClose} title="Make a Donation">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput label="amount" type="number" register={register} required errors={errors} />
        <Switch label="recurring" title="Vision Partner?" control={control} inActiveText="No" activeText="Yes" />
        {watch("recurring") ? (
          <Select label="frequency" options={["Monthly", "Annually"]} control={control} required={false} />
        ) : null}
        <TextArea
          label="comment"
          rows={3}
          register={register}
          placeholder="Donation for conference, good will, etc"
          required={false}
          errors={errors}
        />
        <Button type="submit" className="w-full" label="Donate Now" large loading={loading} />
      </form>
    </Modal>
  );
};

export default MakeDonationModal;
