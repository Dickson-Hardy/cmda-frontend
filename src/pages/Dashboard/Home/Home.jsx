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
import { useGetAllEventsQuery } from "~/redux/api/events/eventsApi";
import { useCreatePrayerTestimonyMutation } from "~/redux/api/prayerTestimonies/prayerTestimoniesApi";
import { toast } from "react-toastify";
import { useGetVolunteerJobsQuery } from "~/redux/api/volunteer/volunteerApi";
import icons from "~/assets/js/icons";
import { useGetAllUsersQuery } from "~/redux/api/user/userApi";
import MemberCard from "~/components/DashboardComponents/Members/MemberCard";
import Modal from "~/components/Global/Modal/Modal";
import doctorPng from "~/assets/images/cheerful-doctor.png";
import { useGetLatestDevotionalQuery } from "~/redux/api/devotionals/devotionalsApi";
import { useGetAllResourcesQuery } from "~/redux/api/resources/resourcesApi";
import { selectAuth } from "~/redux/features/auth/authSlice";
import MultiItemCarousel from "~/components/Global/MultiItemCarousel/MultiItemCarousel";

const DashboardHomePage = () => {
  const { user } = useSelector(selectAuth);
  const [shareTestimony, setShareTestimony] = useState(false);
  const [prayerModal, setPrayerModal] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "all" });

  const { data: devotional, isLoading: loadingVerse } = useGetLatestDevotionalQuery();
  const { data: allResources, isLoading: loadingRes } = useGetAllResourcesQuery({ page: 1, limit: 10 });
  const { data: events, isLoading: loadingEvents } = useGetAllEventsQuery({ page: 1, limit: 10 });
  const { data: jobs, isLoading: loadingJobs } = useGetVolunteerJobsQuery({ page: 1, limit: 3 });
  const { data: allUsers, isLoading: loadingUsers } = useGetAllUsersQuery({ page: 1, limit: 10 });
  const [createPrayerTestimony, { isLoading: isCreatingPrayer }] = useCreatePrayerTestimonyMutation();

  const handleCreatePrayer = (data) => {
    const payload = { ...data, type: shareTestimony ? "testimony" : "prayer" };
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
          <h2 className="font-bold text-2xl">Welcome, {user?.firstName}</h2>
          {loadingVerse ? (
            <Loading />
          ) : (
            <div className="flex justify-between gap-1 items-end">
              <div className="w-5/6 md:w-1/2">
                <h3 className="text-lg font-bold">Daily Nugget</h3>
                <p className="text-sm my-4 font-semibold">{devotional?.keyVerseContent}</p>
                <span className="text-sm">- {devotional?.keyVerse}</span>
              </div>

              <button type="button" onClick={() => setPrayerModal(true)} className="text-4xl animate-bounce">
                {icons.pray}
              </button>
            </div>
          )}
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
          <MultiItemCarousel>
            {allUsers?.items
              ?.filter((x) => x._id !== user?._id)
              .map((mem) => (
                <MemberCard
                  key={mem.membershipId}
                  memId={mem.membershipId}
                  id={mem._id}
                  fullName={mem.fullName}
                  avatar={mem.avatarUrl}
                  role={mem.role}
                  region={mem.region}
                  width="auto"
                  className="mx-2"
                />
              ))}
          </MultiItemCarousel>
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
          <MultiItemCarousel>
            {events?.items?.map((evt) => (
              <Link key={evt._id} to={`/dashboard/events/${evt.slug}`} className="mb-4 mx-10">
                <EventCard
                  title={evt.name}
                  date={evt.eventDateTime}
                  image={evt.featuredImageUrl}
                  type={evt.eventType}
                  location={evt.linkOrLocation}
                  description={evt.description}
                  width="auto"
                  className="mx-2"
                />
              </Link>
            ))}
          </MultiItemCarousel>
        )}
      </section>

      <section className="mb-6">
        <div className="flex justify-between items-center gap-2 mb-2">
          <h3 className="text-lg font-bold">Resource Library</h3>
          <Link to="/dashboard/resources" className="text-sm text-primary font-semibold">
            View all
          </Link>
        </div>
        {loadingRes ? (
          <Loading height={48} width={48} className="text-primary" />
        ) : (
          <MultiItemCarousel>
            {allResources?.items?.map((res) => (
              <Link to={`/dashboard/resources/${res.slug}`} key={res.slug} className="mb-4 mx-10">
                <ResourceCard
                  image={res?.featuredImage}
                  title={res?.title}
                  type={res.category}
                  subtitle={res.description}
                  width="auto"
                  className="mx-2"
                />
              </Link>
            ))}
          </MultiItemCarousel>
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

          {loadingJobs ? (
            <Loading height={48} width={48} className="text-primary" />
          ) : (
            <div className="flex flex-col gap-4">
              {jobs?.items?.map((vol, i) => (
                <Link to={`/dashboard/volunteer/${vol._id}`} key={i}>
                  <Volunteer position={vol?.title} location={vol?.companyLocation} />
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
          <h4 className="font-bold text-base mb-2"> {devotional?.title}</h4>
          <p className="mb-4 text-sm">{devotional?.content}</p>
          <h4 className="font-bold text-base mb-2"> Prayer Point</h4>
          <p className="mb-4 text-sm">{devotional?.prayerPoints}</p>
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
