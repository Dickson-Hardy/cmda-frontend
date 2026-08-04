import { useEffect, useState } from "react";
import { BiComment } from "react-icons/bi";
import { toast } from "react-toastify";
import icons from "~/assets/js/icons";
import NewFaithEntryModal from "~/components/DashboardComponents/Faith/NewFaithEntryModal";
import FaithCommentsSection from "~/components/DashboardComponents/Faith/FaithCommentsSection";
import ReactionBar from "~/components/DashboardComponents/Events/ReactionBar";
import Button from "~/components/Global/Button/Button";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import {
  useCreateFaithEntryMutation,
  useGetAllFaithEntriesQuery,
} from "~/redux/api/prayerTestimonies/prayerTestimoniesApi";
import { classNames } from "~/utilities/classNames";
import formatDate from "~/utilities/fomartDate";

const DashboardFaithEntryPage = () => {
  const [faithEntries, setFaithEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchBy, setSearchBy] = useState("");
  const { data: faithEntrys, isLoading, refetch } = useGetAllFaithEntriesQuery({ page, limit: 10, searchBy });
  const [openModal, setOpenModal] = useState(false);
  const [createFaithEntry, { isLoading: isCreating }] = useCreateFaithEntryMutation();
  const [expandedComments, setExpandedComments] = useState({});

  const handleCreate = (payload) => {
    createFaithEntry({ ...payload, isAnonymous: payload.isAnonymous || false })
      .unwrap()
      .then(() => {
        setFaithEntries([]);
        refetch();
        toast.success(`Your ${payload.category} has been submitted successfully`);
        setOpenModal(false);
      });
  };

  const toggleComments = (entryId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [entryId]: !prev[entryId],
    }));
  };

  useEffect(() => {
    if (faithEntrys) {
      setFaithEntries((prevVols) => {
        const combinedVols = [...prevVols, ...faithEntrys.items];
        const uniqueVols = Array.from(new Set(combinedVols.map((vol) => vol._id))).map((_id) =>
          combinedVols.find((vol) => vol._id === _id)
        );
        return uniqueVols;
      });

      setTotalPages(faithEntrys.meta?.totalPages);
    }
  }, [faithEntrys]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">Faith Entries</h2>
        <div className="flex gap-2 items-center">
          <Button icon={icons.pencil} label="New" onClick={() => setOpenModal(true)} />
          <SearchBar
            onSearch={(v) => {
              setFaithEntries([]);
              setSearchBy(v);
            }}
            placeholder="Search entries..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {faithEntries?.map((item, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
            <span
              className={classNames(
                `px-3 py-1.5 text-xs font-semibold rounded-3xl`,
                item.category === "Testimony"
                  ? "bg-secondary/20 text-secondary"
                  : item.category === "Comment"
                    ? "bg-primary/20 text-primary"
                    : "bg-tertiary/20 text-tertiary"
              )}
            >
              {item?.category}
            </span>
            <p className="my-4 text-sm font-medium">{item.content}</p>
            <p className="text-gray-600 text-xs">
              Posted by:{" "}
              <span className="text-black font-medium">{!item.isAnonymous ? item.user?.fullName : "Anonymous"}</span>
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Date: <span className="text-black font-medium">{formatDate(item.createdAt).dateTime}</span>
            </p>

            {/* Reaction Bar */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <ReactionBar parentType="faith_entry" parentId={item._id} />
            </div>

            {/* Comments Toggle */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => toggleComments(item._id)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors"
              >
                <BiComment className="text-sm" />
                <span>{expandedComments[item._id] ? "Hide Comments" : "View Comments"}</span>
                {item.commentCount > 0 && (
                  <span className="bg-gray-100 text-gray-600 rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                    {item.commentCount}
                  </span>
                )}
              </button>

              {expandedComments[item._id] && (
                <div className="mt-3">
                  <FaithCommentsSection entryId={item._id} />
                </div>
              )}
            </div>
          </div>
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

      <NewFaithEntryModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        loading={isCreating}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default DashboardFaithEntryPage;
