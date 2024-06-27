import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ResourceCard from "~/components/DashboardComponents/Resources/ResourceCard";
import Button from "~/components/Global/Button/Button";
import Chip from "~/components/Global/Chip/Chip";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import { useGetAllResourcesQuery } from "~/redux/api/external/resourceApi";

const DashboardResources = () => {
  const CATEGORIES = ["Articles", "Webinars", "Newsletters", "Others"];

  const [selectedCategory, setSelectedCategory] = useState(["Articles"]);

  const handleSelectCategory = (category) => {
    setSelectedCategory([category]);
    if (selectedCategory.includes(category)) {
      setSelectedCategory((prev) => prev.filter((item) => item !== category));
    } else {
      setSelectedCategory((prev) => prev.concat(category));
    }
  };

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // const {
  //   data: allPosts,
  //   isLoading: loadingPosts,
  //   isFetching,
  // } = useGetAllPostsQuery({ perPage: 12, page }, { refetchOnMountOrArgChange: true });

  const {
    data: allPosts,
    isLoading: loadingPosts,
    isFetching,
  } = useGetAllResourcesQuery({ page, limit: 10 }, { refetchOnMountOrArgChange: true });
  // console.log({ allPosts });

  useEffect(() => {
    if (allPosts) {
      setPosts((prevPosts) => {
        const combinedPosts = [...prevPosts, ...allPosts.items];
        // Use Set to remove duplicate objects based on their IDs
        const uniquePosts = Array.from(new Set(combinedPosts.map((post) => post._id))).map((id) =>
          combinedPosts.find((post) => post._id === id)
        );
        return uniquePosts;
      });

      setTotalPages(allPosts.totalPages);
    }
  }, [allPosts]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Resources</h2>

      <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="inline-flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={category}
              variant={selectedCategory.includes(category) ? "filled" : "outlined"}
              color={selectedCategory.includes(category) ? "primary" : "black"}
              onClick={() => handleSelectCategory(category)}
            />
          ))}
        </div>

        <SearchBar />
      </div>

      <section className="mt-8">
        <h3 className="text-lg font-bold mb-4">Recent Resources </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {posts.map((post, v) => (
            <Link to={`/dashboard/resources/${post.slug}`} key={v + 1}>
              <ResourceCard
                image={post?.featuredImage}
                title={post?.title}
                type="article"
                subtitle={post?.description}
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
            loading={loadingPosts || isFetching}
            onClick={() => setPage((prev) => prev + 1)}
          />
        </div>
      </section>
    </div>
  );
};

export default DashboardResources;
