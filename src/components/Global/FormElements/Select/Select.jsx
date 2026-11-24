import ReactSelect from "react-select";
import { Controller } from "react-hook-form";
import convertToCapitalizedWords from "~/utilities/convertToCapitalizedWords";
import FormError from "../FormError";
import { classNames } from "~/utilities/classNames";
import { useMemo } from "react";

const Select = ({
  label,
  name,
  title,
  control,
  options = [],
  errors,
  rules,
  multiple,
  placeholder,
  required = false, // set to true or pass a custom error message when the field is required
  disabled,
  showTitleLabel = true, // whether to show label or title of input above the component
  onSelect = () => {},
}) => {
  // Convert options if they are strings to { label, value } format
  const fieldName = name || label;
  const errorMessage = errors?.[fieldName]?.message;

  const transformedOptions = useMemo(
    () => (options?.every((x) => typeof x === "string") ? options.map((v) => ({ label: v, value: v })) : options),
    [options]
  );

  return (
    <div>
      {showTitleLabel && (
        <label htmlFor={`${label}-input`} className="block mb-2 text-sm font-semibold text-ink">
          {title || convertToCapitalizedWords(label)}
          {required ? <span className="text-error ml-px">*</span> : null}
        </label>
      )}
      <Controller
        control={control}
        name={name || label}
        render={({ field: { onBlur, onChange, value } }) => (
          <ReactSelect
            unstyled
            id={label}
            inputId={`${label}-input`}
            value={
              multiple
                ? transformedOptions.filter((option) => value?.includes(option.value))
                : transformedOptions.find((option) => option.value === value) || null
            }
            onChange={(selectedOption) => {
              const newValue = multiple
                ? (selectedOption || []).map((option) => option.value)
                : (selectedOption?.value ?? "");
              onChange(newValue);
              onSelect(newValue);
            }}
            onBlur={onBlur}
            placeholder={placeholder}
            options={transformedOptions}
            className="cursor-pointer"
            isMulti={multiple}
            // adding disabled property
            isDisabled={disabled}
            classNames={{
              control: (state) =>
                classNames(
                  "bg-white border-gray placeholder:text-gray placeholder:text-xs border rounded-lg w-full text-sm p-3 min-h-12 cursor-pointer",
                  state.isFocused
                    ? "ring ring-primary/25 outline-none border-transparent bg-white"
                    : errorMessage
                      ? "border-error"
                      : "border-gray"
                ),
              menu: () => "bg-white ring-1 ring-gray-light shadow-xl text-sm rounded-lg py-2 mt-2",
              placeholder: () => "text-gray",
              noOptionsMessage: () => "text-gray py-3 px-4",
              valueContainer: () => "gap-2 flex flex-wrap",
              multiValueRemove: () => "text-gray-dark cursor-pointer text-base",
              multiValue: () => "bg-gray-light rounded px-2 py-1 text-xs gap-2.5",
              dropdownIndicator: (state) => (state.isFocused ? "text-gray-dark" : "text-gray"),
              clearIndicator: (state) => (state.isFocused ? "text-gray-dark" : "text-gray"),
              indicatorSeparator: (state) => (state.isFocused ? "text-gray-dark" : "text-gray"),
              option: (state) =>
                classNames(
                  "py-3 px-4 cursor-pointer",
                  state.isSelected
                    ? "bg-primary text-white"
                    : state.isFocused
                      ? "bg-onPrimary text-ink"
                      : "bg-transparent text-ink"
                ),
            }}
          />
        )}
        rules={{
          required: required && typeof required === "boolean" ? "This field is required" : required,
          ...rules,
        }}
      />
      <FormError error={errorMessage} />
    </div>
  );
};

export default Select;
