import { usePagedResults } from "~/hooks/usePagedResults";
import QueryFeedback from "~/components/Global/QueryFeedback/QueryFeedback";
import { useState } from "react";
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
    setPage(1);
    if (selectedCategory === category) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  };

  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("");

  const {
    currentData: allResources,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllResourcesQuery({ feedbackHandled: true, page, limit: 12, searchBy, category: selectedCategory });

  const { items: resources, totalPages } = usePagedResults(
    allResources,
    page,
    JSON.stringify([searchBy, selectedCategory])
  );

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
            setPage(1);
            setSearchBy(v);
          }}
          className="w-full md:w-auto"
          placeholder="Search resources..."
        />
      </div>

      <section className="mt-8">
        <h3 className="text-lg font-bold mb-4">Recent Resources </h3>
        <QueryFeedback
          label="resources"
          loading={isFetching && !resources.length}
          error={isError ? error : null}
          empty={!isFetching && !isError && !resources.length}
          onRetry={refetch}
        />
        {resources.length ? (
          <>
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
                disabled={page >= totalPages || isError}
                label={page >= totalPages ? "The End" : "Load More"}
                className={"md:w-1/3 w-full"}
                loading={isFetching}
                onClick={() => setPage((prev) => prev + 1)}
              />
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
};

export default DashboardResources;
