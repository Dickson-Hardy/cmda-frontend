import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Button from "~/components/Global/Button/Button";
import Select from "~/components/Global/FormElements/Select/Select";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import Modal from "~/components/Global/Modal/Modal";
import { selectAuth } from "~/redux/features/auth/authSlice";
import { useAllChapters } from "~/hooks/useChapters";

const TransitionModal = ({ isOpen, onClose, transition, loading, onSubmit = console.log }) => {
  const {
    control,
    handleSubmit,
    reset,
    register,
    setValue,
    formState: { errors },
  } = useForm({ mode: "all" });

  const { user } = useSelector(selectAuth);
  const { chapters } = useAllChapters();
  const destinationChapterType = user?.role === "Student" ? "Doctor" : user?.role === "Doctor" ? "Global" : null;
  const chapterOptions = destinationChapterType
    ? chapters.filter((chapter) => chapter.type === destinationChapterType)
    : [];

  useEffect(() => {
    if (isOpen && transition) {
      setValue("region", transition.region);
      if (user.role === "Student") {
        setValue("specialty", transition.specialty);
        setValue("licenseNumber", transition.licenseNumber);
      }
    } else {
      reset();
    }
  }, [transition, user, reset, setValue, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        reset();
      }}
      maxWidth={400}
      title={"Begin Transition to " + (user.role === "Student" ? "Doctor" : "Global Network Member")}
      showCloseBtn
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select title="New Region" label="region" control={control} options={chapterOptions} errors={errors} />

        {user?.role === "Student" ? (
          <>
            <TextInput
              label="specialty"
              title="Professional Cadre / Specialty"
              placeholder="Enter AWAITING if no specialty yet"
              register={register}
              required
              errors={errors}
            />

            <TextInput
              label="licenseNumber"
              placeholder="Enter AWAITING if no licenseNumber yet"
              register={register}
              required
              errors={errors}
            />
          </>
        ) : null}

        <Button label="Start Transition" loading={loading} type="submit" large className="w-full" />
      </form>
    </Modal>
  );
};

export default TransitionModal;
