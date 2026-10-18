import { usePagedResults } from "~/hooks/usePagedResults";
import QueryFeedback from "~/components/Global/QueryFeedback/QueryFeedback";
import Button from "~/components/Global/Button/Button";
import EventCard from "./EventCard";
import { useState } from "react";
import { useGetAllEventsQuery } from "~/redux/api/events/eventsApi";
import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import EventFilterModal from "./EventFilterModal";

const AllEvents = ({ row, isSmallScreen }) => {
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState();
  const [openFilter, setOpenFilter] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [membersGroup, setMembersGroup] = useState("");
  const [eventType, setEventType] = useState("");
  const {
    currentData: events,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllEventsQuery(
    { feedbackHandled: true, page, limit: 10, searchBy, fromToday: true, eventDate, membersGroup, eventType },
    { refetchOnMountOrArgChange: true }
  );

  const { items: allEvents, totalPages } = usePagedResults(
    events,
    page,
    JSON.stringify([searchBy, eventDate, membersGroup, eventType])
  );

  return (
    <div>
      <div className="flex justify-between gap-4 items-end mb-4">
        <SearchBar
          onSearch={(v) => {
            setPage(1);
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
      <QueryFeedback
        label="events"
        loading={isFetching && !allEvents.length}
        error={isError ? error : null}
        empty={!isFetching && !isError && !allEvents.length}
        onRetry={refetch}
      />
      <div className={`flex gap-8  ${row || isSmallScreen ? "flex-col" : "flex-row flex-wrap"}`}>
        {allEvents?.length
          ? allEvents.map((evt) => (
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
          : null}
      </div>
      {allEvents?.length ? (
        <div className="flex justify-center p-2 mt-6">
          <Button
            large
            disabled={page >= totalPages || isError}
            label={page >= totalPages ? "The End" : "Load More"}
            className={"md:w-1/3 w-full"}
            loading={isFetching}
            onClick={() => setPage((prev) => prev + 1)}
          />
        </div>
      ) : null}

      <EventFilterModal
        isOpen={openFilter}
        onClose={() => setOpenFilter(false)}
        onSubmit={({ eventDate, eventType, membersGroup }) => {
          setPage(1);
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
