import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import icons from "~/assets/js/icons";
import DashboardCartItems from "~/components/DashboardComponents/Cart/CartItems";
import Button from "~/components/Global/Button/Button";
import { clearCart } from "~/redux/features/cart/cartSlice";
import { formatCurrency } from "~/utilities/formatCurrency";

const DashboardCartPage = () => {
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("TOTA", totalPrice);

  const handleClearAll = () => {
    dispatch(clearCart());
    toast.success("Cart cleared!");
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center gap-y-3 md:justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Store Cart</h2>
        <button type="button" onClick={() => navigate(-1)} className="text-xl text-primary">
          {icons.close}
        </button>
      </div>

      <div className="bg-white shadow rounded-md p-5 lg:p-10 mt-6">
        {/* heading */}
        <div className="hidden md:grid grid-cols-3 place-content-between  w-full  font-bold text-base leading-5 text-[#2a254b] mb-6">
          <p className="cols-span-1 text-left">Product</p>
          <p className="cols-span-1 text-center">Quantity</p>
          <p className="cols-span-1 text-center">Total</p>
        </div>

        {/* cart items */}

        {cartItems.length ? (
          cartItems.map((item) => <DashboardCartItems key={item._id} item={item} />)
        ) : (
          <div className="p-10 text-center w-full">
            <p className="text-gray-dark mb-6">You currently have no item in your shopping cart</p>
            <Link to="/dashboard/store" className="text-primary font-semibold text-sm hover:underline">
              Go to Store
            </Link>
          </div>
        )}

        <hr />
        <div className="text-right text-2xl font-bold my-4">{formatCurrency(totalPrice)}</div>

        <div className="flex justify-between items-center">
          <button className="text-primary hover:underline text-sm font-medium" onClick={handleClearAll}>
            Clear Cart
          </button>
          {cartItems.length ? (
            <Button onClick={() => navigate("/dashboard/store/checkout")} large>
              Proceed to Payment
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DashboardCartPage;
