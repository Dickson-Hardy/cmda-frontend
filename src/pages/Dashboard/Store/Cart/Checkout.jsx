import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import TextArea from "~/components/Global/FormElements/TextArea/TextArea";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import { usePayOrderSessionMutation } from "~/redux/api/products/productsApi";
import { formatCurrency } from "~/utilities/formatCurrency";
import { EMAIL_PATTERN } from "~/utilities/regExpValidations";

const DashboardCheckoutPage = () => {
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
      shippingContactName: user.fullName,
      shippingContactPhone: user?.phone,
      shippingContactEmail: user?.email,
    },
  });

  const [payOrderSession, { isLoading }] = usePayOrderSessionMutation();

  const onSubmit = (payload) => {
    payOrderSession({
      ...payload,
      totalAmount: +totalPrice,
      products: cartItems.map((item) => ({ product: item._id, quantity: item.quantity })),
    })
      .unwrap()
      .then((res) => {
        window.open(res.checkout_url, "_self");
      });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center gap-y-3 md:justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">Order Checkout</h2>
        <button type="button" onClick={() => navigate(-1)} className="text-xl text-primary">
          {icons.close}
        </button>
      </div>

      <div className="bg-white shadow rounded-md p-5 lg:p-6 mt-6">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <section>
            <h3 className="text-lg font-bold mb-3">Shipping Details</h3>
            <div className="grid md:grid-cols-3 gap-x-6 gap-y-3">
              <TextInput label="shippingContactName" errors={errors} register={register} required />
              <TextInput label="shippingContactPhone" errors={errors} register={register} required />
              <TextInput
                label="shippingContactEmail"
                register={register}
                errors={errors}
                required
                placeholder="Enter email address"
                rules={{
                  pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address" },
                }}
              />
              <div className="col-span-3">
                <TextArea label="shippingAddress" errors={errors} rows={2} register={register} required />
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-lg font-bold mb-2">Order Summary</h3>
            <ul>
              {cartItems.map((item) => (
                <li key={item._id} className="flex justify-between">
                  <span className="font-semibold">{item.quantity}</span> x{" "}
                  <span className="font-semibold capitalize">{item.name}</span> ({formatCurrency(item?.price)}){" "}
                  <span>=</span>
                  <span className="font-semibold">{formatCurrency(item.quantity * item.price)}</span>
                </li>
              ))}
            </ul>
          </section>
          <hr />
          <section>
            <div className="flex justify-between">
              <span className="uppercase font-medium">Total</span>
              <span className="text-2xl font-bold">{formatCurrency(totalPrice)}</span>
            </div>
          </section>

          <div className="flex justify-center">
            <Button className="w-4/5 md:w-1/3" large type="submit" loading={isLoading}>
              Pay {formatCurrency(totalPrice)}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardCheckoutPage;
