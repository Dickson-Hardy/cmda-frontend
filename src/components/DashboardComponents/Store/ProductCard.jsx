import { classNames } from "~/utilities/classNames";

const ProductCard = ({ width = "auto", name, image, description, price, className }) => {
  return (
    <div className={classNames("bg-white border p-3 rounded-2xl", className)} style={{ width }}>
      <img src={image} className="bg-onPrimary h-52 w-full rounded-lg mb-3 object-cover" />
      <h4 className="text-sm capitalize font-bold truncate mt-2">{name || "--- ---"}</h4>
      <p className="text-gray-dark text-xs mt-2 mb-1 truncate">{description || "-- -- -- --"}</p>
      <p className="text-xl font-bold">{price}</p>
    </div>
  );
};

export default ProductCard;
