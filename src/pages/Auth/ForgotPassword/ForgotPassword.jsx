import { useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "~/components/FormElements/TextInput/TextInput";
import Button from "~/components/Button/Button";
import { Link } from "react-router-dom";
import { usePasswordForgotMutation } from "~/redux/api/auth/authApi";
import { EMAIL_PATTERN } from "~/utilities/regExpValidations";
import { toast } from "react-toastify";
import ConfirmationModal from "~/components/ConfirmationModal/ConfirmationModal";
import icons from "~/assets/js/icons";
import Logo from "~/components/Logo/Logo";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });

  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");

  const [passwordForgot, { isLoading }] = usePasswordForgotMutation();

  const handleForgotPassword = (payload) => {
    passwordForgot(payload)
      .unwrap()
      .then((data) => {
        setMessage(data?.message);
        setOpenModal(true);
      })
      .catch((error) => toast.error(error));

    setOpenModal(true);
  };

  return (
    <div>
      <div className="hidden lg:flex items-center justify-center">
        <Logo />
      </div>

      <div className="flex flex-col justify-center items-center gap-y-7 md:mt-12 mt-0">
        <div className="mb-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Forgot password?</h2>
          <p className="text-gray-dark mt-3">
            To reset your password, enter your email address. An OTP will be sent to your email.
          </p>
        </div>
        <form className="my-6 w-full" onSubmit={handleSubmit(handleForgotPassword)}>
          <div className=" w-full">
            <div className="mb-6">
              <TextInput
                label="uid"
                title="Email Address"
                type="email"
                required={true}
                register={register}
                errors={errors}
                placeholder="Enter your email address"
                className="text-gray-500 my-2"
                rules={{
                  pattern: { value: EMAIL_PATTERN, message: "Invalid email address" },
                }}
              />
            </div>

            <div className="grid w-full">
              <Button type="submit" className="mb-4" loading={isLoading}>
                Continue
              </Button>

              <Link to="/login" className="mx-auto text-primary font-semibold text-sm hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </form>

        <ConfirmationModal
          isOpen={openModal}
          title="Email Sent Successfully"
          subtitle={message}
          mainAction={() => setOpenModal(false)}
          mainActionText="Close and Check Email"
          maxWidth={400}
          icon={icons.check}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
