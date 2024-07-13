import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ResourceCard from "~/components/DashboardComponents/Resources/ResourceCard";
import Button from "~/components/Global/Button/Button";
import Chip from "~/components/Global/Chip/Chip";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import { useGetAllResourcesQuery } from "~/redux/api/resources/resourcesApi";

const DashboardResources = () => {
  const CATEGORIES = ["Article", "Webinar", "Newsletter", "Others"];

  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSelectCategory = (category) => {
    setResources([]);
    if (selectedCategory === category) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  };

  const [resources, setResources] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchBy, setSearchBy] = useState("");

  const {
    data: allResources,
    isLoading: loadingResources,
    isFetching,
  } = useGetAllResourcesQuery({ page, limit: 12, searchBy, category: selectedCategory });

  useEffect(() => {
    if (allResources) {
      setResources((prevResources) => {
        const combinedResources = [...prevResources, ...allResources.items];
        // Use Set to remove duplicate objects based on their IDs
        const uniqueResources = Array.from(new Set(combinedResources.map((res) => res._id))).map((id) =>
          combinedResources.find((res) => res._id === id)
        );
        return uniqueResources;
      });

      setTotalPages(allResources.meta.totalPages);
    }
  }, [allResources]);

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6">Resources</h2>

      <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="inline-flex flex-wrap justify-center gap-1.5">
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={category}
              variant={selectedCategory.includes(category) ? "filled" : "outlined"}
              color={"primary"}
              onClick={() => handleSelectCategory(category)}
              className={"px-[10px] md:px-[16px]"}
            />
          ))}
        </div>

        <SearchBar
          onSearch={(v) => {
            setResources([]);
            setSearchBy(v);
          }}
          className="w-full md:w-auto"
          placeholder="Search resources..."
        />
      </div>

      <section className="mt-8">
        <h3 className="text-lg font-bold mb-4">Recent Resources </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {resources.map((res) => (
            <Link to={`/dashboard/resources/${res.slug}`} key={res._id}>
              <ResourceCard
                image={res?.featuredImage}
                title={res?.title}
                type={res.category}
                subtitle={res?.description}
                width="auto"
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
            loading={loadingResources || isFetching}
            onClick={() => setPage((prev) => prev + 1)}
          />
        </div>
      </section>
    </div>
  );
};

export default DashboardResources;
