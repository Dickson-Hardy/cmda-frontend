import { useState } from "react";
import { useGetEventAttendeesQuery } from "~/redux/api/commentsReactionsApi";
import Loading from "~/components/Global/Loading/Loading";
import { classNames } from "~/utilities/classNames";

const EventAttendeesList = ({ eventId }) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetEventAttendeesQuery({
    eventId,
    page,
    limit: 20,
  });

  const attendees = data?.items || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="bg-white rounded-2xl p-6 shadow w-full mt-6">
      <h3 className="text-lg font-bold mb-4">Attendees</h3>

      {isLoading || isFetching ? (
        <div className="flex justify-center py-8">
          <Loading className="text-primary w-8 h-8" />
        </div>
      ) : attendees.length > 0 ? (
        <>
          <div className="space-y-3">
            {attendees.map((attendee) => (
              <div key={attendee._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <img
                  src={
                    attendee.avatarUrl ||
                    attendee.profilePictureUrl ||
                    attendee.user?.avatarUrl ||
                    "/default-avatar.png"
                  }
                  alt={attendee.fullName || "Event attendee"}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {attendee.fullName || attendee.user?.fullName || "Attendee"}
                  </p>
                  {attendee.role && (
                    <span
                      className={classNames(
                        "inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium capitalize",
                        attendee.role === "Student"
                          ? "bg-onSecondaryContainer text-secondary"
                          : attendee.role === "Doctor"
                            ? "bg-onPrimaryContainer text-primary"
                            : "bg-onTertiaryContainer text-tertiary"
                      )}
                    >
                      {attendee.role}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4 pt-4 border-t">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 text-xs rounded border border-gray-300 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500 py-1">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 text-xs rounded border border-gray-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-400 text-center py-6">No attendees yet.</p>
      )}
    </div>
  );
};

export default EventAttendeesList;
