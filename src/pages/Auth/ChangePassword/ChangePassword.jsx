import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import Button from "~/components/Global/Button/Button";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import { useUpdatePasswordMutation } from "~/redux/api/profile/profileApi";
import { setUser } from "~/redux/features/auth/authSlice";
import { selectAuth } from "~/redux/features/auth/authSlice";
import { useEffect, useState } from "react";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "all" });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(selectAuth);
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const [hasCheckedUser, setHasCheckedUser] = useState(false);

  // Redirect if user doesn't need to change password
  // Only redirect after we've confirmed the user state is loaded
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Wait for user to be loaded before checking requirePasswordChange
    if (user !== null) {
      setHasCheckedUser(true);
      // Only redirect if user explicitly has requirePasswordChange set to false
      // Don't redirect if the field is undefined (might be loading)
      if (user.requirePasswordChange === false) {
        navigate("/dashboard");
      }
    }
  }, [user, isAuthenticated, navigate]);

  const handleChangePassword = (payload) => {
    const { oldPassword, newPassword, confirmPassword } = payload;
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    updatePassword({ oldPassword, newPassword, confirmPassword })
      .unwrap()
      .then(() => {
        toast.success("Password changed successfully! Your account is now verified.");
        // Update user state to reflect password change
        dispatch(setUser({ ...user, requirePasswordChange: false, isVerified: true }));
        navigate("/dashboard");
      })
      .catch((error) => {
        toast.error(error?.data?.message || error?.message || "Failed to change password. Please try again.");
      });
  };

  // Show loading while checking user state
  if (!hasCheckedUser || !user) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user doesn't need password change, don't render the form (redirect will happen)
  if (!user.requirePasswordChange) {
    return null;
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">Change Your Password</h2>
        <p className="text-gray-dark mt-2">
          Your account was created by an administrator. Please change your temporary password to continue.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleChangePassword)} className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        <TextInput
          label="oldPassword"
          title="Temporary Password"
          type="password"
          register={register}
          errors={errors}
          required
          placeholder="Enter your temporary password"
        />
        <TextInput
          label="newPassword"
          title="New Password"
          type="password"
          register={register}
          errors={errors}
          required
          placeholder="Enter your new password"
          rules={{
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          }}
        />
        <TextInput
          label="confirmPassword"
          title="Confirm New Password"
          type="password"
          register={register}
          errors={errors}
          required
          placeholder="Confirm your new password"
          rules={{
            validate: (value) => value === watch("newPassword") || "Passwords do not match",
          }}
        />

        <div className="mt-4">
          <Button large label="Change Password" loading={isLoading} className="w-full" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
