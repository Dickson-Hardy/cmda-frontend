import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import ResourceCard from "./ResourceCard";
import formatDate from "~/utilities/fomartDate";

const ResourceSingleArticle = () => {
  return (
    <div className="bg-white p-6 rounded-3xl">
      <Link
        to="/resources"
        className="inline-flex gap-2 text-base items-center font-medium text-primary hover:underline"
      >
        {icons.arrowLeft} Back to Resources
      </Link>
      <div className="bg-slate-600 rounded-2xl h-96 w-full flex items-center justify-center my-8" />
      <h2 className="text-3xl font-bold mb-4">
        The effects of alcohol consumption on your liver, lungs, kidney and digestive system
      </h2>
      <div className="flex items-center gap-4 my-6">
        {/* <img src="" className="bg-onPrimary rounded-full h-14 w-14" /> */}
        <span className="h-14 w-14 flex-shrink-0 bg-onSecondary rounded-full inline-flex items-center justify-center text-4xl">
          {icons.person}
        </span>
        <div className="truncate">
          <h5 className="font-semibold text-base truncate">Dr John Simeon (BMBS, BM, MBChB).</h5>
          <p className="text-sm">Doctor of Human Anatomy, Oxford University Teaching Hospital</p>
        </div>
      </div>
      <div className="space-y-6">
        {[...Array(7)].map((_, x) => (
          <p key={x}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil impedit veritatis omnis maiores dolores vel
            molestiae quae ullam, ratione nobis voluptatum quam, nesciunt a cupiditate illo laudantium harum iste
            corrupti. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea nobis officiis dicta possimus
            assumenda natus, neque distinctio minima culpa incidunt nulla quos reiciendis quas facere repellat labore
            quis delectus dolorem. Lorem, ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        ))}
      </div>
      <div className="flex items-center justify-between mt-8">
        <p className="text-base font-semibold text-gray">
          Posted: <span className="text-black">{formatDate(new Date()).date}</span>
        </p>
        <div className="inline-flex items-center justify-center gap-2">
          <span className="mr-2 font-semibold">Share article:</span>
          {[...Array(4)].map((_, i) => (
            <button
              key={i}
              type="button"
              className="bg-gray-light rounded-full text-xl h-10 w-10 inline-flex justify-center items-center hover:text-primary"
            >
              {icons.store}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-8">
        <h3 className="text-lg font-bold">Read Other Articles</h3>
        <div className="flex space-x-4 py-2 overflow-x-auto scrollbar-hide">
          {[...Array(10)].map((_, v) => (
            <Link to={`/resources/articles/${v + 1}`} key={v + 1}>
              <ResourceCard
                image="/atmosphere.png"
                title="Medical Problems in West Africa And How to Solve them"
                type={"article"}
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
export default ResourceSingleArticle;

// import { Link } from "react-router-dom";
// import ResourceCard from "./ResourceCard";
// import icons from "~/assets/js/icons";

// const ResourceSingleArticle = () => {
//   <div className="bg-white p-6 rounded-3xl">
//     <Link to="/resources" className="inline-flex gap-2 text-base items-center font-medium text-primary hover:underline">
//       {icons.arrowLeft} Back to Resources
//     </Link>
//     <div className="bg-slate-600 rounded-2xl h-96 w-full flex items-center justify-center my-8" />
//     <h2 className="text-2xl font-bold mb-4">Medical Problems in West Africa</h2>
//     <div className="space-y-6">
//       {[...Array(7)].map((_, x) => (
//         <p key={x}>
//           Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil impedit veritatis omnis maiores dolores vel
//           molestiae quae ullam, ratione nobis voluptatum quam, nesciunt a cupiditate illo laudantium harum iste
//           corrupti.
//         </p>
//       ))}
//     </div>

//     <section className="mt-8">
//       <h3 className="text-lg font-bold">Read Other Articles</h3>
//       <div className="flex space-x-4 py-2 overflow-x-auto scrollbar-hide">
//         {[...Array(10)].map((_, v) => (
//           <Link to={`/resources/articles"}/${v + 1}`} key={v + 1}>
//             <ResourceCard
//               image="/atmosphere.png"
//               title="Medical Problems in West Africa And How to Solve them"
//               type={"article"}
//               subtitle={`Learn the 5 best way to practice medicine in 2024. Learn the 5 best way to practice medicine in 2024. Learn
//                 the 5 best way to practice medicine in 2024.`}
//             />
//           </Link>
//         ))}
//       </div>
//     </section>
//   </div>;
// };

// export default ResourceSingleArticle;
