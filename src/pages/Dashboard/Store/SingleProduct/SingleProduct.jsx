import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import icons from "~/assets/js/icons";
import ProductCard from "~/components/DashboardComponents/Store/ProductCard";
import Button from "~/components/Global/Button/Button";
import { useGetAllProductsQuery, useGetSingleProductQuery } from "~/redux/api/products/productsApi";
import Loading from "~/components/Global/Loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "~/redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import convertToCapitalizedWords from "~/utilities/convertToCapitalizedWords";
import MultiItemCarousel from "~/components/Global/MultiItemCarousel/MultiItemCarousel";
import BackButton from "~/components/Global/BackButton/BackButton";
import { classNames } from "~/utilities/classNames";
import { selectAuth } from "~/redux/features/auth/authSlice";
import { formatProductPrice } from "~/utilities/formatCurrency";

const DashboardStoreSingleProductPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);

  const { data: product = {}, isLoading } = useGetSingleProductQuery(slug, { refetchOnMountOrArgChange: true });
  const { data: otherProducts, isLoading: loadingOthers } = useGetAllProductsQuery({ page: 1, limit: 10 });
  const { cartItems } = useSelector((state) => state.cart);
  const alreadyInCart = useMemo(() => {
    return cartItems.some((item) => item._id === product?._id);
  }, [cartItems, product?._id]);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (product?.featuredImageUrl) {
      setCurrentImage(product?.featuredImageUrl);
    }
    if (!product?.sizes?.length) setSize("");
    if (!product?.additionalImages?.filter((x) => !!x.color).length) setColor("");
  }, [product]);
  const [currentImage, setCurrentImage] = useState(product?.featuredImageUrl);

  const [addingItem, setAddingItem] = useState(false);
  const [removingItem, setRemovingItem] = useState(false);

  const handleAddItem = () => {
    if (product.sizes.length && !size) {
      return toast.error("Please select a size");
    }
    if (product.additionalImages.filter((x) => !!x.color).length && !color) {
      return toast.error("Please select a color");
    }
    setAddingItem(true);
    setTimeout(() => {
      dispatch(addItemToCart({ item: { ...product, selected: { color, size } }, quantity }));
      toast.success(`"${convertToCapitalizedWords(product?.name)}" added to cart!`);
      setAddingItem(false);
    }, 2000);
  };

  const handleRemoveItem = () => {
    setRemovingItem(true);
    setTimeout(() => {
      dispatch(removeItemFromCart(product?._id));
      toast.success(`"${convertToCapitalizedWords(product?.name)}" removed from cart!`);
      setRemovingItem(false);
    }, 2000);
  };

  return (
    <div>
      <BackButton to="/dashboard/store" label="Back to Store" />

      <div className="bg-white p-6 rounded-3xl mt-6">
        <div className="flex flex-col md:flex-row gap-10 lg:gap-12">
          <div className="w-full md:w-1/2">
            {isLoading ? (
              <div className="h-96 flex items-center justify-center">
                <Loading width={64} height={64} className="text-primary" />
              </div>
            ) : (
              <img src={currentImage} className="w-full object-cover max-h-[500px] min-h-80 border p-0.5 rounded-3xl" />
            )}

            {product?.featuredImageUrl ? (
              <div className="flex gap-3 justify-center mt-6">
                {[{ imageUrl: product?.featuredImageUrl }]
                  .concat(product?.additionalImages?.filter((x) => !!x?.imageUrl))
                  .map((x) => (
                    <img
                      key={x.imageUrl}
                      src={x?.imageUrl}
                      className={classNames(
                        "h-14 w-14 lg:w-16 lg:h-16 rounded-lg border-2 border-white",
                        currentImage == x?.imageUrl && "outline-none ring-4 ring-primary"
                      )}
                      onClick={() => setCurrentImage(x?.imageUrl)}
                    />
                  ))}
              </div>
            ) : null}
          </div>

          <div className="w-full md:w-1/2 md:pt-8">
            {isLoading ? (
              <div className="h-96 flex items-center justify-center">
                <Loading width={64} height={64} className="text-primary" />
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-4 capitalize">{product?.name || "---"}</h2>
                <p className="text-2xl font-medium">{formatProductPrice(product, user.role)}</p>
                <div className="mt-8 mb-4">
                  <h4 className="font-bold mb-1 text-sm">Product Description</h4>
                  <p className="font-light">{product?.description || "--- -- ---"}</p>
                </div>
                {product?.brand ? (
                  <div>
                    <h4 className="font-bold mb-1 text-sm">Brand</h4>
                    <p className="font-light">{product?.brand}</p>
                  </div>
                ) : null}
                <div className="mt-8 mb-6">
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
                {product?.sizes?.length ? (
                  <div className="mb-6">
                    <h4 className="font-bold mb-1 text-sm">Sizes</h4>
                    <div className="flex gap-3">
                      {product?.sizes.map((x) => (
                        <Button
                          key={x}
                          variant={size == x ? "filled" : "outlined"}
                          className="px-[16px]"
                          onClick={() => setSize(x)}
                          label={x}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
                {product?.additionalImages?.filter((x) => !!x.color).length ? (
                  <div className="mb-4">
                    <h4 className="font-bold mb-2 text-sm">Colors</h4>
                    <div className="flex gap-3">
                      {product?.additionalImages
                        ?.filter((x) => !!x.color)
                        .map((x) => (
                          <div key={x.imageUrl} className="flex flex-col gap-0.5 items-center text-center">
                            <button
                              type="button"
                              className={classNames(
                                "h-12 w-12 rounded-full border-4 border-white",
                                color == x.color && "outline-none ring-4 ring-primary"
                              )}
                              style={{ backgroundColor: x.color }}
                              onClick={() => {
                                setColor(x.color);
                                setCurrentImage(x.imageUrl);
                              }}
                            />
                            <p className="text-xs">{x.name}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : null}
                <div className="flex flex-col md:flex-row gap-3 mt-6">
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
                  name={prod?.name}
                  description={prod?.description}
                  price={formatProductPrice(prod, user.role)}
                  image={prod?.featuredImageUrl}
                  width="auto"
                  className="mx-2"
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
