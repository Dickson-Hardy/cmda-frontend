import Button from "~/components/Global/Button/Button";
import EventCard from "./EventCard";
import { useEffect, useState } from "react";
import { useGetAllEventsQuery } from "~/redux/api/events/eventsApi";
import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import EventFilterModal from "./EventFilterModal";

const AllEvents = ({ row, isSmallScreen }) => {
  const [allEvents, setAllEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchBy, setSearchBy] = useState();
  const [openFilter, setOpenFilter] = useState(false);

  const { data: events, isLoading } = useGetAllEventsQuery(
    { page, limit: 10, status: "true", searchBy },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (events) {
      setAllEvents((prevEvts) => {
        const combinedEvents = [...prevEvts, ...events.items];
        const uniqueEvents = Array.from(new Set(combinedEvents.map((evt) => evt._id))).map((_id) =>
          combinedEvents.find((evt) => evt._id === _id)
        );
        return uniqueEvents;
      });

      setTotalPages(events.meta?.totalPages);
    }
  }, [events]);

  return (
    <div>
      <div className="flex justify-between item-center mb-4">
        <SearchBar
          onSearch={(v) => {
            // setAllEvents([]);
            setSearchBy(v);
          }}
        />
        <Button
          label="Filter"
          className="ml-auto"
          onClick={() => setOpenFilter(true)}
          icon={icons.filter}
          variant="outlined"
        />
      </div>
      <div className={`flex gap-8  ${row || isSmallScreen ? "flex-col" : "flex-row flex-wrap"}`}>
        {allEvents.map((evt) => (
          <Link key={evt.slug} to={`/dashboard/events/${evt.slug}`}>
            <EventCard
              row={row && !isSmallScreen}
              width={row ? "auto" : isSmallScreen ? "100%" : 330}
              title={evt.name}
              date={evt.eventDateTime}
              image={evt.featuredImageUrl}
              type={evt.eventType}
              location={evt.linkOrLocation}
              description={evt?.description}
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

      <EventFilterModal isOpen={openFilter} onClose={() => setOpenFilter(false)} />
    </div>
  );
};

export default AllEvents;
