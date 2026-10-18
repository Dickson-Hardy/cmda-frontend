import { usePagedResults } from "~/hooks/usePagedResults";
import QueryFeedback from "~/components/Global/QueryFeedback/QueryFeedback";
import { useState } from "react";
import { Link } from "react-router-dom";
import Volunteer from "~/components/DashboardComponents/Volunteer/Volunteer";
import Button from "~/components/Global/Button/Button";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import { useGetVolunteerJobsQuery } from "~/redux/api/volunteer/volunteerApi";

const DashboardVolunteersPage = () => {
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("");
  const {
    currentData: volunteerJobs,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetVolunteerJobsQuery({ feedbackHandled: true, page, limit: 10, searchBy });

  const { items: volunteerships, totalPages } = usePagedResults(volunteerJobs, page, JSON.stringify([searchBy]));

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">Volunteer Opportunities</h2>
        <SearchBar
          onSearch={(v) => {
            setPage(1);
            setSearchBy(v);
          }}
          placeholder="Search jobs..."
        />
      </div>

      <QueryFeedback
        label="volunteer opportunities"
        loading={isFetching && !volunteerships.length}
        error={isError ? error : null}
        empty={!isFetching && !isError && !volunteerships.length}
        onRetry={refetch}
      />
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6 mt-6">
        {volunteerships?.map((vol, i) => (
          <Link to={`/dashboard/jobs/${vol._id}`} key={i}>
            <Volunteer position={vol?.title} location={vol?.companyLocation} />
          </Link>
        ))}
      </div>
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
    </div>
  );
};

export default DashboardVolunteersPage;
