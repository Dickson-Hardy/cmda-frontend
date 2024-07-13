import icons from "~/assets/js/icons";
import { useState } from "react";
import { useGetAllEventsQuery } from "~/redux/api/events/eventsApi";
import { Link } from "react-router-dom";
import formatDate from "~/utilities/fomartDate";
import Loading from "~/components/Global/Loading/Loading";
import Calendar from "~/components/Global/Calendar/Calendar";
import { classNames } from "~/utilities/classNames";

const EventsCalender = () => {
  const [date, setDate] = useState(new Date());

  const {
    data: eventsOnThisDay,
    isLoading,
    isFetching,
  } = useGetAllEventsQuery({
    page: 1,
    limit: 10,
    eventDate: date.toLocaleDateString("en-GB").split("/").reverse().join("-"),
  });

  return (
    <div className="sticky top-0">
      <Calendar defaultDate={date} onDateSelect={setDate} />

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">
          {(date?.toDateString() === new Date().toDateString() ? "Today, " : "Date: ") + " " + formatDate(date).date}
        </h3>
        {isLoading || isFetching ? (
          <div className="h-52 flex justify-center items-center">
            <Loading className="text-primary w-12 h-12" />
          </div>
        ) : eventsOnThisDay?.items?.length ? (
          <ul className="space-y-3 h-52 overflow-y-auto py-2">
            {eventsOnThisDay?.items.map((evt, i) => (
              <li key={i}>
                <Link to={`/dashboard/events/${evt?.slug}`} className="block bg-white border rounded-xl p-4 space-y-2">
                  <h4 className="text-sm font-bold truncate capitalize">{evt?.name}</h4>
                  <div className="text-gray-dark text-xs mb-2 truncate flex items-center gap-2">
                    <span>{evt?.eventType === "physical" ? icons.location : icons.globe}</span>
                    <p className="truncate">{evt?.linkOrLocation}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-6 py-10 flex justify-center">
            <div className="w-full max-w-[360px] text-center">
              <span
                className={classNames(
                  "flex items-center justify-center text-primary text-2xl",
                  "size-14 mx-auto rounded-full bg-onPrimaryContainer"
                )}
              >
                {icons.file}
              </span>
              <h3 className="font-bold text-primary mb-1 text-lg mt-2">No Event Available</h3>
              <p className=" text-sm text-gray-600 mb-6">There is currently no event happening today</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsCalender;
