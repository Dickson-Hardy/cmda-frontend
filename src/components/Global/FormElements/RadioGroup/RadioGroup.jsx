import { classNames } from "~/utilities/classNames";
import { Controller } from "react-hook-form";
import FormError from "../FormError";
import convertToCapitalizedWords from "~/utilities/convertToCapitalizedWords";

const RadioGroup = ({
  options, // Array of object of label, value
  orientation, // vertical || horizontal
  name,
  control, // required --- from useForm
  label, // required --- from useForm
  title,
  required = "This field is required", // set to false if not required or pass custom error message as string
  rules,
  errors,
  showTitleLabel = true, // whether to show label or title of input above the component
}) => {
  return (
    <div>
      {showTitleLabel && (
        <span className="block mb-1 text-sm font-medium text-ink">
          {title || convertToCapitalizedWords(label)}
          {required ? <span className="text-error ml-px">*</span> : null}
        </span>
      )}
      <div className={classNames("flex flex-wrap gap-4", orientation === "vertical" ? "flex-col" : "flex-row")}>
        {options.map((option) => (
          <Controller
            key={label + "-" + option.value}
            control={control}
            name={name || label}
            render={({ field }) => (
              <label className="flex items-center cursor-pointer text-sm">
                <input type="radio" {...field} value={option.value} className="peer sr-only" />
                <span
                  className={classNames(
                    "h-5 w-5 min-h-5 min-w-5 rounded-full mr-2 border-[3px] peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40",
                    "outline outline-2 transition-all duration-300",
                    option.value === field.value
                      ? "border-white outline-primary bg-primary"
                      : "border-gray outline-transparent bg-transparent"
                  )}
                />
                {option.label}
              </label>
            )}
            rules={{ required, ...rules }}
          />
        ))}
      </div>
      <FormError error={errors?.[label]?.message} />
    </div>
  );
};

export default RadioGroup;
