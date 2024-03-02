const ProductCard = ({ width = "auto" }) => {
  return (
    <div className="bg-white border p-3 rounded-2xl" style={{ width }}>
      <img src="/product.png" className="bg-onPrimary h-52 w-full rounded-lg mb-3 object-cover" />
      <h4 className="text-sm font-bold truncate mt-2">Special Edition Book</h4>
      <p className="text-gray-dark text-xs mt-2 mb-1 truncate">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>
      <p className="text-xl font-bold">&#8358; 15,000.00</p>
    </div>
  );
};

export default ProductCard;
