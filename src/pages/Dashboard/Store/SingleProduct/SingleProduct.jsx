import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import icons from "~/assets/js/icons";
import ProductCard from "~/components/DashboardComponents/Store/ProductCard";
import Button from "~/components/Global/Button/Button";
import { useGetAllProductsQuery, useGetSingleProductQuery } from "~/redux/api/products/productsApi";
import { formatPrice } from "~/utilities/others";
import Slider from "react-slick";
import Loading from "~/components/Global/Loading/Loading";
import { responsiveSliderSettings } from "~/constants/sliderConstants";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "~/redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import convertToCapitalizedWords from "~/utilities/convertToCapitalizedWords";

const DashboardStoreSingleProductPage = () => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();

  const { data: product, isLoading } = useGetSingleProductQuery({ id }, { skip: !id });

  const { data: otherProducts, isLoading: loadingOthers } = useGetAllProductsQuery({ page: 1, limit: 10 });

  const settings = {
    customPaging: function (i) {
      return (
        <a>
          <img src={product?.productImages[i]?.Url} />
        </a>
      );
    },
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  const alreadyInCart = cartItems.some((item) => item._id === id);
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
      dispatch(removeItemFromCart(id));
      toast.success(`"${convertToCapitalizedWords(product?.productName)}" removed from cart!`);
      setRemovingItem(false);
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-3xl">
      <Link
        to="/dashboard/store"
        className="inline-flex gap-2 text-base items-center font-medium text-primary hover:underline"
      >
        {icons.arrowLeft} Back to Store
      </Link>

      <div className="flex gap-10 mt-8">
        <div className="w-1/2">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <Loading width={64} height={64} className="text-primary" />
            </div>
          ) : product?.productImages?.length < 2 ? (
            <img src={product?.productImages[0]?.Url} className="w-full object-cover max-h-[500px]" />
          ) : (
            <Slider {...settings}>
              {product?.productImages?.map((img, i) => (
                <div key={i}>
                  <img src={img?.Url} className="w-full object-cover max-h-[500px]" />
                </div>
              ))}
            </Slider>
          )}
        </div>

        <div className="w-1/2">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <Loading width={64} height={64} className="text-primary" />
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-4 capitalize">{product?.productName || "---"}</h2>
              <p className="text-2xl font-medium">&#8358;{formatPrice(product?.salePrice)}</p>
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

      <section className="mt-8">
        <h3 className="text-lg font-bold mb-2">You might also like</h3>
        {loadingOthers ? (
          <Loading height={48} width={48} className="text-primary" />
        ) : (
          <Slider {...responsiveSliderSettings}>
            {otherProducts?.data?.map((prod, i) => (
              <Link to={`/dashboard/store/${prod?._id}`} key={i + 1}>
                <ProductCard
                  width="auto"
                  name={prod?.productName}
                  description={prod?.description}
                  price={prod?.salePrice}
                  image={prod?.productImages[0]?.Url}
                />
              </Link>
            ))}
          </Slider>
        )}
      </section>
    </div>
  );
};

export default DashboardStoreSingleProductPage;
