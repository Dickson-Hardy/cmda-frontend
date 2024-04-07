import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import DashboardCartItems from "~/components/DashboardComponents/Cart/CartItems";
import Button from "~/components/Global/Button/Button";

const DashboardCartPage = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center gap-y-3 md:justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Store Cart</h2>
        <Link to="/store">
          <span className="text-lg text-primary">{icons.close}</span>
        </Link>
      </div>

      <div className="bg-white shadow rounded-md p-5 lg:p-10 mt-6">
        {/* heading */}
        <div className="hidden md:grid grid-cols-3 place-content-between  w-full  font-bold text-base leading-5 text-[#2a254b] mb-6">
          <p className="cols-span-1 text-left">Product</p>
          <p className="cols-span-1 text-center">Quantity</p>
          <p className="cols-span-1 text-center">Total</p>
        </div>

        {/* cart items */}
        <DashboardCartItems />
        <DashboardCartItems />

        <hr />
        <div className="text-right text-2xl font-bold my-4">&#8358; 20000</div>

        <div className="flex justify-between items-center">
          <button className="text-primary hover:underline text-sm font-medium">Clear Cart</button>
          <Button large>Go to Checkout</Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCartPage;
