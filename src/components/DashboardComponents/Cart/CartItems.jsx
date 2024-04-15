import { useDispatch } from "react-redux";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import { adjustItemQuantity } from "~/redux/features/cart/cartSlice";
import { formatPrice } from "~/utilities/others";

const DashboardCartItems = ({ item }) => {
  const dispatch = useDispatch();

  const handleQtyChange = (newQuantity) => {
    dispatch(adjustItemQuantity({ itemId: item?._id, newQuantity }));
  };

  return (
    <div className="w-full p-2 rounded-xl border border-gray-light grid grid-cols-1 gap-y-2 md:grid-cols-3 my-6">
      {/* product details */}
      <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-4 col-span-1">
        <img src={item?.productImages?.[0]?.Url} className="bg-onPrimary size-[80px] rounded-lg object-cover" />
        <div className="space-y-1 truncate">
          <h4 className="text-sm font-semibold truncate leading-5 capitalize">{item?.productName}</h4>
          <p className="text-gray-dark text-xs truncate leading-5">{item?.description}</p>
          <p className=" font-medium text-primaryContainer">&#8358;{formatPrice(item?.salePrice)}</p>
        </div>
      </div>

      {/* quantity */}
      <div className="flex gap-1 md:mx-auto md:text-center justify-between items-center col-span-1">
        <Button variant="text" className="!px-3" onClick={() => handleQtyChange(item?.quantity - 1)}>
          {icons.minus}
        </Button>
        <span className="px-3 inline-flex text-lg text-black font-medium">{item.quantity}</span>
        <Button variant="text" className="!px-3" onClick={() => handleQtyChange(item?.quantity + 1)}>
          {icons.plus}
        </Button>
      </div>

      {/* total */}
      <p className="leading-5 text-black font-medium col-span-1 md:text-center flex md:items-center md:justify-center">
        &#8358;{formatPrice(item?.quantity * item?.salePrice)}
      </p>
    </div>
  );
};

export default DashboardCartItems;
