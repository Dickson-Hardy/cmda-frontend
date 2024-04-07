import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EventCard from "~/components/DashboardComponents/Events/EventCard";
import ResourceCard from "~/components/DashboardComponents/Resources/ResourceCard";
import Volunteer from "~/components/DashboardComponents/Volunteer/Volunteer";
import Button from "~/components/Global/Button/Button";
import Switch from "~/components/Global/FormElements/Switch/Switch";
import TextArea from "~/components/Global/FormElements/TextArea/TextArea";
import Loading from "~/components/Global/Loading/Loading";
import { useGetAllPostsQuery } from "~/redux/api/external/wordPressApi";
import { useGetRandomVerseQuery } from "~/redux/api/verse/verseApi";
import Slider from "react-slick";
import { useGetAllEventsQuery } from "~/redux/api/events/eventsApi";
import { responsiveSliderSettings } from "~/assets/js/constants/sliderConstants";
import { useCreatePrayerTestimonyMutation } from "~/redux/api/prayerTestimonies/prayerTestimoniesApi";
import { toast } from "react-toastify";
import { useGetVolunteerJobsQuery } from "~/redux/api/volunteer/volunteerApi";

const DashboardHomePage = () => {
  const user = useSelector((state) => state.auth.user);
  const [shareTestimony, setShareTestimony] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "all" });

  // get verse of the day
  const { data: randomVerse, isLoading: loadingVerse } = useGetRandomVerseQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const fullName = user ? user.firstName + " " + user?.middleName + " " + user?.lastName : "No Name";

  const { data: blog, isLoading: loadingPosts } = useGetAllPostsQuery(
    { perPage: 10, page: 1 },
    { refetchOnMountOrArgChange: true }
  );

  const { data: events, isLoading: loadingEvents } = useGetAllEventsQuery(
    { page: 1, limit: 10, status: null },
    { refetchOnMountOrArgChange: true }
  );

  const { data: volunteerJobs, isLoading: loadingVolunteers } = useGetVolunteerJobsQuery(
    { page: 1, limit: 3 },
    { refetchOnMountOrArgChange: true }
  );

  const [createPrayerTestimony, { isLoading: isCreatingPrayer }] = useCreatePrayerTestimonyMutation();

  const handleCreatePrayer = (data) => {
    const payload = {
      ...data,
      isAnonymous: String(data.isAnonymous),
      type: shareTestimony ? "testimony" : "prayer",
    };
    createPrayerTestimony(payload)
      .unwrap()
      .then(() => {
        toast.success(`Your ${payload.type} has been submitted successfully`);
        reset();
      });
  };

  return (
    <div>
      <h2 className="font-bold text-2xl text-primary mb-1">
        Welcome, <span className="text-black">{fullName}</span>
      </h2>
      <p>You have no upcoming events</p>

      <section className="bg-secondary/90 text-white rounded-2xl p-6 my-6">
        {loadingVerse ? (
          <Loading />
        ) : (
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-bold">Verse of the Day</h3>
            <p className="text-sm my-4 font-semibold">{randomVerse?.content}</p>
            <span className="text-sm">- {randomVerse?.verse}</span>
          </div>
        )}
      </section>

      <section className="mb-6">
        <div className="flex justify-between items-center gap-2 mb-2">
          <h3 className="text-lg font-bold">Events and Training</h3>
          <Link to="/events" className="text-sm text-primary font-semibold">
            View all
          </Link>
        </div>

        {loadingEvents ? (
          <Loading height={48} width={48} className="text-primary" />
        ) : (
          <Slider {...responsiveSliderSettings}>
            {events?.data?.map((evt) => (
              <Link key={evt._id} to={`/events/${evt._id}`}>
                <EventCard
                  width="auto"
                  title={evt.title}
                  date={evt.eventDateTime}
                  image={evt.eventImageUrl}
                  tag={evt.eventTag}
                  location={evt.eventType === "physical" ? evt.physicalLocation : evt.virtualLink}
                />
              </Link>
            ))}
          </Slider>
        )}
      </section>

      <section className="mb-6">
        <div className="flex justify-between items-center gap-2 mb-2">
          <h3 className="text-lg font-bold">Resource Library</h3>
          <Link to="/resources" className="text-sm text-primary font-semibold">
            View all
          </Link>
        </div>
        {loadingPosts ? (
          <Loading height={48} width={48} className="text-primary" />
        ) : (
          <Slider {...responsiveSliderSettings}>
            {blog?.posts.map((post, v) => (
              <Link to={`/resources/articles/${post.slug}`} key={v + 1}>
                <ResourceCard
                  image={post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
                  title={post?.title?.rendered}
                  type={"article"}
                  subtitle={post?.excerpt?.rendered}
                  width="auto"
                />
              </Link>
            ))}
          </Slider>
        )}
      </section>

      <section className="flex flex-col md:flex-row gap-10 mb-6">
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-center gap-2 mb-2">
            <h3 className="text-lg font-bold">Volunteer Positions</h3>
            <Link to="/volunteers" className="text-sm text-primary font-semibold">
              See more
            </Link>
          </div>

          {loadingVolunteers ? (
            <Loading height={48} width={48} className="text-primary" />
          ) : (
            <div className="flex flex-col gap-4">
              {volunteerJobs?.data?.map((vol, i) => (
                <Link to={`/volunteer/${vol._id}`} key={i}>
                  <Volunteer position={vol?.position} location={vol?.location} />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-center gap-2 mb-2">
            <h3 className="text-lg font-bold">{shareTestimony ? "Share a Testimony" : "Prayer Request"}</h3>
            <button
              type="button"
              className="text-sm text-primary font-semibold"
              onClick={() => setShareTestimony(!shareTestimony)}
            >
              {shareTestimony ? "Make prayer request" : "Share a testimony"}
            </button>
          </div>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(handleCreatePrayer)}>
            <TextArea
              register={register}
              label="content"
              showTitleLabel={false}
              placeholder={"Share your " + (shareTestimony ? "testimony" : "prayer request")}
              errors={errors}
              rows={6}
            />
            <Switch
              label="isAnonymous"
              control={control}
              activeText="Post as anonymous"
              inActiveText="Post as anonymous"
              showTitleLabel={false}
            />
            <Button
              large
              loading={isCreatingPrayer}
              type="submit"
              label={"Submit " + (shareTestimony ? "Testimony" : "Prayer Request")}
            />
          </form>
        </div>
      </section>
    </div>
  );
};

export default DashboardHomePage;
