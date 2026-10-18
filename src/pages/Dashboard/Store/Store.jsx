import { usePagedResults } from "~/hooks/usePagedResults";
import QueryFeedback from "~/components/Global/QueryFeedback/QueryFeedback";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import ProductCard from "~/components/DashboardComponents/Store/ProductCard";
import Button from "~/components/Global/Button/Button";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import { useGetAllProductsQuery } from "~/redux/api/products/productsApi";
import { selectAuth } from "~/redux/features/auth/authSlice";
import { formatProductPrice } from "~/utilities/formatCurrency";

const DashboardStorePage = () => {
  const { user } = useSelector(selectAuth);

  const [searchBy, setSearchBy] = useState("");
  const [page, setPage] = useState(1);

  const {
    currentData: productsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllProductsQuery({ feedbackHandled: true, page, limit: 12, searchBy });

  const { items: products, totalPages } = usePagedResults(productsData, page, JSON.stringify([searchBy]));

  return (
    <div>
      <div className="flex flex-row gap-3 justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">Store</h2>
        <SearchBar
          placeholder="Search products..."
          onSearch={(value) => {
            setPage(1);
            setSearchBy(value);
          }}
        />
      </div>

      <QueryFeedback
        label="products"
        loading={isFetching && !products.length}
        error={isError ? error : null}
        empty={!isFetching && !isError && !products.length}
        onRetry={refetch}
      />
      <section className="flex flex-col-reverse sm:flex-row justify-center gap-6 md:gap-10 mt-4 md:mt-8 ">
        <div className="w-full sm:w-1/2 md:w-2/3 xl:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((prod) => (
              <Link to={`/dashboard/store/${prod?.slug}`} key={prod._id}>
                <ProductCard
                  width="auto"
                  name={prod?.name}
                  description={prod?.description}
                  price={formatProductPrice(prod, user.role)}
                  image={prod?.featuredImageUrl}
                />
              </Link>
            ))}
          </div>
          {products.length > 0 && (
            <div className="flex justify-center p-2 mt-6">
              <Button
                large
                disabled={page >= totalPages || isError}
                label={page >= totalPages ? "The End" : "Load More"}
                className={"md:w-1/3 w-full"}
                loading={isLoading || isFetching}
                onClick={() => setPage((prev) => prev + 1)}
              />
            </div>
          )}
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3 xl:w-1/4">
          <div className="sticky top-0 right-0 left-0 flex flex-col gap-2 sm:gap-8">
            <Link
              to="/dashboard/store/cart"
              className="bg-onPrimary flex items-center gap-4 font-bold rounded-lg p-4 text-sm"
            >
              <span className="text-primary text-2xl">{icons.cart}</span>
              Cart
              <span className="ml-auto">{icons.chevronRight}</span>
            </Link>

            <Link
              to="/dashboard/store/orders"
              className="bg-onPrimary flex items-center gap-4 font-bold rounded-lg p-4 text-sm"
            >
              <span className="text-primary text-2xl">{icons.clockCounter}</span>
              Order History
              <span className="ml-auto">{icons.chevronRight}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardStorePage;
