import Button from "~/components/Global/Button/Button";
import EventCard from "./EventCard";
import { useEffect, useState } from "react";
import { useGetRegisteredEventsQuery } from "~/redux/api/events/eventsApi";
import { Link } from "react-router-dom";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import EventFilterModal from "./EventFilterModal";

const RegisteredEvents = ({ row, isSmallScreen }) => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchBy, setSearchBy] = useState();
  const [openFilter, setOpenFilter] = useState(false);

  const { data: events, isLoading } = useGetRegisteredEventsQuery({ page, limit: 10, searchBy });
  useEffect(() => {
    if (events && events.items && Array.isArray(events.items)) {
      setRegisteredEvents((prevEvts) => {
        const combinedEvents = [...prevEvts, ...events.items];
        const uniqueEvents = Array.from(new Set(combinedEvents.map((evt) => evt._id))).map((_id) =>
          combinedEvents.find((evt) => evt._id === _id)
        );
        return uniqueEvents;
      });

      setTotalPages(events.meta?.totalPages || 0);
    }
  }, [events]);

  return (
    <div>
      <div className="flex justify-between gap-4 items-end mb-4">
        <SearchBar
          placeholder="Search events"
          onSearch={(v) => {
            setRegisteredEvents([]);
            setSearchBy(v);
          }}
        />
      </div>

      <div className={`flex gap-8 ${row || isSmallScreen ? "flex-col" : "flex-row flex-wrap"}`}>
        {registeredEvents && registeredEvents.length > 0 ? (
          registeredEvents.map((evt) => (
            <Link key={evt?.slug || evt?._id} to={`/dashboard/events/${evt?.slug}`}>
              <EventCard
                row={row && !isSmallScreen}
                width={row ? "auto" : isSmallScreen ? "100%" : 330}
                title={evt?.name}
                date={evt?.eventDateTime}
                image={evt?.featuredImageUrl}
                type={evt?.eventType}
                location={evt?.linkOrLocation}
                description={evt?.description}
              />
            </Link>
          ))
        ) : (
          <div className="px-6 py-10 flex justify-center">
            <div className="w-full max-w-[360px] text-center">
              <h3 className="font-bold text-primary mb-1 text-lg mt-2">No Registered Events</h3>
              <p className=" text-sm text-gray-600">You have not registered for an event yet</p>
            </div>
          </div>
        )}
      </div>

      {registeredEvents && registeredEvents.length > 0 ? (
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
      ) : null}

      <EventFilterModal isOpen={openFilter} onClose={() => setOpenFilter(false)} />
    </div>
  );
};

export default RegisteredEvents;
