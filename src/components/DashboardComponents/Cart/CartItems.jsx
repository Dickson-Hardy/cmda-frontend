import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import { adjustItemQuantity } from "~/redux/features/cart/cartSlice";
import { formatCurrency } from "~/utilities/formatCurrency";

const DashboardCartItems = ({ item }) => {
  const dispatch = useDispatch();

  const handleQtyChange = (itemId, newQuantity) => {
    dispatch(adjustItemQuantity({ itemId, newQuantity }));
  };

  return (
    <div className="w-full p-2 rounded-xl border border-gray-light grid grid-cols-1 gap-y-2 md:grid-cols-3 my-6">
      {/* product details */}
      <div className="flex flex-row md:items-center gap-y-2 gap-x-4 col-span-1">
        <img src={item?.featuredImageUrl} className="bg-onPrimary size-[80px] rounded-lg object-cover" />
        <div className="space-y-1 truncate">
          <Link to={`/dashboard/store/${item?.slug}`}>
            <h4 className="text-sm font-semibold truncate leading-5 capitalize hover:text-primary hover:underline">
              {item?.name}
            </h4>
          </Link>
          <p className="text-gray-dark text-xs truncate leading-5">{item?.description}</p>
          <p className=" font-medium text-primaryContainer">{formatCurrency(item?.price)}</p>
        </div>
      </div>

      {/* quantity */}
      <div className="col-span-1 md:mx-auto flex flex-col justify-center">
        <div className="flex items-center gap-0.5">
          <p className="text-sm md:hidden font-medium">Quantity:</p>
          <div className="flex gap-1 md:text-center md:justify-between items-center ">
            <Button variant="text" className="!px-3" onClick={() => handleQtyChange(item._id, item?.quantity - 1)}>
              {icons.minus}
            </Button>
            <span className="px-3 inline-flex text-lg text-black font-medium">{item.quantity}</span>
            <Button variant="text" className="!px-3" onClick={() => handleQtyChange(item._id, item?.quantity + 1)}>
              {icons.plus}
            </Button>
          </div>
        </div>
        {item?.selected?.size || item?.selected?.color ? (
          <>
            <div className="md:text-center">
              {item?.selected?.size ? (
                <p className="text-xs">
                  <span className="font-medium">Size:</span> {item?.selected?.size}
                </p>
              ) : null}
              {item?.selected?.color ? (
                <p className="text-xs">
                  <span className="font-medium">Color:</span>{" "}
                  {item.additionalImages.find((x) => x.color === item?.selected?.color).name}
                </p>
              ) : null}
            </div>
            <Link to={`/dashboard/store/${item?.slug}`} className="mt-2 text-xs font-medium text-primary underline">
              Change size or color
            </Link>
          </>
        ) : null}
      </div>

      {/* total */}
      <p className="text-lg font-medium col-span-1 md:text-center flex md:items-center justify-end md:justify-center">
        {formatCurrency(item?.quantity * item?.price)}
      </p>
    </div>
  );
};

export default DashboardCartItems;
