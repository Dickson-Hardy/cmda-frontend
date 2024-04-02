import Button from "~/components/Global/Button/Button";
import EventCard from "./EventCard";
import { useEffect, useState } from "react";
import { useGetAllEventsQuery } from "~/redux/api/events/eventsApi";
import { Link } from "react-router-dom";

const UpcomingEvents = ({ row, isSmallScreen }) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { data: events, isLoading } = useGetAllEventsQuery(
    { page, limit: 10, status: "true" },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (events) {
      setUpcomingEvents((prevEvts) => {
        const combinedEvents = [...prevEvts, ...events.data];
        const uniqueEvents = Array.from(new Set(combinedEvents.map((evt) => evt._id))).map((_id) =>
          combinedEvents.find((evt) => evt._id === _id)
        );
        return uniqueEvents;
      });

      setTotalPages(events.pagination?.totalPages);
    }
  }, [events]);

  return (
    <div>
      <div className={`flex gap-8  ${row || isSmallScreen ? "flex-col" : "flex-row flex-wrap"}`}>
        {upcomingEvents.map((evt) => (
          <Link key={evt._id} to={`/events/${evt._id}`}>
            <EventCard
              row={row && !isSmallScreen}
              width={row ? "auto" : isSmallScreen ? "100%" : 330}
              title={evt.title}
              date={evt.eventDateTime}
              image={evt.eventImageUrl}
              tag={evt.eventTag}
              location={evt.eventType === "physical" ? evt.physicalLocation : evt.virtualLink}
            />
          </Link>
        ))}
      </div>
      <div className="flex justify-center p-2 mt-6">
        <Button
          large
          disabled={page === totalPages}
          label={page === totalPages ? "The End" : "Load More"}
          className={"md:w-1/3 w-full"}
          loading={isLoading}
          onClick={() => setPage((prev) => prev + 1)}
        />
      </div>
    </div>
  );
};

export default UpcomingEvents;
