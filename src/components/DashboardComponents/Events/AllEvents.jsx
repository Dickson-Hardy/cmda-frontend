import Button from "~/components/Global/Button/Button";
import EventCard from "./EventCard";
import { useEffect, useState } from "react";
import { useGetAllEventsQuery } from "~/redux/api/events/eventsApi";
import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import EventFilterModal from "./EventFilterModal";
import Loading from "~/components/Global/Loading/Loading";
import { classNames } from "~/utilities/classNames";

const AllEvents = ({ row, isSmallScreen }) => {
  const [allEvents, setAllEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchBy, setSearchBy] = useState();
  const [openFilter, setOpenFilter] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [membersGroup, setMembersGroup] = useState("");
  const [eventType, setEventType] = useState("");
  const {
    data: events,
    isLoading,
    isFetching,
  } = useGetAllEventsQuery(
    { page, limit: 10, searchBy, fromToday: true, eventDate, membersGroup, eventType },
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
      <div className="flex justify-between gap-4 items-end mb-4">
        <SearchBar
          onSearch={(v) => {
            setAllEvents([]);
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
        {isLoading || isFetching ? (
          <div className="flex justify-center px-6 py-20">
            <Loading height={64} width={64} className="text-primary" />
          </div>
        ) : allEvents?.length ? (
          allEvents.map((evt) => (
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
          ))
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

              <h3 className="font-bold text-primary mb-1 text-lg mt-2">No Data Available</h3>
              <p className=" text-sm text-gray-600 mb-6">There are currently no matching events to display</p>
            </div>
          </div>
        )}
      </div>
      {allEvents?.length ? (
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

      <EventFilterModal
        isOpen={openFilter}
        onClose={() => setOpenFilter(false)}
        onSubmit={({ eventDate, eventType, membersGroup }) => {
          setAllEvents([]);
          setEventDate(eventDate);
          setEventType(eventType);
          setMembersGroup(membersGroup);
          setOpenFilter(false);
        }}
      />
    </div>
  );
};

export default AllEvents;
