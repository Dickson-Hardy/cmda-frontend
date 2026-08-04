import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "~/redux/features/auth/authSlice";
import { useGetCommentsQuery, useCreateCommentMutation, useDeleteCommentMutation } from "~/redux/api/commentsReactionsApi";
import { classNames } from "~/utilities/classNames";
import Loading from "~/components/Global/Loading/Loading";

const getRelativeTime = (dateStr) => {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMon = Math.floor(diffDay / 30);
  return `${diffMon}mo ago`;
};

const FaithCommentsSection = ({ entryId }) => {
  const { user } = useSelector(selectAuth);
  const [page, setPage] = useState(1);
  const [commentText, setCommentText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const { data, isLoading, isFetching } = useGetCommentsQuery({
    parentType: "faith_entry",
    parentId: entryId,
    page,
    limit: 20,
  });

  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const comments = data?.items || [];
  const totalPages = data?.meta?.totalPages || 1;

  const handleSubmit = async () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    try {
      await createComment({
        parentType: "faith_entry",
        parentId: entryId,
        content: trimmed,
        isAnonymous,
      }).unwrap();
      setCommentText("");
      setIsAnonymous(false);
    } catch {
      // handled by RTK
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteComment(id).unwrap();
    } catch {
      // handled by RTK
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Write a comment..."
          className="w-full h-9 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary/30"
            />
            Post anonymously
          </label>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isCreating || !commentText.trim()}
            className={classNames(
              "h-8 px-3 rounded-lg text-xs font-medium transition-colors",
              isCreating || !commentText.trim()
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90"
            )}
          >
            {isCreating ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      {isLoading || isFetching ? (
        <div className="flex justify-center py-4">
          <Loading className="text-primary w-6 h-6" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-2.5">
              <img
                src={comment.user?.profilePictureUrl || "/default-avatar.png"}
                alt=""
                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold truncate">
                    {comment.isAnonymous ? "Anonymous" : comment.user?.fullName || "Anonymous"}
                  </span>
                  <span className="text-[10px] text-gray-400">{getRelativeTime(comment.createdAt)}</span>
                </div>
                <p className="text-xs text-gray-700 break-words">{comment.content}</p>
              </div>
              {comment.user?._id === user?._id && (
                <button
                  type="button"
                  onClick={() => handleDelete(comment._id)}
                  className="text-[10px] text-error hover:underline flex-shrink-0"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center py-4">No comments yet. Be the first to comment!</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-2.5 py-1 text-[10px] rounded border border-gray-300 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-[10px] text-gray-500 py-1">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-2.5 py-1 text-[10px] rounded border border-gray-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FaithCommentsSection;
