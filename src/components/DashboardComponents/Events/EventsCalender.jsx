import icons from "~/assets/js/icons";
import { useState } from "react";
import { useGetAllEventsQuery } from "~/redux/api/events/eventsApi";
import { Link } from "react-router-dom";
import formatDate from "~/utilities/fomartDate";
import Loading from "~/components/Global/Loading/Loading";
import Calendar from "~/components/Global/Calendar/Calendar";

const EventsCalender = () => {
  const [date, setDate] = useState(new Date());

  const {
    data: eventsOnThisDay,
    isLoading,
    isFetching,
  } = useGetAllEventsQuery(
    { page: 1, limit: 10, date: date.toISOString().slice(0, 10) },
    { refetchOnMountOrArgChange: true }
  );

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
        ) : (
          <ul className="space-y-3 h-52 overflow-y-auto py-2">
            {eventsOnThisDay?.data.map((evt, i) => (
              <li key={i}>
                <Link to={`/dashboard/events/${evt?._id}`} className="block bg-white border rounded-xl p-4 space-y-2">
                  <h4 className="text-sm font-bold truncate capitalize">{evt?.title}</h4>
                  <div className="text-gray-dark text-xs mb-2 truncate flex items-center gap-2">
                    <span>{evt?.eventType === "physical" ? icons.location : icons.globe}</span>
                    <p className="truncate">
                      {evt?.eventType === "physical" ? evt.physicalLocation : evt.virtualLink} and some others
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EventsCalender;
