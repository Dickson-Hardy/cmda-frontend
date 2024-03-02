import { useState } from "react";
import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import ProductCard from "~/components/DashboardComponents/Store/ProductCard";
import Button from "~/components/Global/Button/Button";

const DashboardStoreSingleProductPage = () => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="bg-white p-6 rounded-3xl">
      <Link to="/store" className="inline-flex gap-2 text-base items-center font-medium text-primary hover:underline">
        {icons.arrowLeft} Back to Store
      </Link>

      <div className="flex gap-10 mt-8">
        <img src="/product.png" className="w-1/2 object-cover max-h-[500px]" />
        <div className="w-1/2">
          <h2 className="text-3xl font-bold mb-4">The Dandy Super Chair</h2>
          <p className="text-2xl font-medium">&#8358; 15,000.00</p>
          <div className="my-8">
            <h4 className="font-bold mb-1 text-sm">Product Description</h4>
            <p className="font-light">
              A timeless design, with premium materials features as one of our most popular and iconic pieces. The dandy
              chair is perfect for any stylish living space with beech legs and lambskin leather upholstery.
            </p>
          </div>
          <div className="my-8">
            <h4 className="font-bold mb-1 text-sm">Quantity</h4>
            <div className="flex gap-3">
              <Button
                variant="outlined"
                className="px-[16px]"
                onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
              >
                {icons.minus}
              </Button>
              <span className="border px-4 border-gray inline-flex text-2xl font-semibold rounded-lg">{quantity}</span>
              <Button variant="outlined" className="px-[16px]" onClick={() => setQuantity((prev) => prev + 1)}>
                {icons.plus}
              </Button>
            </div>
          </div>
          <div className="flex gap-6 mt-8">
            <Button label="Buy Now" large />
            <Button variant="outlined" large>
              <span className="text-xl">{icons.cartAdd}</span>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h3 className="text-lg font-bold">You might also like</h3>
        <div className="flex space-x-4 py-2 overflow-x-auto scrollbar-hide">
          {[...Array(10)].map((_, v) => (
            <Link to={`/store/${v + 1}`} key={v + 1}>
              <ProductCard width={280} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardStoreSingleProductPage;
