import Button from "~/components/Global/Button/Button";
import EventCard from "./EventCard";
import { useEffect, useState } from "react";
import { useGetUserConferencesQuery } from "~/redux/api/events/eventsApi";
import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import ConferenceFilterModal from "./ConferenceFilterModal";
import Loading from "~/components/Global/Loading/Loading";

const AllConferences = ({ row, isSmallScreen }) => {
  const [allConferences, setAllConferences] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchBy, setSearchBy] = useState();
  const [openFilter, setOpenFilter] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [conferenceType, setConferenceType] = useState("");
  const [zone, setZone] = useState("");
  const [region, setRegion] = useState("");
  const {
    data: conferences,
    isLoading,
    isFetching,
  } = useGetUserConferencesQuery(
    {
      page,
      limit: 10,
      searchBy,
      fromToday: true,
      eventDate,
      eventType,
      conferenceType,
      zone,
      region,
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (conferences) {
      setAllConferences((prevConfs) => {
        const combinedConferences = [...prevConfs, ...conferences.items];
        const uniqueConferences = Array.from(new Set(combinedConferences.map((conf) => conf._id))).map((_id) =>
          combinedConferences.find((conf) => conf._id === _id)
        );
        return uniqueConferences;
      });

      setTotalPages(conferences.meta?.totalPages);
    }
  }, [conferences]);

  return (
    <div>
      <div className="flex justify-between gap-4 items-end mb-4">
        <SearchBar
          onSearch={(v) => {
            setAllConferences([]);
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
        ) : allConferences?.length ? (
          allConferences.map((conf) => (
            <Link key={conf.slug} to={`/dashboard/events/${conf.slug}`}>
              <EventCard
                row={row && !isSmallScreen}
                width={row ? "auto" : isSmallScreen ? "100%" : 330}
                title={conf.name}
                date={conf.eventDateTime}
                image={conf.featuredImageUrl}
                type={conf.eventType}
                location={conf.linkOrLocation}
                description={conf?.description}
                conference={{
                  type: conf.conferenceConfig?.type,
                  zone: conf.conferenceConfig?.zone,
                  region: conf.conferenceConfig?.region,
                }}
              />
            </Link>
          ))
        ) : (
          <div className="px-6 py-10 flex justify-center">
            <div className="w-full max-w-[360px] text-center">
              <h3 className="font-bold text-primary mb-1 text-lg mt-2">No Data Available</h3>
              <p className=" text-sm text-gray-600 mb-6">There are currently no matching conferences to display</p>
            </div>
          </div>
        )}
      </div>
      {allConferences?.length ? (
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

      <ConferenceFilterModal
        isOpen={openFilter}
        onClose={() => setOpenFilter(false)}
        onSubmit={({ eventDate, eventType, conferenceType, zone, region }) => {
          setAllConferences([]);
          setEventDate(eventDate);
          setEventType(eventType);
          setConferenceType(conferenceType);
          setZone(zone);
          setRegion(region);
          setOpenFilter(false);
        }}
      />
    </div>
  );
};

export default AllConferences;
