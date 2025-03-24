import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import icons from "~/assets/js/icons";
import PaypalPaymentButton from "~/components/DashboardComponents/Payments/PaypalPaymentButton";
import Button from "~/components/Global/Button/Button";
import TextArea from "~/components/Global/FormElements/TextArea/TextArea";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import { usePayOrderSessionMutation } from "~/redux/api/products/productsApi";
import { formatProductPrice } from "~/utilities/formatCurrency";
import { EMAIL_PATTERN } from "~/utilities/regExpValidations";

const DashboardCheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, totalPriceUSD } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    mode: "all",
    defaultValues: {
      shippingContactName: user.fullName,
      shippingContactPhone: user?.phone,
      shippingContactEmail: user?.email,
    },
  });

  const [payOrderSession, { isLoading }] = usePayOrderSessionMutation();

  const onSubmit = async (payload) => {
    payload = {
      ...payload,
      totalAmount: user.role === "GlobalNetwork" ? +totalPriceUSD : +totalPrice,
      source: user.role === "GlobalNetwork" ? "PAYPAL" : "PAYSTACK",
      products: cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        size: item.selected?.size || null,
        color: item.selected?.color ? item.additionalImages?.find((x) => x.color == item.selected?.color)?.name : null,
      })),
    };

    const res = await payOrderSession(payload).unwrap();
    if (user.role === "GlobalNetwork") return res.id;
    else window.open(res.checkout_url, "_self");
  };

  const handlePayPalOrder = async () => {
    const values = getValues();
    if (await trigger()) {
      return onSubmit(values);
    }
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
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
              <div className="md:col-span-3">
                <TextArea label="shippingAddress" errors={errors} rows={2} register={register} required />
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-lg font-bold mb-2">Order Summary</h3>
            <table className="table-auto w-full">
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id} className="text-sm md:text-base">
                    <td className="px-1 py-1 font-semibold text-base">{item.quantity}</td>
                    <td className="px-1 py-1 font-medium">
                      {item.name}
                      <br />
                      <span className="font-normal text-sm">({formatProductPrice(item, user.role)})</span>
                      {item?.selected?.size || item?.selected?.color ? (
                        <>
                          <br />
                          <span>
                            {[
                              item?.selected?.size,
                              item?.selected?.color
                                ? item.additionalImages.find((x) => x.color === item?.selected?.color)?.name
                                : false,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </>
                      ) : null}
                    </td>
                    <td className="p-1">=</td>
                    <td className="p-1 text-right">
                      <b>
                        {formatProductPrice(
                          { price: item?.quantity * item?.price, priceUSD: item?.quantity * item?.priceUSD },
                          user.role
                        )}
                      </b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <hr />
          <section>
            <div className="flex justify-between">
              <span className="uppercase font-medium">Total</span>
              <span className="text-2xl font-bold">
                {formatProductPrice({ price: totalPrice, priceUSD: totalPriceUSD }, user.role)}
              </span>
            </div>
          </section>

          {user?.role === "GlobalNetwork" && (
            <div className="text-sm text-center text-tertiary font-medium">
              If the PayPal button does not appear, please reload the page.
            </div>
          )}

          <div className="flex justify-center">
            {user?.role === "GlobalNetwork" ? (
              <div className="w-full md:w-1/2">
                <PaypalPaymentButton
                  createOrder={handlePayPalOrder}
                  onApprove={(data) => {
                    navigate(`/dashboard/store/orders/successful?source=paypal&reference=${data.orderID}`);
                  }}
                />
              </div>
            ) : (
              <Button className="w-full md:w-1/2" large type="submit" loading={isLoading}>
                Pay {formatProductPrice({ price: totalPrice, priceUSD: totalPriceUSD }, user.role)}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardCheckoutPage;
