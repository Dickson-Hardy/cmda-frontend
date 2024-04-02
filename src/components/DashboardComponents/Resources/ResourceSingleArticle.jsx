import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import ResourceCard from "./ResourceCard";
import formatDate from "~/utilities/fomartDate";
import { useGetAllPostsQuery, useGetSinglePostQuery } from "~/redux/api/external/wordPressApi";
import { useMemo } from "react";
import Slider from "react-slick";
import Loading from "~/components/Global/Loading/Loading";
import { responsiveSliderSettings } from "~/assets/js/constants/sliderConstants";

const ResourceSingleArticle = ({ slug }) => {
  const { data: post } = useGetSinglePostQuery({ slug });

  const { data: allPosts, isLoading: loadingOthers } = useGetAllPostsQuery({ perPage: 11, page: 1 });

  const OTHERS = useMemo(() => {
    const posts = allPosts?.posts || [];
    return posts.filter((p) => p.slug !== slug);
  }, [allPosts, slug]);

  const handleShare = (social) => alert("Sharing on " + social);

  return (
    <div className="bg-white p-6 rounded-3xl">
      <Link
        to="/resources"
        className="inline-flex gap-2 text-base items-center font-medium text-primary hover:underline"
      >
        {icons.arrowLeft} Back to Resources
      </Link>
      <img
        src={post?.yoast_head_json?.og_image?.[0]?.url}
        alt={slug}
        className="rounded-2xl h-auto w-full mx-auto my-8"
      />

      <h2 className="text-3xl font-bold mb-4" dangerouslySetInnerHTML={{ __html: post?.title?.rendered }} />
      <div className="flex items-center gap-4 my-6">
        {post?._embedded.author?.[0]?.avatar_urls ? (
          <img src={post?._embedded.author?.[0]?.avatar_urls["96"]} className="bg-onPrimary rounded-full h-14 w-14" />
        ) : (
          <span className="h-14 w-14 flex-shrink-0 bg-onSecondary rounded-full inline-flex items-center justify-center text-4xl">
            {icons.person}
          </span>
        )}
        <div className="truncate">
          <h5 className="font-semibold capitalize text-base truncate">
            {post?._embedded?.author?.[0]?.name || "Admin CMDA NG"}
          </h5>
          <p className="text-sm">{post?._embedded.author?.[0]?.description || "--- ---"}</p>
        </div>
      </div>

      <div dangerouslySetInnerHTML={{ __html: post?.content?.rendered }} className="text-base leading-loose blogpost" />

      <div className="flex items-center justify-between mt-8">
        <p className="text-base font-semibold text-gray">
          Posted: <span className="text-black">{post?.date ? formatDate(post.date).date : "--/--/--"}</span>
        </p>
        <div className="inline-flex items-center justify-center gap-2">
          <span className="mr-2 font-semibold">Share article:</span>
          {["facebook", "twitter", "whatsapp", "linkedIn", "instagram"].map((item) => (
            <button
              key={item}
              type="button"
              className="bg-gray-light rounded-full text-xl h-10 w-10 inline-flex justify-center items-center hover:text-primary"
              onClick={() => handleShare(item)}
            >
              {icons[item]}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-8">
        <h3 className="text-lg font-bold mb-2">Read Other Articles</h3>
        {loadingOthers ? (
          <Loading height={48} width={48} className="text-primary" />
        ) : (
          <Slider {...responsiveSliderSettings}>
            {OTHERS.map((item, v) => (
              <Link to={`/resources/articles/${item.slug}`} key={v + 1}>
                <ResourceCard
                  image={item?.yoast_head_json?.og_image?.[0]?.url}
                  title={item?.title?.rendered}
                  type={"article"}
                  subtitle={item.yoast_head_json?.description}
                  width="auto"
                />
              </Link>
            ))}
          </Slider>
        )}
      </section>
    </div>
  );
};
export default ResourceSingleArticle;
