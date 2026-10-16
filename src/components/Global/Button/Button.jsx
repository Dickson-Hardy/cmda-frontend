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
  small,
  disabled,
  color = "primary", // primary, tertiary, secondary, error
  className,
  icon,
  iconClassName,
  onClick = () => {},
}) => {
  const getColorStyles = () => {
    switch (color) {
      case "primary":
        return {
          filled: "bg-primary text-white hover:bg-primaryContainer disabled:hover:bg-primary",
          outlined:
            "bg-transparent text-primary border-[1.5px] border-primary hover:bg-onPrimary disabled:hover:bg-transparent",
          text: "bg-transparent text-primary hover:bg-onPrimary disabled:hover:bg-transparent",
        };
      case "tertiary":
        // Define styles for tertiary color
        return {
          filled: "bg-tertiary text-white hover:bg-tertiaryContainer disabled:hover:bg-tertiary",
          outlined:
            "bg-transparent text-tertiary border-[1.5px] border-tertiary hover:bg-onTertiary disabled:hover:bg-transparent",
          text: "bg-transparent text-tertiary hover:bg-onTertiary disabled:hover:bg-transparent",
        };
      case "secondary":
        // Define styles for secondary color
        return {
          filled: "bg-secondary text-white hover:bg-secondaryContainer disabled:hover:bg-secondary",
          outlined:
            "bg-transparent text-secondary border-[1.5px] border-secondary hover:bg-onSecondary disabled:hover:bg-transparent",
          text: "bg-transparent text-secondary hover:bg-onSecondary disabled:hover:bg-transparent",
        };
      case "error":
        // Define styles for error color
        return {
          filled: "bg-error text-white hover:bg-error",
          outlined:
            "bg-transparent text-error border-[1.5px] border-error hover:bg-error/20 disabled:hover:bg-transparent",
          text: "bg-transparent text-error hover:bg-error/20 disabled:hover:bg-transparent",
        };
      default:
        // Default to black color styles if an invalid color is provided
        return {
          filled: "bg-black text-white hover:bg-black",
          outlined: "bg-transparent text-black border-[1.5px] border-black hover:bg-black/10",
          text: "bg-transparent text-black hover:bg-black/10",
        };
    }
  };

  const colorStyles = getColorStyles();

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classNames(
        "inline-flex max-w-full justify-center items-center gap-2.5 rounded-md font-medium text-center",
        large
          ? "min-h-12 px-6 py-3 text-sm leading-5"
          : small
            ? "min-h-8 px-3 py-1.5 text-xs leading-4"
            : "min-h-10 px-5 py-2.5 text-sm leading-5",
        variant === "filled" && colorStyles.filled,
        (variant === "outlined" || variant === "outline") && colorStyles.outlined,
        variant === "text" && colorStyles.text,
        "disabled:cursor-not-allowed disabled:bg-opacity-50 disabled:hover:bg-opacity-50",
        "focus:ring-4 focus:outline-none hover:bg-opacity-90 transition-all duration-150",
        color === "error"
          ? "focus:ring-error/20"
          : color === "secondary"
            ? "focus:ring-secondary/20"
            : color === "tertiary"
              ? "focus:ring-tertiary/20"
              : "focus:ring-primary/20",
        className
      )}
      onClick={onClick}
    >
      {loading ? (
        <Loading height={20} width={20} />
      ) : (
        <>
          {icon && <span className={classNames("shrink-0 text-base", iconClassName)}>{icon}</span>}
          <span className="min-w-0 break-words">{children || label}</span>
        </>
      )}
      {loading && loadingText ? loadingText : null}
    </button>
  );
};

export default Button;
