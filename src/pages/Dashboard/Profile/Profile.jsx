import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileImageUpdate from "~/components/DashboardComponents/ProfileTabContents/ProfileImageUpdate";
import Chip from "~/components/Global/Chip/Chip";
import { useState } from "react";
import { useGetAllEventsQuery } from "~/redux/api/events/eventsApi";
import Calendar from "~/components/Global/Calendar/Calendar";
import formatDate from "~/utilities/fomartDate";
import Loading from "~/components/Global/Loading/Loading";
import ProfileTabTrainingRecord from "~/components/DashboardComponents/ProfileTabContents/TrainingRecord";

const DashboardProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const fullName = user ? user.firstName + " " + user?.middleName + " " + user?.lastName : "No Name";

  const [date, setDate] = useState(new Date());
  // console.log({ user });
  // const {
  //   data: eventsOnThisDay,
  //   isLoading,
  //   isFetching,
  // } = useGetAllEventsQuery(
  //   { page: 1, limit: 5, date: date.toISOString().slice(0, 10) },
  //   { refetchOnMountOrArgChange: true }
  // );

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outlined">Subscribe</Button>
        {["student", "doctor"].includes(user?.role) ? (
          <Button label="Transit" color={user?.role === "student" ? "secondary" : "primary"} />
        ) : null}
      </div>

      <section className="flex gap-6 flex-col md:flex-row mb-6">
        <div className="w-full md:w-1/2 bg-white rounded-xl p-4 md:px-4 md:py-8 shadow">
          <div className="w-full flex flex-col md:flex-row h-full items-center gap-3 md:gap-6">
            <ProfileImageUpdate />
            <div className="flex flex-col justify-between h-full w-full">
              <h3 className="capitalize font-semibold text-lg mb-4">{fullName}</h3>
              <p className="text-sm mb-4 font-medium flex items-center gap-2">
                <span className="text-gray">Membership Type:</span>
                <Chip
                  className="capitalize text-xs !h-7 !rounded-full"
                  color={user?.role === "student" ? "secondary" : user?.role === "doctor" ? "primary" : "tertiary"}
                  label={user?.role}
                />
              </p>
              <p className="text-sm font-medium mb-4">
                <span className="text-gray">Chapter/Region: </span> {user?.region}
              </p>
              <p className="text-sm font-medium mb-4">
                <span className="text-gray">Email: </span> {user?.email}
              </p>
              <p className="text-sm font-medium mb-4">
                <span className="text-gray">Phone: </span> {user?.phone || "---"}
              </p>
              {/* <div className="flex gap-2">
                {user?.socials.map((item) => (
                  <a
                    key={item.name}
                    href={item.link?.startsWith("http") ? item.link : "https://" + item.link}
                    className="bg-gray-light rounded-full text-lg h-9 w-9 inline-flex justify-center items-center hover:text-primary cursor-pointer"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {icons[item.name]}
                  </a>
                ))}
              </div> */}
              <div className="flex justify-end text-sm">
                <Link to="/dashboard/edit-profile" className="text-primary font-semibold underline">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-white rounded-xl p-4 flex flex-col md:px-4 md:py-8 shadow">
          <h3 className="mb-2 text-base font-semibold">About Me</h3>
          <p className="text-gray-dark text-sm font-medium mb-4">{user?.bio}</p>
          <p className="text-sm font-medium mb-4">
            <span className="text-gray">Date of Brith: </span>{" "}
            {user?.dateOfBirth ? formatDate(user.dateOfBirth).date : "--/--/----"}
          </p>
          <p className="text-sm font-medium mb-4 capitalize">
            <span className="text-gray">Gender: </span> {user?.gender}
          </p>
          {/* <p className="text-sm font-medium mb-4">
            <span className="text-gray">Phone: </span> {user?.phone || "---"}
          </p> */}
          <div className="flex justify-end mt-auto text-sm">
            <Link to="/dashboard/edit-profile" className="text-primary font-semibold underline">
              Edit Profile
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl my-8 shadow pt-2">
        <ProfileTabTrainingRecord />
      </section>

      <section className="flex gap-6 flex-col md:flex-row mb-6">
        <div className="w-full md:w-1/3 bg-white shadow px-4 py-4 rounded-xl">
          <h3 className="text-base font-bold mb-2">Community Statistics</h3>
          <ul className="space-y-4 capitalize">
            <li className="flex items-center gap-4">
              <span className="h-14 w-14 rounded-xl inline-flex items-center justify-center bg-black/10 text-black text-2xl">
                {icons.calendar}
              </span>
              <div>
                <span className="font-bold text-lg">0</span>
                <p className="text-xs text-gray-dark">Total events attended</p>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <span className="h-14 w-14 rounded-xl inline-flex items-center justify-center bg-onPrimary text-primary text-2xl">
                {icons.person}
              </span>
              <div>
                <span className="font-bold text-lg">0</span>
                <p className="text-xs text-gray-dark">Total trainings attended</p>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <span className="h-14 w-14 rounded-xl inline-flex items-center justify-center bg-onSecondary text-secondary text-2xl">
                {icons.verified}
              </span>
              <div>
                <span className="font-bold text-lg">0</span>
                <p className="text-xs text-gray-dark">CME points awarded</p>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <span className="h-14 w-14 rounded-xl inline-flex items-center justify-center bg-onTertiary text-tertiary text-2xl">
                {icons.file}
              </span>
              <div>
                <span className="font-bold text-lg">0</span>
                <p className="text-xs text-gray-dark">Total times volunteered</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="w-full md:w-1/3">
          <Calendar defaultDate={date} onDateSelect={setDate} />
        </div>

        <div className="w-full md:w-1/3 bg-white shadow p-4 rounded-lg">
          <h3 className="text-base font-bold mb-2">
            {"Upcoming Events - " +
              (date?.toDateString() === new Date().toDateString() ? "Today, " : "") +
              " " +
              formatDate(date).date}
          </h3>
          {/* 
          {isLoading || isFetching ? (
            <div className="h-52 flex justify-center items-center">
              <Loading className="text-primary w-12 h-12" />
            </div>
          ) : (
            <ul className="space-y-2 h-52 overflow-y-auto py-2">
              {eventsOnThisDay?.data?.map((evt) => (
                <li key={evt?._id}>
                  <Link to={`/dashboard/events/${evt?._id}`} className="block bg-white border rounded-xl p-4 space-y-2">
                    <h4 className="text-sm font-bold truncate capitalize">{evt?.title}</h4>
                    <div className="text-gray-dark text-xs mb-2 truncate flex items-center gap-2">
                      <span>{evt?.eventType === "physical" ? icons.location : icons.globe}</span>
                      <p className="truncate">
                        {evt?.eventType === "physical" ? evt.physicalLocation : evt.virtualLink}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )} */}
        </div>
      </section>
    </div>
  );
};

export default DashboardProfilePage;
