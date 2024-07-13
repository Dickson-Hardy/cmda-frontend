import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Volunteer from "~/components/DashboardComponents/Volunteer/Volunteer";
import Button from "~/components/Global/Button/Button";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import { useGetVolunteerJobsQuery } from "~/redux/api/volunteer/volunteerApi";

const DashboardVolunteersPage = () => {
  const [volunteerships, setVolunteerships] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchBy, setSearchBy] = useState("");
  const { data: volunteerJobs, isLoading } = useGetVolunteerJobsQuery({ page, limit: 10, searchBy });

  useEffect(() => {
    if (volunteerJobs) {
      setVolunteerships((prevVols) => {
        const combinedVols = [...prevVols, ...volunteerJobs.items];
        const uniqueVols = Array.from(new Set(combinedVols.map((vol) => vol._id))).map((_id) =>
          combinedVols.find((vol) => vol._id === _id)
        );
        return uniqueVols;
      });

      setTotalPages(volunteerJobs.meta?.totalPages);
    }
  }, [volunteerJobs]);

  return (
    <div>
      <div className="flex gap-4 justify-between">
        <h2 className="text-2xl font-bold text-primary mb-6">Available Jobs</h2>
        <SearchBar
          onSearch={(v) => {
            setVolunteerships([]);
            setSearchBy(v);
          }}
        />
      </div>

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

export default DashboardVolunteersPage;
