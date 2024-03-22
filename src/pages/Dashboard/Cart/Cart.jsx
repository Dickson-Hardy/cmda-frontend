import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import DashboardCartItems from "~/components/DashboardComponents/Cart/CartItems";
import Button from "~/components/Global/Button/Button";

const DashboardCartPage = () => {
  return (
    <div className="mt-5 md:mt-14">
      <div className="flex justify-between items-center text-black">
        <h3 className="font-bold leading-10 text-2xl  md:text-4xl">Your Cart</h3>
        <Link to="/store">
          <span>{icons.close}</span>
        </Link>
      </div>

      <div className="bg-white rounded-md p-5 lg:p-10 mt-6">
        {/* heading */}
        <div className="hidden md:grid grid-cols-3 place-content-between  w-full  font-bold text-sm leading-5 text-[#2a254b] my-6">
          <p className="cols-span-1 text-left">Product</p>
          <p className="cols-span-1 text-center">Quantity</p>
          <p className="cols-span-1 text-center">Total</p>
        </div>

        {/* divider */}
        <div className="h-[1px] w-full bg-[#f9f9f9] hidden md:block my-6" />

        {/* cart items */}
        <DashboardCartItems />
        <DashboardCartItems />

        {/* divider */}
        <div className="h-[1px] w-full bg-[#f9f9f9] mb-6" />

        <div className="flex flex-col items-end ">
          {/* total */}
          <p className="flex justify-end items-center gap-x-2 mb-2">
            <span className="text-[#4E4D93] font-semibold text-[20px]">Subtotal</span>
            <span className="text-[#2A254B] font-semibold text-[24px]">&#8358; 20000</span>
          </p>

          <Button>Go to checkout</Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCartPage;
