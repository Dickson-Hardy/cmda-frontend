import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Switch from "~/components/Global/FormElements/Switch/Switch";
import TextArea from "~/components/Global/FormElements/TextArea/TextArea";
import formatDate from "~/utilities/fomartDate";

const EventCard = () => {
  return (
    <div className="bg-white border p-4 rounded-2xl w-72">
      <img src="/atmosphere.png" className="bg-onPrimary h-32 w-full rounded-lg mb-2" />
      <span className="px-2 py-1 text-tertiary text-xs font-semibold bg-onTertiary rounded-3xl">Conference</span>
      <h4 className="text-sm font-bold truncate my-2">Medical Problems in West Africa And How to Solve them</h4>
      <p className="text-gray-dark text-xs">{formatDate(new Date()).date + ", " + formatDate(new Date()).time}</p>
      <p className="text-gray-dark text-xs mt-2 truncate">Gbagada, Lagos</p>
    </div>
  );
};

const ResourceCard = () => {
  return (
    <div className="bg-white rounded-2xl w-72">
      <img src="/vite.svg" className="bg-onPrimary h-32 w-full rounded-t-lg" />
      <div className="p-4">
        <h4 className="text-sm font-bold truncate">Medical Problems in West Africa And How to Solve them</h4>
        <p className="text-gray-dark text-xs mt-2 line-clamp-2">
          Learn the 5 best way to practice medicine in 2024. Learn the 5 best way to practice medicine in 2024. Learn
          the 5 best way to practice medicine in 2024.
        </p>
      </div>
    </div>
  );
};

const DashboardHomePage = () => {
  const [shareTestimony, setShareTestimony] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "all" });

  return (
    <div>
      <h2 className="font-bold text-2xl text-primary mb-1">
        Welcome, <span className="text-black">Matthew Ola</span>
      </h2>
      <p>You have no upcoming events</p>

      <section className="bg-secondary/90 text-white rounded-2xl p-6 my-6">
        <div className="w-full md:w-1/2">
          <h3 className="text-lg font-bold">Verse of the Day</h3>
          <p className="text-sm my-4 font-semibold">
            For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish
            but have eternal life.
          </p>
          <span className="text-sm">John 3: 15 KJV</span>
        </div>
      </section>

      <section className="mb-6">
        <div className="flex justify-between items-center gap-2 mb-2">
          <h3 className="text-lg font-bold">Events and Training</h3>
          <Link to="/events" className="text-sm text-primary font-semibold">
            View all
          </Link>
        </div>
        <div className="flex space-x-4 py-2 overflow-x-auto scrollbar-hide">
          {[...Array(10)].map((_, x) => (
            <Link to={`/events/${x + 1}`} key={x + 1}>
              <EventCard />
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <div className="flex justify-between items-center gap-2 mb-2">
          <h3 className="text-lg font-bold">Resource Library</h3>
          <Link to="/resources" className="text-sm text-primary font-semibold">
            View all
          </Link>
        </div>
        <div className="flex space-x-4 py-2 overflow-x-auto scrollbar-hide">
          {[...Array(10)].map((_, v) => (
            <Link to={`/resources/${v + 1}`} key={v + 1}>
              <ResourceCard />
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col md:flex-row gap-10 mb-6">
        <div className="w-full md:w-1/2">
          <div className="flex justify-between items-center gap-2 mb-2">
            <h3 className="text-lg font-bold">Volunteer Positions</h3>
            <Link to="/resources" className="text-sm text-primary font-semibold">
              See more
            </Link>
          </div>
          <ul className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <li key={i} className="bg-white border rounded-xl p-4 flex justify-between items-center gap-4">
                <div>
                  <h4 className="text-sm font-bold truncate">Head of Doctor</h4>
                  <p className="text-gray-dark text-xs mt-1 truncate">Gbagada, Lagos</p>
                </div>
                <span className="text-base">{icons.chevronRight}</span>
              </li>
            ))}
          </ul>
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
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(console.log)}>
            <TextArea
              register={register}
              label="message"
              showTitleLabel={false}
              placeholder={"Share your " + (shareTestimony ? "testimony" : "prayer request")}
              errors={errors}
              rows={6}
            />
            <Switch
              label="anonymous"
              control={control}
              activeText="Post as anonymous"
              inActiveText="Post as anonymous"
              showTitleLabel={false}
            />
            <Button type="submit" label={"Submit " + (shareTestimony ? "Testimony" : "Prayer Request")} />
          </form>
        </div>
      </section>
    </div>
  );
};

export default DashboardHomePage;
