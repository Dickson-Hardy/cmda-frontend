import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import icons from "~/assets/js/icons";
import MemberCard from "~/components/DashboardComponents/Members/MemberCard";
import MembersFilterModal from "~/components/DashboardComponents/Members/MembersFilterModal";
import Button from "~/components/Global/Button/Button";
import Loading from "~/components/Global/Loading/Loading";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import { useGetAllUsersQuery } from "~/redux/api/user/userApi";
import { classNames } from "~/utilities/classNames";

const DashboardMembersPage = () => {
  const { user } = useSelector((state) => state.auth);

  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchBy, setSearchBy] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [role, setRole] = useState(null);
  const [region, setRegion] = useState(null);
  const {
    data: allUsers,
    isLoading: loadingUsers,
    isFetching,
  } = useGetAllUsersQuery({ limit: 12, page, searchBy, role, region }, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (allUsers) {
      setMembers((prevUsers) => {
        const combinedUsers = [...prevUsers, ...allUsers.items];
        // Use Set to remove duplicate objects based on their IDs
        const uniqueUsers = Array.from(new Set(combinedUsers.map((user) => user._id))).map((_id) =>
          combinedUsers.find((cUser) => cUser._id === _id)
        );
        return uniqueUsers;
      });

      setTotalPages(allUsers.meta?.totalPages);
    }
  }, [allUsers]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 md:gap-6 md:items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">Connect with Members</h2>
        <div className="flex flex-row-reverse md:flex-row items-end gap-2 md:ml-auto">
          <Button label="Filter" onClick={() => setOpenFilter(true)} icon={icons.filter} variant="outlined" />
          <SearchBar
            onSearch={(v) => {
              setMembers([]);
              setSearchBy(v);
            }}
          />
        </div>
      </div>

      <section className="mt-8">
        {loadingUsers || isFetching ? (
          <div className="flex justify-center px-6 py-20">
            <Loading height={64} width={64} className="text-primary" />
          </div>
        ) : members?.length ? (
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
              <p className=" text-sm text-gray-600 mb-6">There are currently no matching member to display</p>
            </div>
          </div>
        )}

        {members?.length ? (
          <div className="flex justify-center p-2 mt-6">
            <Button
              large
              disabled={page === totalPages}
              label={page === totalPages ? "The End" : "Load More"}
              className={"md:w-1/3 w-full"}
              loading={loadingUsers || isFetching}
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
          setMembers([]);
          setRole(role);
          setRegion(region);
          setOpenFilter(false);
        }}
      />
    </div>
  );
};

export default DashboardMembersPage;
