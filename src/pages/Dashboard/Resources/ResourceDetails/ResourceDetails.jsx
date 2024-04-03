import { Navigate, useParams } from "react-router-dom";
import ResourceSingleArticle from "~/components/DashboardComponents/Resources/ResourceSingleArticle";
import ResourceSingleAudio from "~/components/DashboardComponents/Resources/ResourceSingleAudio";
import ResourceSingleVideo from "~/components/DashboardComponents/Resources/ResourceSingleVideo";

const DashboardResourceDetails = () => {
  const { category, slug } = useParams();

  switch (category) {
    case "videos":
      return <ResourceSingleVideo slug={slug} />;
    case "audios":
      return <ResourceSingleAudio slug={slug} />;
    case "articles":
      return <ResourceSingleArticle slug={slug} />;
    default:
      return <Navigate to="/resources" />;
  }
};

export default DashboardResourceDetails;
