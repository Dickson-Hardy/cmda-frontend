import Button from "~/components/Global/Button/Button";
import { useLoginMutation } from "~/redux/api/auth/authApi";
import { toast } from "react-toastify";
import OTPInput from "~/components/Global/FormElements/OTPInput/OTPInput";
import { useState } from "react";

const EmailVerification = () => {
  const [verifyUser, { isLoading }] = useLoginMutation();
  const [token, setToken] = useState(null);

  const handleVerify = () => {
    verifyUser({ token, email: "" })
      .unwrap()
      .then((data) => {
        console.log("DATA ", data);
        toast.success("Email verified successfully");
      });
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Email verification</h2>
        <p className="text-gray-dark mt-1">Enter the OTP sent to your email</p>
      </div>
      <div>
        <OTPInput onComplete={(val) => setToken(val)} length={5} />
        <div className="flex items-center gap-2 mt-3">
          Didn&apos;t get email?{" "}
          <Button variant="text" loadin loadingText="Resending..." label="Resend" className="px-[8px] h-[32px]" />
        </div>
      </div>
      <Button large label="Verify Account" loading={isLoading} loadingText="Verifying..." onClick={handleVerify} />
    </div>
  );
};

export default EmailVerification;
