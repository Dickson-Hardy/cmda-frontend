import { useForm } from "react-hook-form";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import Button from "~/components/Global/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import { usePasswordForgotMutation } from "~/redux/api/auth/authApi";
import { EMAIL_PATTERN } from "~/utilities/regExpValidations";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "~/utilities/getApiErrorMessage";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });

  const navigate = useNavigate();

  const [passwordForgot, { isLoading }] = usePasswordForgotMutation();

  const handleForgotPassword = (payload) => {
    passwordForgot(payload)
      .unwrap()
      .then(() => {
        toast.success("Reset OTP sent successfully");
        navigate("/reset-password");
      })
      .catch((error) => {
        toast.error(getApiErrorMessage(error, "Unable to send the reset OTP. Please try again."));
      });
  };

  return (
    <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Forgot password?</h2>
        <p className="text-gray-dark mt-1">Enter your email to get a reset OTP</p>
      </div>

      <TextInput
        label="email"
        title="Email Address"
        type="email"
        required={true}
        register={register}
        errors={errors}
        placeholder="Enter your email address"
        rules={{ pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address" } }}
      />

      <div className="flex flex-col">
        <Button type="submit" large className="mb-4" loading={isLoading}>
          Send OTP
        </Button>

        <Link to="/login" className="mx-auto text-primary font-semibold text-sm hover:underline">
          Back to Login
        </Link>
      </div>
    </form>
  );
};

export default ForgotPassword;
