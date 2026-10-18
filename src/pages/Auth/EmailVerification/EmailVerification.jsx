import Button from "~/components/Global/Button/Button";
import { useResendVerifyCodeMutation, useVerifyUserMutation } from "~/redux/api/auth/authApi";
import { toast } from "react-toastify";
import OTPInput from "~/components/Global/FormElements/OTPInput/OTPInput";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setVerifyEmail } from "~/redux/features/auth/authSlice";
import { getApiErrorMessage } from "~/utilities/getApiErrorMessage";

const EmailVerification = () => {
  const [verifyUser, { isLoading }] = useVerifyUserMutation();
  const [resendVerifyCode, { isLoading: isResending }] = useResendVerifyCodeMutation();
  const [token, setToken] = useState(null);
  const verifyEmail = useSelector((state) => state.auth.verifyEmail);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleVerify = () => {
    if (!verifyEmail || token?.length !== 6 || isLoading) return;
    verifyUser({ code: token, email: verifyEmail })
      .unwrap()
      .then(() => {
        toast.success("Email Verified, Login to continue");

        // Check if user was trying to register for a conference
        const conferenceSlug = localStorage.getItem("conferenceSlug");
        if (conferenceSlug) {
          // Redirect to login with conference info
          navigate(`/login?conference=${conferenceSlug}`, {
            state: { email: verifyEmail, conference: conferenceSlug },
          });
        } else {
          navigate("/login");
        }

        dispatch(setVerifyEmail(""));
      })
      .catch((error) => {
        toast.error(getApiErrorMessage(error, "Verification failed. Please try again."));
      });
  };

  const handleResend = () => {
    if (!verifyEmail || isResending) return;
    resendVerifyCode({ email: verifyEmail })
      .unwrap()
      .then(() => {
        toast.success("Email verification code resent");
      })
      .catch((error) => {
        toast.error(getApiErrorMessage(error, "Unable to resend the verification code. Please try again."));
      });
  };

  if (!verifyEmail)
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Choose an account to verify</h2>
        <p>Your verification session is missing. Sign in to request a new code, or create an account.</p>
        <Link className="text-primary underline" to="/login">
          Back to sign in
        </Link>
        <br />
        <Link className="text-primary underline" to="/signup">
          Create an account
        </Link>
      </div>
    );
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Email verification</h2>
        <p className="text-gray-dark mt-1">Enter the OTP sent to your email {verifyEmail ? " - " + verifyEmail : ""}</p>
      </div>
      <div>
        <OTPInput onComplete={(val) => setToken(val)} length={6} />
        <div className="flex items-center gap-2 mt-3">
          Didn&apos;t get email?{" "}
          <Button
            variant="text"
            loading={isResending}
            loadingText="Resending..."
            label="Resend"
            onClick={handleResend}
            className="px-[8px] h-[32px]"
          />
        </div>
      </div>
      <Button
        large
        className="w-full"
        label="Verify Account"
        disabled={token?.length !== 6 || isResending}
        loading={isLoading}
        loadingText="Verifying..."
        onClick={handleVerify}
      />
    </div>
  );
};

export default EmailVerification;
