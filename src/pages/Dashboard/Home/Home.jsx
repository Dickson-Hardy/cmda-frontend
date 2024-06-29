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
import Slider from "react-slick";
import { useGetAllEventsQuery } from "~/redux/api/events/eventsApi";
import { membersResponsiveSliderSettings, responsiveSliderSettings } from "~/constants/sliderConstants";
import { useCreatePrayerTestimonyMutation } from "~/redux/api/prayerTestimonies/prayerTestimoniesApi";
import { toast } from "react-toastify";
import { useGetVolunteerJobsQuery } from "~/redux/api/volunteer/volunteerApi";
import { useGetAllUsersQuery } from "~/redux/api/user/userApi";
import MemberCard from "~/components/DashboardComponents/Members/MemberCard";
import Modal from "~/components/Global/Modal/Modal";
import doctorPng from "~/assets/images/cheerful-doctor.png";
import { useGetAllResourcesQuery } from "~/redux/api/external/resourceApi";

const DashboardHomePage = () => {
  const user = useSelector((state) => state.auth.user);
  const [shareTestimony, setShareTestimony] = useState(false);
  const [prayerModal, setPrayerModal] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "all" });

  // get verse of the day
  // const { data: randomVerse, isLoading: loadingVerse } = useGetRandomVerseQuery(null, {
  //   refetchOnMountOrArgChange: true,
  // });

  // const { data: blog, isLoading: loadingPosts } = useGetAllPostsQuery(
  //   { perPage: 10, page: 1 },
  //   { refetchOnMountOrArgChange: true }
  // );
  const { data: blog, isLoading: loadingPosts } = useGetAllResourcesQuery(
    { page: 1, limit: 10 },
    { refetchOnMountOrArgChange: true }
  );

  const { data: events, isLoading: loadingEvents } = useGetAllEventsQuery(
    { page: 1, limit: 10 },
    { refetchOnMountOrArgChange: true }
  );
  // console.log(events);
  const { data: volunteerJobs, isLoading: loadingVolunteers } = useGetVolunteerJobsQuery(
    { page: 1, limit: 3 },
    { refetchOnMountOrArgChange: true }
  );

  const [createPrayerTestimony, { isLoading: isCreatingPrayer }] = useCreatePrayerTestimonyMutation();

  const { data: allUsers, isLoading: loadingUsers } = useGetAllUsersQuery(
    { page: 1, limit: 10 },
    { refetchOnMountOrArgChange: true }
  );
  // console.log(allUsers?.data?.items);
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
      <section className="h-[400px] w-full rounded-3xl mb-8" style={{ backgroundImage: `url(${doctorPng})` }}>
        <div className="h-full w-full bg-black/50 rounded-3xl text-white p-8 flex flex-col justify-between">
          <h2 className="font-bold text-2xl">Welcome, {user?.fullName}</h2>
          {/* {loadingVerse ? (
            <Loading />
          ) : (
            <div className="flex justify-between gap-1 items-end">
              <div className="w-5/6 md:w-1/2">
                <h3 className="text-lg font-bold">Daily Nugget</h3>
                <p className="text-sm my-4 font-semibold">{randomVerse?.content}</p>
                <span className="text-sm">- {randomVerse?.verse}</span>
              </div>

              <button type="button" onClick={() => setPrayerModal(true)} className="text-4xl animate-bounce">
                {icons.pray}
              </button>
            </div>
          )} */}
        </div>
      </section>

      <section className="mb-6">
        <div className="flex justify-between items-center gap-2 mb-2">
          <h3 className="text-lg font-bold">Connect With Others</h3>
          <Link to="/dashboard/members" className="text-sm text-primary font-semibold">
            View all
          </Link>
        </div>
        {loadingUsers ? (
          <Loading height={48} width={48} className="text-primary" />
        ) : (
          <Slider {...membersResponsiveSliderSettings}>
            {allUsers?.data?.items
              ?.filter((x) => x._id !== user?._id)
              .map((mem) => {
                // console.log(mem);
                return (
                  <MemberCard
                    key={mem._id}
                    id={mem._id}
                    width="auto"
                    fullName={mem.fullName}
                    avatar={mem.avatarUrl}
                    role={mem.role}
                    region={mem.region}
                  />
                );
              })}
          </Slider>
        )}
      </section>

      <section className="mb-6">
        <div className="flex justify-between items-center gap-2 mb-2">
          <h3 className="text-lg font-bold">Events and Training</h3>
          <Link to="/dashboard/events" className="text-sm text-primary font-semibold">
            View all
          </Link>
        </div>
        {loadingEvents ? (
          <Loading height={48} width={48} className="text-primary" />
        ) : (
          <Slider {...responsiveSliderSettings} speed={1000} autoplaySpeed={4000}>
            {/* {events?.items?.map((evt) => {
              // console.log(evt);
              return (
                <Link key={evt._id} to={`/dashboard/events/${evt._id}`}>
                  <EventCard
                    width="auto"
                    title={evt.name}
                    date={evt.eventDateTime}
                    image={evt.featuredImage}
                    tag={evt.audience}
                    location={evt.type === "Physical" ? evt.location : evt.virtualLink}
                    description={evt?.description}
                  />
                </Link>
              );
            })} */}
            {[1, 2, 3, 4].map((evt) => {
              // console.log(evt);
              return (
                <Link key={events?.items[0].slug} to={`/dashboard/events/${events?.items[0].slug}`}>
                  <EventCard
                    width="auto"
                    title={events?.items[0].name}
                    date={events?.items[0].eventDateTime}
                    image={events?.items[0].featuredImage}
                    tag={events?.items[0].audience}
                    location={
                      events?.items[0].type === "Physical" ? events?.items[0].location : events?.items[0].virtualLink
                    }
                    description={events?.items[0]?.description}
                  />
                </Link>
              );
            })}
          </Slider>
        )}
      </section>

      <section className="mb-6">
        <div className="flex justify-between items-center gap-2 mb-2">
          <h3 className="text-lg font-bold">Resource Library</h3>
          <Link to="/dashboard/resources" className="text-sm text-primary font-semibold">
            View all
          </Link>
        </div>
        {loadingPosts ? (
          <Loading height={48} width={48} className="text-primary" />
        ) : (
          <Slider {...responsiveSliderSettings}>
            {blog?.items?.map((post, v) => (
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
          </Slider>
        )}
      </section>

      <section className="flex flex-col md:flex-row gap-10 mb-6">
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-center gap-2 mb-2">
            <h3 className="text-lg font-bold">Volunteer Positions</h3>
            <Link to="/dashboard/volunteers" className="text-sm text-primary font-semibold">
              See more
            </Link>
          </div>

          {loadingVolunteers ? (
            <Loading height={48} width={48} className="text-primary" />
          ) : (
            <div className="flex flex-col gap-4">
              {volunteerJobs?.data?.map((vol, i) => (
                <Link to={`/dashboard/volunteer/${vol._id}`} key={i}>
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

      <Modal isOpen={prayerModal} maxWidth={360} onClose={() => setPrayerModal(false)}>
        <div className="text-center">
          <h4 className="font-bold text-base mb-2"> Prayer Point</h4>
          <p className="mb-4 text-sm">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Libero sunt magnam repellat accusamus ab cumque
            obcaecati illum aperiam fugit laudantium aut esse voluptas, tempore reprehenderit maiores! Perferendis
            labore facere eveniet?
          </p>
          <button
            type="button"
            className="text-sm text-primary underline font-semibold"
            onClick={() => setPrayerModal(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardHomePage;
