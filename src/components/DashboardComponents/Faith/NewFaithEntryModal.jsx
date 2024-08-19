import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "~/components/Global/Button/Button";
import Select from "~/components/Global/FormElements/Select/Select";
import Switch from "~/components/Global/FormElements/Switch/Switch";
import TextArea from "~/components/Global/FormElements/TextArea/TextArea";
import Modal from "~/components/Global/Modal/Modal";

const NewFaithEntryModal = ({ onSubmit, loading, isOpen, onClose }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ mode: "all" });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Testimony, Prayer Request or Comment" showCloseBtn>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <Select
          label="category"
          placeholder="Select Category"
          options={["Testimony", "Prayer Request", "Comment"]}
          control={control}
        />
        <TextArea
          register={register}
          label="content"
          placeholder={"Enter your testimonies, prayer requests or comments"}
          errors={errors}
          rows={6}
        />
        <Switch
          label="isAnonymous"
          control={control}
          activeText="Post as anonymous"
          inActiveText="Post as anonymous"
          showTitleLabel={false}
        />
        <Button large loading={loading} type="submit" label={"Submit " + (watch("category") || "")} />
      </form>
    </Modal>
  );
};

export default NewFaithEntryModal;
