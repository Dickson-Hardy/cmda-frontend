import { usePagedResults } from "~/hooks/usePagedResults";
import QueryFeedback from "~/components/Global/QueryFeedback/QueryFeedback";
import { useState } from "react";
import { useSelector } from "react-redux";
import icons from "~/assets/js/icons";
import MemberCard from "~/components/DashboardComponents/Members/MemberCard";
import MembersFilterModal from "~/components/DashboardComponents/Members/MembersFilterModal";
import Button from "~/components/Global/Button/Button";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import { useGetAllUsersQuery } from "~/redux/api/user/userApi";

const DashboardMembersPage = () => {
  const { user } = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [role, setRole] = useState(null);
  const [region, setRegion] = useState(null);
  const {
    currentData: allUsers,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllUsersQuery(
    { feedbackHandled: true, limit: 12, page, searchBy, role, region },
    { refetchOnMountOrArgChange: true }
  );

  const { items: members, totalPages } = usePagedResults(allUsers, page, JSON.stringify([searchBy, role, region]));

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 md:gap-6 md:items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">Connect with Members</h2>
        <div className="flex flex-row-reverse md:flex-row items-end gap-2 md:ml-auto">
          <Button label="Filter" onClick={() => setOpenFilter(true)} icon={icons.filter} variant="outlined" />
          <SearchBar
            onSearch={(v) => {
              setPage(1);
              setSearchBy(v);
            }}
          />
        </div>
      </div>

      <section className="mt-8">
        <QueryFeedback
          label="members"
          loading={isFetching && !members.length}
          error={isError ? error : null}
          empty={!isFetching && !isError && !members.length}
          onRetry={refetch}
        />
        {members?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-8 gap-x-3 md:gap-8">
            {members
              ?.filter((x) => x._id !== user?._id)
              .map((mem) => (
                <MemberCard
                  key={mem.membershipId}
                  memId={mem.membershipId}
                  id={mem._id}
                  width="auto"
                  fullName={mem.fullName}
                  avatar={mem.avatarUrl}
                  role={mem.role}
                  region={mem.region}
                />
              ))}
          </div>
        ) : null}

        {members?.length ? (
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
        ) : (
          []
        )}
      </section>

      {/*  */}
      <MembersFilterModal
        isOpen={openFilter}
        onClose={() => setOpenFilter(false)}
        onSubmit={({ role, region }) => {
          setPage(1);
          setRole(role);
          setRegion(region);
          setOpenFilter(false);
        }}
      />
    </div>
  );
};

export default DashboardMembersPage;
