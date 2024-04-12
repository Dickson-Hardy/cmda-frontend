import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import TextArea from "~/components/Global/FormElements/TextArea/TextArea";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import { clearCart } from "~/redux/features/cart/cartSlice";
import { formatPrice } from "~/utilities/others";
import { EMAIL_PATTERN } from "~/utilities/regExpValidations";

const DashboardCheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: {
      fullName: user.firstName + " " + user?.middleName + " " + user?.lastName,
      phoneNumber: user?.phone,
      emailAddress: user?.email,
    },
  });

  const vat = useMemo(() => totalPrice * 0.075, [totalPrice]);

  useEffect(() => {
    const popup = document.createElement("script");
    popup.setAttribute("src", "https://js.paystack.co/v2/inline.js");
    popup.async = true;
    document.head.appendChild(popup);

    return () => document.head.removeChild(popup);
  }, []);

  const payWithPaystack = (data) => {
    // eslint-disable-next-line no-undef
    const handler = PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_KEY,
      email: data.emailAddress,
      amount: formatPrice(totalPrice + vat) * 100,
      onClose: function () {
        alert("Window closed.");
      },
      callback: handleSuccess,
    });
    handler.openIframe();
  };

  const handleSuccess = (response) => {
    const referenceId = response?.reference;
    toast.success("Payment successful for - " + referenceId);
    dispatch(clearCart());
    navigate("/store/cart");
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center gap-y-3 md:justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Order Checkout</h2>
        <button type="button" onClick={() => navigate(-1)} className="text-xl text-primary">
          {icons.close}
        </button>
      </div>

      <div className="bg-white shadow rounded-md p-5 lg:p-6 mt-6">
        <form className="space-y-6" onSubmit={handleSubmit(payWithPaystack)}>
          <section>
            <h3 className="text-lg font-bold mb-3">Shipping Address</h3>
            <div className="grid md:grid-cols-3 gap-x-6 gap-y-3">
              <TextInput label="fullName" errors={errors} register={register} required />
              <TextInput label="phoneNumber" errors={errors} register={register} required />
              <TextInput
                label="emailAddress"
                register={register}
                errors={errors}
                required
                placeholder="Enter email address"
                rules={{
                  pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address" },
                }}
              />
              <div className="col-span-3">
                <TextArea label="address" errors={errors} rows={2} register={register} required />
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-lg font-bold mb-2">Order Summary</h3>
            <ul>
              {cartItems.map((item) => (
                <li key={item._id} className="flex justify-between">
                  <span className="font-semibold">{item.quantity}</span> x{" "}
                  <span className="font-semibold capitalize">{item.productName}</span> (&#8358;
                  {formatPrice(item?.salePrice)}) <span>=</span>
                  <span className="font-semibold">&#8358;{formatPrice(item.quantity * item.salePrice)}</span>
                </li>
              ))}
            </ul>
          </section>
          <hr />
          <section>
            <div className="flex justify-between">
              <span className="uppercase font-medium">Subtotal</span>
              <span className="text-lg font-semibold">&#8358;{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between my-2">
              <span className="uppercase font-medium">VAT</span>
              <span className="text-lg font-semibold">&#8358;{formatPrice(vat)}</span>
            </div>
            <div className="flex justify-between">
              <span className="uppercase font-medium">Total</span>
              <span className="text-2xl font-bold">&#8358;{formatPrice(totalPrice + vat)}</span>
            </div>
          </section>

          <div className="flex justify-center">
            <Button className="w-4/5 md:w-1/3" large type="submit">
              Pay &#8358;{formatPrice(totalPrice + vat)}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardCheckoutPage;
