import Button from "~/components/Global/Button/Button";
import { useResendVerifyCodeMutation, useVerifyUserMutation } from "~/redux/api/auth/authApi";
import { toast } from "react-toastify";
import OTPInput from "~/components/Global/FormElements/OTPInput/OTPInput";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setVerifyEmail } from "~/redux/features/auth/authSlice";

const EmailVerification = () => {
  const [verifyUser, { isLoading }] = useVerifyUserMutation();
  const [resendVerifyCode, { isLoading: isResending }] = useResendVerifyCodeMutation();
  const [token, setToken] = useState(null);
  const verifyEmail = useSelector((state) => state.auth.verifyEmail);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleVerify = () => {
    verifyUser({ code: token, email: verifyEmail })
      .unwrap()
      .then(() => {
        toast.success("Email Verified, Login to continue");

        // Check if user was trying to register for a conference
        const conferenceSlug = localStorage.getItem("conferenceSlug");
        if (conferenceSlug) {
          // Redirect to login with conference info
          navigate(`/login?conference=${conferenceSlug}&email=${verifyEmail}`);
        } else {
          navigate("/login");
        }

        dispatch(setVerifyEmail(""));
      })
      .catch((error) => {
        const message = error?.data?.message || "Verification failed, please try again";
        toast.error(message);
      });
  };

  const handleResend = () => {
    resendVerifyCode({ email: verifyEmail })
      .unwrap()
      .then(() => {
        toast.success("Email verification code resent");
      });
  };

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
        loading={isLoading}
        loadingText="Verifying..."
        onClick={handleVerify}
      />
    </div>
  );
};

export default EmailVerification;
