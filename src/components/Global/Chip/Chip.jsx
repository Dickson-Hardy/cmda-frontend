import { classNames } from "~/utilities/classNames";

const Chip = ({
  children,
  label,
  variant = "filled", // outlined
  large, // for larger size
  disabled,
  color = "primary", // primary, tertiary, secondary, error, defaults to black if none or invalid color
  className,
  onClick,
  pressed,
}) => {
  const getColorStyles = () => {
    switch (color) {
      case "primary":
        return {
          filled: "bg-primary text-white hover:bg-primaryContainer",
          outlined: "bg-transparent text-primary border-2 border-primary hover:bg-onPrimary",
        };
      case "tertiary":
        // Define styles for tertiary color
        return {
          filled: "bg-tertiary text-white hover:bg-tertiaryContainer",
          outlined: "bg-transparent text-tertiary border-2 border-tertiary hover:bg-onTertiary",
        };
      case "secondary":
        // Define styles for secondary color
        return {
          filled: "bg-secondary text-white hover:bg-secondaryContainer",
          outlined: "bg-transparent text-secondary border-2 border-secondary hover:bg-onSecondary",
        };
      case "error":
        // Define styles for error color
        return {
          filled: "bg-error text-white hover:bg-error",
          outlined: "bg-transparent text-error border-2 border-error hover:bg-error/20",
        };
      default:
        // Default to neutral ink styles if an invalid color is provided
        return {
          filled: "bg-ink text-white hover:bg-primaryDark",
          outlined: "bg-transparent text-ink border-2 border-muted hover:bg-surface",
        };
    }
  };

  const colorStyles = getColorStyles();

  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={onClick ? Boolean(pressed) : undefined}
      className={classNames(
        "inline-flex justify-center items-center gap-2.5 rounded-xl font-medium py-2 px-4 text-sm",
        onClick ? "cursor-pointer" : "cursor-default",
        large ? "h-11" : "h-9",
        variant === "filled" && colorStyles.filled,
        variant === "outlined" && colorStyles.outlined,
        "disabled:cursor-not-allowed",
        disabled && "bg-opacity-50",
        "focus:ring-4 focus:outline-none hover:bg-opacity-90 transition-all duration-150",
        color === "error"
          ? "focus:ring-error/20"
          : color === "secondary"
            ? "focus:ring-secondary/20"
            : color === "tertiary"
              ? "focus:ring-tertiary/20"
              : color === "primary"
                ? "focus:ring-primary/20"
                : "focus:ring-black/10", // Default to black focus ring for unknown colors
        className
      )}
      onClick={onClick ? onClick : () => {}}
    >
      {children || label}
    </button>
  );
};

export default Chip;
