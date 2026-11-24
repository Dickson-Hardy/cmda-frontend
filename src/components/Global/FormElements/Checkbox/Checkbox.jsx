import { classNames } from "~/utilities/classNames";
import convertToCapitalizedWords from "~/utilities/convertToCapitalizedWords";
import { Controller } from "react-hook-form";

const Checkbox = ({
  label, // required
  control, // required -- from useForm hook
  title,
  name,
  showStatusText = true, // whether to show activeText or inActiveText
  showTitleLabel = false, // whether to show label or title of input above the component
  activeText = "Checked", // text to display if checked
  inActiveText = "Unchecked", // text to display if not checked
  className,
}) => {
  return (
    <div>
      {showTitleLabel && (
        <p className="block mb-1 text-sm font-medium text-ink">
          {title || convertToCapitalizedWords(label)}
        </p>
      )}
      <Controller
        control={control}
        name={name || label}
        defaultValue={false}
        render={({ field }) => (
          <label className="inline-flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className={classNames(
                "h-5 w-5 min-h-5 min-w-5 accent-primary transition-all duration-200 rounded",
                "focus:ring focus:ring-primary/25 focus:border-transparent",
                className
              )}
              style={{ clipPath: "circle(90% at 50% 50%)" }}
              {...field}
            />
            {showStatusText && <span className="text-sm">{field.value ? activeText : inActiveText}</span>}
          </label>
        )}
      />
    </div>
  );
};

export default Checkbox;
