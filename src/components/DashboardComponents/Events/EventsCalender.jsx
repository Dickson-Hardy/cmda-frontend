import icons from "~/assets/js/icons";
import { useState, useMemo } from "react";
import { useGetAllEventsQuery } from "~/redux/api/events/eventsApi";
import { useGetPersonalEventsQuery } from "~/redux/api/personalEventsApi";
import { Link } from "react-router-dom";
import formatDate from "~/utilities/fomartDate";
import Loading from "~/components/Global/Loading/Loading";
import Calendar from "~/components/Global/Calendar/Calendar";
import { classNames } from "~/utilities/classNames";
import PersonalEventsModal from "./PersonalEventsModal";

const EVENT_TYPE_COLORS = {
  Conference: "#E74C3C",
  Webinar: "#3498DB",
  Seminar: "#2ECC71",
  Training: "#F39C12",
};

const DEFAULT_DOT_COLOR = "#9B59B6";

const LEGEND_ITEMS = [
  { label: "Conference", color: "#E74C3C" },
  { label: "Webinar", color: "#3498DB" },
  { label: "Seminar", color: "#2ECC71" },
  { label: "Training", color: "#F39C12" },
  { label: "Other", color: "#9B59B6" },
  { label: "Personal", color: "#6B7280", square: true },
];

const getDotColor = (eventType) => EVENT_TYPE_COLORS[eventType] || DEFAULT_DOT_COLOR;

const EventsCalender = () => {
  const [date, setDate] = useState(new Date());
  const [openPersonalModal, setOpenPersonalModal] = useState(false);

  const {
    data: eventsOnThisDay,
    isLoading,
    isFetching,
  } = useGetAllEventsQuery({
    page: 1,
    limit: 10,
    eventDate: date.toLocaleDateString("en-GB").split("/").reverse().join("-"),
  });

  const monthStart = useMemo(() => {
    const d = new Date(date);
    d.setDate(1);
    return d.toISOString().split("T")[0];
  }, [date]);

  const monthEnd = useMemo(() => {
    const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return d.toISOString().split("T")[0];
  }, [date]);

  const { data: personalEventsData } = useGetPersonalEventsQuery({
    fromDate: monthStart,
    toDate: monthEnd,
  });

  const personalEvents = personalEventsData?.items || personalEventsData || [];

  const getEventsForDay = (day) => {
    const d = new Date(date.getFullYear(), date.getMonth(), day);
    const dateStr = d.toISOString().split("T")[0];
    return personalEvents.filter((pe) => {
      const peDate = new Date(pe.date).toISOString().split("T")[0];
      return peDate === dateStr;
    });
  };

  const renderCalendarDots = (day) => {
    const dayPersonal = getEventsForDay(day);
    const hasPersonal = dayPersonal.length > 0;

    return (
      <div className="flex justify-center gap-0.5 mt-0.5">
        {hasPersonal && (
          <span
            className="w-1.5 h-1.5 inline-block"
            style={{ backgroundColor: "#6B7280" }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="sticky top-0">
      <Calendar
        defaultDate={date}
        onDateSelect={setDate}
        options={{
          renderDayExtra: renderCalendarDots,
        }}
      />

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 px-1">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <span
              className={classNames("w-2.5 h-2.5 inline-block", item.square ? "rounded-sm" : "rounded-full")}
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[10px] text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Create Personal Event Button */}
      <button
        type="button"
        onClick={() => setOpenPersonalModal(true)}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
      >
        <span className="text-lg leading-none">+</span>
        Add Personal Event
      </button>

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
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getDotColor(evt?.eventType) }}
                    />
                    <h4 className="text-sm font-bold truncate capitalize">{evt?.name}</h4>
                  </div>
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

      <PersonalEventsModal
        isOpen={openPersonalModal}
        onClose={() => setOpenPersonalModal(false)}
        selectedDate={date}
      />
    </div>
  );
};

export default EventsCalender;
