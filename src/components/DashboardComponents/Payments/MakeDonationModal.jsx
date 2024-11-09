import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Button from "~/components/Global/Button/Button";
import Select from "~/components/Global/FormElements/Select/Select";
import Switch from "~/components/Global/FormElements/Switch/Switch";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import Modal from "~/components/Global/Modal/Modal";
import { AREAS_OF_NEED, AREAS_OF_NEED_GLOBAL, PAYPAL_CURRENCIES } from "~/constants/donations";
import { selectAuth } from "~/redux/features/auth/authSlice";
import PaypalPaymentButton from "./PaypalPaymentButton";
import Checkbox from "~/components/Global/FormElements/Checkbox/Checkbox";
import { useEffect } from "react";
import { formatCurrency } from "~/utilities/formatCurrency";

const MakeDonationModal = ({ isOpen, onClose, onSubmit, loading, onApprove }) => {
  const { user } = useSelector(selectAuth);

  const {
    register,
    control,
    formState: { errors },
    watch,
    trigger,
    getValues,
    handleSubmit,
    setValue,
  } = useForm({
    mode: "all",
    defaultValues: { recurring: false, currency: user.role === "GlobalNetwork" ? "USD" : "NGN" },
  });

  // Validate form and then trigger PayPal createOrder
  const handlePayPalOrder = async () => {
    const values = getValues(); // Retrieve form values
    const payload = {
      ...values,
      areasOfNeed: Object.entries(values.areasOfNeed)
        .map(([key, val]) => ({ name: key, amount: +val.amount }))
        .filter((x) => x.amount),
    };
    console.log("PAYLOAD", payload);
    if (await trigger()) {
      // Run validation on all fields
      return onSubmit(payload); // Call the onSubmit prop if form is valid
    }
  };

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      const totalAmount = Object.values(value.areasOfNeed).reduce(
        (acc, item) => acc + (item?.value ? Number(item.amount) || 0 : 0),
        0
      );
      Object.entries(value.areasOfNeed).forEach(([key, val]) => {
        if (!val.value && val.amount) {
          setValue(`areasOfNeed[${key}].amount`, null);
        }
      });
      if (totalAmount !== value.totalAmount) {
        setValue("totalAmount", totalAmount);
      }
    });
    return () => unsubscribe();
  }, [watch, setValue]);

  return (
    <Modal maxWidth={560} isOpen={isOpen} onClose={onClose} title="Make a Donation">
      {/* Paypal button */}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="col-span-2">
          <Select
            label="currency"
            options={
              user.role === "GlobalNetwork"
                ? PAYPAL_CURRENCIES.map((x) => ({ label: x.currency + ` (${x.code})`, value: x.code }))
                : [{ label: "Nigerian Naira (NGN)", value: "NGN" }]
            }
            control={control}
            required
            disabled={user.role !== "GlobalNetwork"}
          />
        </div>

        <Switch label="recurring" title="Vision Partner?" control={control} inActiveText="No" activeText="Yes" />

        {watch("recurring") ? (
          <Select label="frequency" options={["Monthly", "Annually"]} control={control} required />
        ) : null}

        <div className="col-span-2 space-y-1 sm:space-y-2">
          {[...(user.role === "GlobalNetwork" ? AREAS_OF_NEED_GLOBAL : AREAS_OF_NEED)].map((item) => (
            <div key={item} className="flex gap-4 items-center">
              <div className="w-3/4">
                <Checkbox
                  control={control}
                  label={`areasOfNeed[${item}].value`}
                  activeText={item}
                  inActiveText={item}
                />
              </div>
              <div className="w-1/4">
                <TextInput
                  label={`areasOfNeed[${item}].amount`}
                  type="number"
                  showTitleLabel={false}
                  register={register}
                  required={watch(`areasOfNeed[${item}].value`) && "Required"}
                  errors={errors}
                  placeholder={"e.g. 500"}
                  disabled={!watch(`areasOfNeed[${item}].value`)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-2">
          <TextInput
            label="totalAmount"
            type="number"
            register={register}
            required="Please select and enter amount for an area of need"
            rules={{
              validate: (value) =>
                value > (user.role === "GlobalNetwork" ? 5 : 500) ||
                "Total amount must not be less than " +
                  (user.role === "GlobalNetwork" ? formatCurrency(5, watch("currency")) : formatCurrency(500)),
            }}
            errors={errors}
            disabled
          />
        </div>

        <div className="col-span-2">
          {user?.role === "GlobalNetwork" ? (
            <PaypalPaymentButton createOrder={handlePayPalOrder} onApprove={onApprove} currency={watch("currency")} />
          ) : (
            <Button type="submit" className="w-full" label="Donate Now" large loading={loading} />
          )}
        </div>
      </form>
    </Modal>
  );
};

export default MakeDonationModal;
