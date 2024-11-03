import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Button from "~/components/Global/Button/Button";
import Select from "~/components/Global/FormElements/Select/Select";
import Switch from "~/components/Global/FormElements/Switch/Switch";
// import TextArea from "~/components/Global/FormElements/TextArea/TextArea";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import Modal from "~/components/Global/Modal/Modal";
import { AREAS_OF_NEED, AREAS_OF_NEED_GLOBAL } from "~/constants/donations";
import { selectAuth } from "~/redux/features/auth/authSlice";

const MakeDonationModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const {
    register,
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm({ mode: "all", defaultValues: { recurring: false } });

  const { user } = useSelector(selectAuth);

  return (
    <Modal maxWidth={400} isOpen={isOpen} onClose={onClose} title="Make a Donation">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput label="amount" type="number" register={register} required errors={errors} />

        <Switch label="recurring" title="Vision Partner?" control={control} inActiveText="No" activeText="Yes" />

        {watch("recurring") ? (
          <Select label="frequency" options={["Monthly", "Annually"]} control={control} required={false} />
        ) : null}

        <Select
          label="areasOfNeed"
          options={user.role === "GlobalNetwork" ? AREAS_OF_NEED_GLOBAL : AREAS_OF_NEED}
          control={control}
          required={false}
        />

        <Button type="submit" className="w-full" label="Donate Now" large loading={loading} />
      </form>
    </Modal>
  );
};

export default MakeDonationModal;
