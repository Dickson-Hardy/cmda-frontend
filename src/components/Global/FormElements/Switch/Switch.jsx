import { classNames } from "~/utilities/classNames";
import convertToCapitalizedWords from "~/utilities/convertToCapitalizedWords";
import { Controller } from "react-hook-form";

const Switch = ({
  label, // required
  showStatusText = true, // whether to show activeText or inActiveText
  showTitleLabel = true, // whether to show label or title of input above the component
  title,
  name,
  control, // required -- from useForm hook
  activeText = "Active", // text to display when switch is checked
  inActiveText = "Inactive", // text to display if switch is not checked
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
        render={({ field }) => (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className={classNames(
                "relative h-6 w-11 min-h-6 min-w-11 appearance-none rounded-2xl bg-gray outline-none transition duration-500",
                "before:absolute before:top-[50%] before:h-5 before:w-5 before:translate-x-0.5 before:translate-y-[-50%] before:rounded-2xl",
                "before:bg-white before:shadow-[0_2px_5px_rgba(0,_0,_0,_.2)] before:transition before:content-['']",
                "checked:before:translate-x-[22px] hover:cursor-pointer checked:bg-primary focus-visible:ring-2 focus-visible:ring-primary/40"
              )}
              checked={!!field.value}
              {...field}
            />
            {showStatusText && <span className="text-sm">{field.value ? activeText : inActiveText}</span>}
          </label>
        )}
      />
    </div>
  );
};

export default Switch;
