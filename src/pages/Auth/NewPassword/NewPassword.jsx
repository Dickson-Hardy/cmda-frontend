import { useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import Button from "~/components/Global/Button/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ConfirmationModal from "~/components/Global/ConfirmationModal/ConfirmationModal";
import icons from "~/assets/js/icons";
import { usePasswordResetMutation } from "~/redux/api/auth/authApi";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "~/utilities/getApiErrorMessage";
import { EMAIL_PATTERN } from "~/utilities/regExpValidations";

const NewPassword = () => {
  const location = useLocation();
  const resetEmail = location.state?.email || "";
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ mode: "all", defaultValues: { email: resetEmail } });

  const navigate = useNavigate();

  const [confirm, setConfirm] = useState(false);
  const [passwordReset, { isLoading }] = usePasswordResetMutation();

  const handleResetPassword = async (payload) => {
    const resetData = {
      ...payload,
      email: payload.email.trim(),
      token: payload.token.trim(),
    };
    passwordReset(resetData)
      .unwrap()
      .then(() => setConfirm(true))
      .catch((error) => toast.error(getApiErrorMessage(error, "Unable to reset the password. Please try again.")));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Create a new password</h2>
      <p className="text-gray-dark text-sm">Enter the email and six-digit OTP used for this reset request.</p>
      <form className="my-6" onSubmit={handleSubmit(handleResetPassword)}>
        <div className="max-w-[480px] w-full">
          <div className="mb-4 text-gray-500">
            <TextInput
              type="email"
              label="email"
              title="Email Address"
              required
              register={register}
              errors={errors}
              placeholder="Enter your email address"
              className="text-gray-500"
              rules={{ pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address" } }}
            />
          </div>

          <div className="mb-4  text-gray-500">
            <TextInput
              type="text"
              label="token"
              title="Reset OTP"
              required={true}
              register={register}
              errors={errors}
              placeholder="Enter the six-digit OTP"
              className="text-gray-500 tracking-[0.3em]"
              rules={{
                pattern: { value: /^\d{6}$/, message: "Enter the six-digit OTP from your email" },
              }}
            />
          </div>

          <div className="mb-4  text-gray-500">
            <TextInput
              type="password"
              label="newPassword"
              required={true}
              register={register}
              errors={errors}
              placeholder="Enter a strong new password"
              className="text-gray-500"
              rules={{
                minLength: { value: 8, message: "Password must be at least 8 characters" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                  message: "Use uppercase, lowercase, a number and a special character",
                },
              }}
            />
          </div>

          <div className="mb-4  text-gray-500">
            <TextInput
              type="password"
              label="confirmPassword"
              required={true}
              register={register}
              errors={errors}
              placeholder="Re-enter your new password"
              className="text-gray-500"
              rules={{
                validate: (value) => value === watch("newPassword") || "Passwords do not match",
              }}
            />
          </div>

          <div className="grid w-full gap-y-4">
            <Button type="submit" large loading={isLoading}>
              Change Password
            </Button>

            <Link to="/login" className="mx-auto text-primary font-semibold text-sm hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </form>

      <ConfirmationModal
        icon={icons.check}
        title="Congratulations"
        subtitle={`Password reset successfully`}
        subAction={null}
        maxWidth={400}
        mainAction={() => navigate("/login")}
        mainActionText="Go Back to Login"
        isOpen={confirm}
        onClose={() => navigate("/login")}
      />
    </div>
  );
};

export default NewPassword;
