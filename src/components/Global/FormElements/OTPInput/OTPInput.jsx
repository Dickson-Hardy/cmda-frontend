import { useRef, useState } from "react";
const OTPInput = ({ length = 4, onComplete = () => {} }) => {
  const refs = useRef([]);
  const [otp, setOtp] = useState(Array(length).fill(""));
  const apply = (raw, index) => {
    const digits = raw.replace(/\D/g, "").slice(0, length - index);
    const next = [...otp];
    if (!digits) next[index] = "";
    else
      [...digits].forEach((digit, offset) => {
        next[index + offset] = digit;
      });
    setOtp(next);
    onComplete(next.every(Boolean) ? next.join("") : "");
    if (digits) refs.current[Math.min(index + digits.length, length - 1)]?.focus();
  };
  return (
    <div role="group" aria-label="Verification code" className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          aria-label={`Digit ${index + 1} of ${length}`}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          autoFocus={index === 0}
          value={otp[index]}
          type="text"
          maxLength={length}
          onFocus={(event) => event.target.select()}
          onChange={(event) => apply(event.target.value, index)}
          onPaste={(event) => {
            event.preventDefault();
            apply(event.clipboardData.getData("text"), index);
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !otp[index] && index > 0) refs.current[index - 1]?.focus();
            if (event.key === "ArrowLeft") refs.current[index - 1]?.focus();
            if (event.key === "ArrowRight") refs.current[index + 1]?.focus();
          }}
          className="bg-onPrimary border border-gray rounded-md w-11 h-12 text-base font-medium text-center focus:ring focus:ring-primary/20 focus:outline-none"
        />
      ))}
    </div>
  );
};
export default OTPInput;
