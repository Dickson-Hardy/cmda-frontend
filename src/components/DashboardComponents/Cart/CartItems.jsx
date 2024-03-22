import { useState } from "react";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";

const DashboardCartItems = () => {
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="w-full p-4 md:p-2 rounded-xl border border-gray-light grid grid-cols-1 gap-y-2 md:grid-cols-3 place-content-between text-left my-6">
      {/* product details */}
      <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-4 col-span-1">
        <img
          src="/product.png"
          className="bg-onPrimary min-w-[120px] h-[200px]  md:size-[120px] rounded-lg object-cover"
        />
        <div className="space-y-1 md:space-y-2">
          <h4 className="text-sm font-bold truncate leading-5">The secret to growth</h4>
          <p className="text-gray-dark text-xs truncate leading-5">Cotton made hand bag</p>
          <p className=" font-bold text-primaryContainer">&#8358; 15,000.00</p>
        </div>
      </div>

      {/* quantity */}
      <div className="flex gap-1 w-[120px]  md:mx-auto md:text-center justify-between items-center col-span-1">
        <Button
          variant="text"
          className="text-sm text-[#2A254B] !font-normal !px-3"
          onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
        >
          {icons.minus}
        </Button>
        <span className=" px-4 inline-flex text-sm text-[#2A254B]">{quantity}</span>
        <Button
          variant="text"
          className="text-sm text-[#2A254B] !font-normal !px-3"
          onClick={() => setQuantity((prev) => prev + 1)}
        >
          {icons.plus}
        </Button>
      </div>

      {/* total */}
      <p className="leading-5 text-[#2A254B] col-span-1 md:text-center flex md:items-center md:justify-center">
        &#8358;{quantity * 10000}
      </p>
    </div>
  );
};

export default DashboardCartItems;
