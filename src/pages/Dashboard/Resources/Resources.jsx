import { useState } from "react";
import { Link } from "react-router-dom";
import ResourceCard from "~/components/DashboardComponents/ResourceCard";
import Chip from "~/components/Global/Chip/Chip";
import SearchBar from "~/components/Global/SearchBar/SearchBar";

const DashboardResources = () => {
  const CATEGORIES = ["Articles", "Videos", "Audios", "Presentations"];

  const [selectedCategory, setSelectedCategory] = useState([]);

  const handleSelectCategory = (category) => {
    if (selectedCategory.includes(category)) {
      setSelectedCategory((prev) => prev.filter((item) => item !== category));
    } else {
      setSelectedCategory((prev) => prev.concat(category));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Resources</h2>

      <div className="flex justify-between items-center">
        <div className="inline-flex gap-2">
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

      <section className="my-8">
        <h3 className="text-lg font-bold mb-4">Recent Resources </h3>
        <div className="grid grid-cols-3 gap-8">
          {[...Array(12)].map((_, v) => (
            <Link to={`/resources/${v % 2 ? "audios" : v % 3 ? "videos" : "articles"}/${v + 1}`} key={v + 1}>
              <ResourceCard
                width="auto"
                image="/atmosphere.png"
                title="Medical Problems in West Africa And How to Solve them"
                type={v % 2 ? "audio" : v % 3 ? "video" : "article"}
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

export default DashboardResources;
