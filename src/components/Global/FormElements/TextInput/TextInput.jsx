import { classNames } from "~/utilities/classNames";
import convertToCapitalizedWords from "~/utilities/convertToCapitalizedWords";
import FormError from "../FormError";
import { useState, forwardRef } from "react";
import icons from "~/assets/js/icons";

const TextInput = forwardRef(
  (
    {
      type,
      register,
      rules,
      label,
      title,
      errors,
      name,
      placeholder,
      className,
      required, // set to true or pass custom error message as string if field is required
      min,
      max,
      disabled,
      showTitleLabel = true, // whether to show label or title of input above the component
    },
    ref
  ) => {
    const fieldName = name || label; // Use label as fallback for name
    const [showPwd, setShowPwd] = useState(false);
    const [hasBeenTouched, setHasBeenTouched] = useState(false);

    // Get the register function for this field, handling the case where register might be undefined
    const registerProps =
      register && fieldName // Use fieldName here
        ? register(fieldName, {
            required: required && typeof required === "boolean" ? "This field is required" : required,
            ...rules,
          })
        : {};

    // Only show error if field has been touched (focused and blurred) or if there's a non-required error
    const shouldShowError =
      hasBeenTouched || (errors?.[fieldName] && !errors?.[fieldName]?.message?.includes("required")); // Use fieldName here

    return (
      <div className="w-full">
        {showTitleLabel && (
          <label htmlFor={fieldName} className="block mb-1 text-sm font-semibold text-black">
            {title || convertToCapitalizedWords(fieldName)}
            {required ? <span className="text-error ml-px">*</span> : null}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            type={type !== "password" ? type : showPwd ? "text" : "password"}
            id={fieldName}
            name={fieldName}
            className={classNames(
              "bg-white border border-gray placeholder:text-gray placeholder:text-xs rounded-md block w-full text-sm p-3 h-12",
              "focus:ring focus:ring-primary/20 focus:outline-none focus:bg-white focus:border-transparent transition-all",
              "disabled:bg-gray-200 disabled:opacity-80",
              shouldShowError && errors?.[fieldName]?.message && "border-error",
              type === "password" ? "pr-8" : "pr-3",
              className
            )}
            {...registerProps}
            placeholder={placeholder}
            min={min}
            max={max}
            disabled={disabled}
            onBlur={(e) => {
              setHasBeenTouched(true);
              registerProps.onBlur?.(e);
            }}
          />
          {type === "password" && (
            <button
              className="absolute top-3.5 right-3 text-gray group-focus-within:text-black transition-all"
              type="button"
              onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? icons.eyeSlash : icons.eye}
            </button>
          )}
        </div>
        <FormError error={shouldShowError ? errors?.[fieldName]?.message : ""} />
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
