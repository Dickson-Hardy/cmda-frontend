import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import { useUpdatePasswordMutation } from "~/redux/api/profile/profileApi";

const DashboardUpdatePassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "all" });

  const navigate = useNavigate();
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const handleUpdatePassword = (payload) => {
    const { oldPassword, newPassword, confirmPassword } = payload;
    if (newPassword !== confirmPassword) {
      toast.error("Password do not match");
      return;
    }

    updatePassword({ oldPassword, newPassword, confirmPassword })
      .unwrap()
      .then((data) => {
        toast.success(data.message);
        reset();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div>
      <Button variant="text" onClick={() => navigate(-1)}>
        {icons.arrowLeft} Back
      </Button>
      <div className="mt-6 h-[70vh] flex items-center justify-center">
        <div className="bg-white w-full max-w-md max-auto p-8 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Update Password</h2>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit(handleUpdatePassword)}>
            <TextInput label="oldPassword" type="password" register={register} errors={errors} required />
            <TextInput
              label="newPassword"
              title="Create New Password"
              type="password"
              register={register}
              errors={errors}
              required
              rules={{
                minLength: { value: 8, message: "Password must be at least 8 characters" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message: "Must contain uppercase, lowercase, number & special character",
                },
              }}
            />
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 -mt-2">
              <p className="text-sm font-semibold text-gray-700 mb-2">Password Requirements:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#8226;</span>
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#8226;</span>
                  At least one uppercase letter (A-Z)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#8226;</span>
                  At least one lowercase letter (a-z)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#8226;</span>
                  At least one number (0-9)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">&#8226;</span>
                  At least one special character (@$!%*?&)
                </li>
              </ul>
            </div>
            <TextInput
              label="confirmPassword"
              title="Confirm New Password"
              type="password"
              register={register}
              errors={errors}
              required
            />
            <Button type="submit" label="Update Password" large loading={isLoading} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashboardUpdatePassword;
