import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import ProductCard from "~/components/DashboardComponents/Store/ProductCard";
import Button from "~/components/Global/Button/Button";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import SearchBar from "~/components/Global/SearchBar/SearchBar";

const DashboardStorePage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "all" });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center gap-y-3 md:justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Store</h2>
        <SearchBar />
      </div>

      <section className="flex flex-col md:flex-row justify-center gap-10 mt-8 ">
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <Link to={`/store/${i + 1}`} key={i + 1}>
                <ProductCard width="240" />
              </Link>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/4">
          <div className="sticky top-0 right-0 left-0 flex flex-col gap-8">
            <Link to="/cart" className="bg-onPrimary flex items-center gap-4 font-bold rounded-lg p-4 text-sm">
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
