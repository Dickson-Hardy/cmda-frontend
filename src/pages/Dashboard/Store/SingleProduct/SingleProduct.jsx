import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import icons from "~/assets/js/icons";
import ProductCard from "~/components/DashboardComponents/Store/ProductCard";
import Button from "~/components/Global/Button/Button";
import { useGetAllProductsQuery, useGetSingleProductQuery } from "~/redux/api/products/productsApi";
import { formatPrice } from "~/utilities/others";
import Loading from "~/components/Global/Loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "~/redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import convertToCapitalizedWords from "~/utilities/convertToCapitalizedWords";
import MultiItemCarousel from "~/components/Global/MultiItemCarousel/MultiItemCarousel";
import BackButton from "~/components/Global/BackButton/BackButton";

const DashboardStoreSingleProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const { slug } = useParams();

  const { data: product, isLoading } = useGetSingleProductQuery(slug);

  const { data: otherProducts, isLoading: loadingOthers } = useGetAllProductsQuery({ page: 1, limit: 10 });
  console.log("OTH", otherProducts);

  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  const alreadyInCart = cartItems.some((item) => item._id === product?._id);
  const [addingItem, setAddingItem] = useState(false);
  const [removingItem, setRemovingItem] = useState(false);

  const handleAddItem = () => {
    setAddingItem(true);
    setTimeout(() => {
      dispatch(addItemToCart({ item: product, quantity }));
      toast.success(`"${convertToCapitalizedWords(product?.productName)}" added to cart!`);
      setAddingItem(false);
    }, 2000);
  };

  const handleRemoveItem = () => {
    setRemovingItem(true);
    setTimeout(() => {
      dispatch(removeItemFromCart(product?._id));
      toast.success(`"${convertToCapitalizedWords(product?.productName)}" removed from cart!`);
      setRemovingItem(false);
    }, 2000);
  };

  // const CustomDot = ({ onClick, active, index, carouselState }) => {
  //   const { currentSlide, deviceType } = carouselState;
  //   const isActive = currentSlide === index;

  //   const images = [
  //     "https://via.placeholder.com/100?text=1",
  //     "https://via.placeholder.com/100?text=2",
  //     "https://via.placeholder.com/100?text=3",
  //     "https://via.placeholder.com/100?text=4",
  //     "https://via.placeholder.com/100?text=5",
  //   ];

  //   return (
  //     <button className={`w-16 h-16 ${isActive ? "opacity-100" : "opacity-50"} mx-1`} onClick={() => onClick()}>
  //       <img src={images[index]} alt={`Dot ${index}`} className="w-full h-full rounded-full" />
  //     </button>
  //   );
  // };

  return (
    <div>
      <BackButton to="/dashboard/store" label="Back to Store" />

      <div className="bg-white p-6 shadow rounded-3xl mt-6">
        <div className="flex gap-10">
          <div className="w-1/2">
            {isLoading ? (
              <div className="h-96 flex items-center justify-center">
                <Loading width={64} height={64} className="text-primary" />
              </div>
            ) : (
              <img src={product?.featuredImageUrl} className="w-full object-cover max-h-[500px]" />
            )}
          </div>

          <div className="w-1/2">
            {isLoading ? (
              <div className="h-96 flex items-center justify-center">
                <Loading width={64} height={64} className="text-primary" />
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-4 capitalize">{product?.name || "---"}</h2>
                <p className="text-2xl font-medium">&#8358;{formatPrice(product?.price)}</p>
                <div className="my-8">
                  <h4 className="font-bold mb-1 text-sm">Product Description</h4>
                  <p className="font-light">{product?.description || "--- -- ---"}</p>
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
                    <span className="border px-4 border-gray inline-flex text-2xl font-semibold rounded-lg">
                      {quantity}
                    </span>
                    <Button variant="outlined" className="px-[16px]" onClick={() => setQuantity((prev) => prev + 1)}>
                      {icons.plus}
                    </Button>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <Button
                    large
                    onClick={handleAddItem}
                    loading={addingItem}
                    loadingText={"Adding..."}
                    disabled={alreadyInCart}
                  >
                    <span className="text-xl">{icons.cartAdd}</span>
                    {alreadyInCart ? "Already Added" : "Add to Cart"}
                  </Button>
                  {alreadyInCart ? (
                    <Button
                      variant="outlined"
                      loading={removingItem}
                      loadingText="Removing..."
                      label="Remove from Cart"
                      large
                      onClick={handleRemoveItem}
                    />
                  ) : null}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h3 className="text-lg font-bold mb-2">You might also like</h3>
        {loadingOthers ? (
          <Loading height={48} width={48} className="text-primary" />
        ) : (
          <MultiItemCarousel>
            {otherProducts?.items?.slice().map((prod, i) => (
              <Link to={`/dashboard/store/${prod?.slug}`} key={i + 1}>
                <ProductCard
                  width={240}
                  name={prod?.name}
                  description={prod?.description}
                  price={prod?.price}
                  image={prod?.featuredImageUrl}
                />
              </Link>
            ))}
          </MultiItemCarousel>
        )}
      </section>
    </div>
  );
};

export default DashboardStoreSingleProductPage;
