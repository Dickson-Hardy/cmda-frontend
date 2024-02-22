import { classNames } from "~/utilities/classNames";
import Loading from "../Loading/Loading";

const Button = ({
  children,
  label,
  loading,
  loadingText,
  type = "button",
  variant = "filled", // outlined, text
  large, // for larger size
  disabled,
  className,
  onClick = () => {},
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={classNames(
        "inline-flex justify-center items-center gap-2.5 rounded-md font-medium py-4 px-8 text-sm",
        large ? "h-12" : "h-12",
        variant === "filled" && "bg-primary text-white hover:bg-primaryContainer",
        variant === "outlined" && "bg-transparent text-primary border-2 border-primary hover:bg-onPrimary",
        variant === "text" && "bg-tranparent text-primary hover:bg-onPrimary",
        "disabled:cursor-not-allowed",
        disabled && "bg-opacity-50",
        "focus:ring-4 focus:ring-primary/20 focus:outline-none hover:bg-opacity-90 transition-all duration-150",
        className
      )}
      onClick={onClick}
    >
      {loading ? <Loading height={20} width={20} /> : children || label}
      {loading && loadingText ? loadingText : null}
    </button>
  );
};

export default Button;
