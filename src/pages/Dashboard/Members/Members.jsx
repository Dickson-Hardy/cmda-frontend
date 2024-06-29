import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import icons from "~/assets/js/icons";
import MemberCard from "~/components/DashboardComponents/Members/MemberCard";
import MembersFilterModal from "~/components/DashboardComponents/Members/MembersFilterModal";
import Button from "~/components/Global/Button/Button";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import { useGetAllUsersQuery } from "~/redux/api/user/userApi";

const DashboardMembersPage = () => {
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchText, setSearchText] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [openFilter, setOpenFilter] = useState(false);

  const {
    data: allUsers,
    isLoading: loadingUsers,
    isFetching,
  } = useGetAllUsersQuery({ limit: 12, page, searchText }, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (allUsers) {
      setMembers((prevUsers) => {
        const combinedUsers = [...prevUsers, ...allUsers.data];
        // Use Set to remove duplicate objects based on their IDs
        const uniqueUsers = Array.from(new Set(combinedUsers.map((user) => user._id))).map((_id) =>
          combinedUsers.find((cUser) => cUser._id === _id)
        );
        return uniqueUsers;
      });

      setTotalPages(allUsers.pagination?.totalPages);
    }
  }, [allUsers]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <h2 className="text-2xl font-bold text-primary">Connect with Members</h2>
        <Button
          label="Filter"
          className="ml-auto"
          onClick={() => setOpenFilter(true)}
          icon={icons.filter}
          variant="outlined"
        />
        <SearchBar
          onSearch={(v) => {
            setMembers([]);
            setSearchText(v);
          }}
        />
      </div>

      <section className="mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-8 gap-x-3 md:gap-8">
          {members
            ?.filter((x) => x._id !== user?._id)
            .map((mem) => (
              <MemberCard
                key={mem._id}
                id={mem._id}
                width="auto"
                fullName={mem.firstName + " " + mem?.middleName + " " + mem?.lastName}
                avatar={mem.avatarUrl}
                role={mem.role}
                region={mem.region}
              />
            ))}
        </div>
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
      </section>

      {/*  */}
      <MembersFilterModal isOpen={openFilter} onClose={() => setOpenFilter(false)} />
    </div>
  );
};

export default DashboardMembersPage;
