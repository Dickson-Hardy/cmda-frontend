import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import ResourceCard from "./ResourceCard";

const ResourceSingleVideo = () => {
  return (
    <div className="bg-white p-6 rounded-3xl">
      <Link
        to="/resources"
        className="inline-flex gap-2 text-base items-center font-medium text-primary hover:underline"
      >
        {icons.arrowLeft} Back to Resources
      </Link>
      <div className="bg-slate-600 rounded-2xl h-96 w-full flex items-center justify-center my-8">
        <button className="text-white text-2xl p-1 border-2 border-white rounded-full">{icons.play}</button>
      </div>
      <h2 className="text-2xl font-bold mb-4">Medical Problems in West Africa</h2>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil impedit veritatis omnis maiores dolores vel
        molestiae quae ullam, ratione nobis voluptatum quam, nesciunt a cupiditate illo laudantium harum iste corrupti.
      </p>

      <section className="mt-8">
        <h3 className="text-lg font-bold">Watch Other Videos</h3>
        <div className="flex space-x-4 py-2 overflow-x-auto scrollbar-hide">
          {[...Array(10)].map((_, v) => (
            <Link to={`/resources/videos/${v + 1}`} key={v + 1}>
              <ResourceCard
                image="/atmosphere.png"
                title="Medical Problems in West Africa And How to Solve them"
                type={"video"}
                subtitle={`Learn the 5 best way to practice medicine in 2024. Learn the 5 best way to practice medicine in 2024. Learn
                the 5 best way to practice medicine in 2024.`}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResourceSingleVideo;
