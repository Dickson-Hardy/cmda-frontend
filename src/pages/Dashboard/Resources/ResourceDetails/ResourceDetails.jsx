import { Navigate, useParams } from "react-router-dom";
import ResourceSingleArticle from "~/components/DashboardComponents/Resources/ResourceSingleArticle";
import ResourceSingleAudio from "~/components/DashboardComponents/Resources/ResourceSingleAudio";
import ResourceSingleVideo from "~/components/DashboardComponents/Resources/ResourceSingleVideo";

const DashboardResourceDetails = () => {
  const { category, id } = useParams();
  console.log({ category, id });

  switch (category) {
    case "videos":
      return <ResourceSingleVideo />;
    case "audios":
      return <ResourceSingleAudio />;
    case "articles":
      return <ResourceSingleArticle />;
    default:
      return <Navigate to="/resources" />;
  }
};

export default DashboardResourceDetails;
