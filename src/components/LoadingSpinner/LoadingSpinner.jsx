import { classNames } from "~/utilities/classNames";

const LoadingSpinner = ({
  size = "medium", // small, medium, large, xlarge
  variant = "primary", // primary, secondary, tertiary, white
  fullscreen = false,
  overlay = false,
  text,
  className = "",
}) => {
  // Size configurations
  const sizeConfig = {
    small: {
      spinner: "w-4 h-4",
      text: "text-sm",
      gap: "gap-2",
    },
    medium: {
      spinner: "w-8 h-8",
      text: "text-base",
      gap: "gap-3",
    },
    large: {
      spinner: "w-12 h-12",
      text: "text-lg",
      gap: "gap-4",
    },
    xlarge: {
      spinner: "w-16 h-16",
      text: "text-xl",
      gap: "gap-5",
    },
  };

  // Color variants
  const colorConfig = {
    primary: "text-primary",
    secondary: "text-secondary",
    tertiary: "text-tertiary",
    white: "text-white",
    gray: "text-gray-500",
  };

  const SpinnerSVG = () => (
    <svg
      className={classNames("animate-spin", sizeConfig[size].spinner, colorConfig[variant])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const LoadingContent = () => (
    <div className={classNames("flex flex-col items-center justify-center", sizeConfig[size].gap, className)}>
      <SpinnerSVG />
      {text && <p className={classNames("font-medium", sizeConfig[size].text, colorConfig[variant])}>{text}</p>}
    </div>
  );

  if (fullscreen) {
    return (
      <div
        className={classNames(
          "fixed inset-0 z-50 flex items-center justify-center",
          overlay ? "bg-black bg-opacity-50" : "bg-background"
        )}
        role="status"
        aria-label="Loading"
      >
        <LoadingContent />
      </div>
    );
  }

  if (overlay) {
    return (
      <div
        className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-75"
        role="status"
        aria-label="Loading"
      >
        <LoadingContent />
      </div>
    );
  }

  return (
    <div role="status" aria-label="Loading">
      <LoadingContent />
    </div>
  );
};

// Additional preset components for common use cases
export const PageLoadingSpinner = ({ text = "Loading..." }) => (
  <LoadingSpinner size="large" variant="primary" fullscreen overlay text={text} />
);

export const InlineLoadingSpinner = ({ size = "medium", text }) => (
  <LoadingSpinner size={size} variant="primary" text={text} />
);

export const ButtonLoadingSpinner = () => <LoadingSpinner size="small" variant="white" />;

export const CardLoadingSpinner = ({ text = "Loading content..." }) => (
  <LoadingSpinner size="medium" variant="gray" text={text} className="py-8" />
);

export default LoadingSpinner;
