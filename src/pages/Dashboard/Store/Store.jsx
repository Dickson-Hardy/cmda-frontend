import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import ProductCard from "~/components/DashboardComponents/Store/ProductCard";
import Button from "~/components/Global/Button/Button";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import { useGetAllProductsQuery } from "~/redux/api/products/productsApi";

const DashboardStorePage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "all" });

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { data: productsData, isLoading } = useGetAllProductsQuery(
    { page, limit: 10 },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (productsData) {
      setProducts((prevProds) => {
        const combinedProducts = [...prevProds, ...productsData.data];
        const uniqueProducts = Array.from(new Set(combinedProducts.map((evt) => evt._id))).map((_id) =>
          combinedProducts.find((evt) => evt._id === _id)
        );
        return uniqueProducts;
      });

      setTotalPages(productsData.pagination?.totalPages);
    }
  }, [productsData]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center gap-y-3 md:justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Store</h2>
        <SearchBar />
      </div>

      <section className="flex flex-col-reverse sm:flex-row justify-center gap-10 mt-8 ">
        <div className="w-full sm:w-1/2 md:w-2/3 xl:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((prod, i) => (
              <Link to={`/store/${prod?._id}`} key={i + 1}>
                <ProductCard
                  width="auto"
                  name={prod?.productName}
                  description={prod?.description}
                  price={prod?.salePrice}
                  image={prod?.productImages[0]?.Url}
                />
              </Link>
            ))}
          </div>
          <div className="flex justify-center p-2 mt-6">
            <Button
              large
              disabled={page === totalPages}
              label={page === totalPages ? "The End" : "Load More"}
              className={"md:w-1/3 w-full"}
              loading={isLoading}
              onClick={() => setPage((prev) => prev + 1)}
            />
          </div>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 xl:w-1/4">
          <div className="sticky top-0 right-0 left-0 flex flex-col gap-8">
            <Link to="/store/cart" className="bg-onPrimary flex items-center gap-4 font-bold rounded-lg p-4 text-sm">
              <span className="text-primary text-2xl">{icons.cart}</span>
              Cart
              <span className="ml-auto">{icons.chevronRight}</span>
            </Link>

            <div className="bg-onPrimary flex items-center gap-4 font-bold rounded-lg p-4 text-sm">
              <span className="text-primary text-2xl">{icons.clockCounter}</span>
              Order History
              <span className="ml-auto">{icons.chevronRight}</span>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit(console.log)}>
              <TextInput
                label="trackingNumber"
                register={register}
                errors={errors}
                title="Track an Order"
                placeholder="Enter tracking number"
                required
              />
              <Button label="Track Shipment" />
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardStorePage;
