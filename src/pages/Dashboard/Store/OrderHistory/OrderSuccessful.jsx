import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import { useCreateOrderMutation } from "~/redux/api/products/productsApi";
import { clearCart } from "~/redux/features/cart/cartSlice";

const OrderSuccessful = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const wasCalled = useRef(false);

  useEffect(() => {
    if (wasCalled.current) return;
    wasCalled.current = true;
    createOrder({ reference });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSuccess = () => {
    dispatch(clearCart());
    navigate("/dashboard/store/orders");
  };

  return (
    <section className="h-[70vh] w-full flex justify-center items-center">
      <div className="flex flex-col gap-4 text-center p-6 rounded-xl max-w-screen-sm bg-white shadow">
        <span className="text-6xl text-primary mx-auto">{icons.checkAlt}</span>
        <h3 className="text-xl font-bold capitalize">Order Successful</h3>

        <p className="text-base text-gray-600">
          Thank you for your order! We are processing your purchase and will notify you once it has been shipped.
        </p>

        <p className="text-base text-gray-600">
          An email confirmation has been sent to your inbox with the order details. If you have any questions, please
          don&apos;t hesitate to contact us.
        </p>

        <Button label="Continue" large loading={isLoading} onClick={handleSuccess} />
      </div>
    </section>
  );
};

export default OrderSuccessful;
