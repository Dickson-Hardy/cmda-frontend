import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Loading from "~/components/Global/Loading/Loading";
import { useCreateOrderMutation } from "~/redux/api/products/productsApi";
import { clearCart } from "~/redux/features/cart/cartSlice";

const OrderSuccessful = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const source = searchParams.get("source");
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const wasCalled = useRef(false);
  const [loading, setLoading] = useState(true);
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);

  useEffect(() => {
    if (wasCalled.current) return;
    wasCalled.current = true;
    createOrder({ reference, source: source || "PAYSTACK" })
      .then(() => setLoading(false))
      .catch((err) => {
        if (err.status === 409) setAlreadyConfirmed(true);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSuccess = () => {
    dispatch(clearCart());
    navigate("/dashboard/store/orders");
  };

  return (
    <section className="h-[70vh] w-full flex justify-center items-center">
      <div className="flex flex-col gap-4 text-center p-6 rounded-xl w-full max-w-screen-sm bg-white shadow">
        {loading || isLoading ? (
          <div className="flex justify-center items-center">
            <Loading className="my-12 size-20 text-primary" />
          </div>
        ) : (
          <>
            <span className="text-6xl text-primary mx-auto">{icons.checkAlt}</span>
            <h3 className="text-xl font-bold capitalize">
              Order {alreadyConfirmed ? "Already Confirmed" : "Successful"}
            </h3>

            {!alreadyConfirmed ? (
              <p className="text-base text-gray-600">
                Thank you for your order! We are processing your purchase and will notify you once it has been shipped.
              </p>
            ) : null}

            {alreadyConfirmed ? (
              <p className="text-base text-gray-600">
                Your order with this reference {reference} has already been confirmed. If you have any questions, please
                don&apos;t hesitate to contact us.
              </p>
            ) : (
              <p className="text-base text-gray-600">
                An email confirmation has been sent to your inbox with the order details. If you have any questions,
                please don&apos;t hesitate to contact us.
              </p>
            )}

            <Button label="Continue" large loading={isLoading} onClick={handleSuccess} />
          </>
        )}
      </div>
    </section>
  );
};

export default OrderSuccessful;
