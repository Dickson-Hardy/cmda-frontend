import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "~/components/Global/Button/Button";
import EmptyData from "~/components/Global/EmptyData/EmptyData";
import Loading from "~/components/Global/Loading/Loading";
import {
  useDeleteNotificationMutation,
  useGetAllNotificationsQuery,
  useMarkAllAsReadMutation,
  useRestoreNotificationMutation,
} from "~/redux/api/notification/notificationApi";
import formatDate from "~/utilities/fomartDate";
import { notificationTitle } from "~/utilities/notificationPresentation";

const DashboardNotificationsPage = () => {
  const [allNotifications, setAllNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isError, refetch } = useGetAllNotificationsQuery({ page, limit: 20 });
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [restoreNotification] = useRestoreNotificationMutation();

  useEffect(() => {
    if (!data) return;
    setAllNotifications((previous) => {
      const merged = new Map((page === 1 ? [] : previous).map((item) => [item._id, item]));
      (data.items || []).forEach((item) => merged.set(item._id, item));
      return Array.from(merged.values());
    });
    setTotalPages(data.meta?.totalPages || 0);
  }, [data, page]);

  const visibleNotifications = useMemo(
    () => (filter === "unread" ? allNotifications.filter((item) => !item.read) : allNotifications),
    [allNotifications, filter]
  );
  const hasUnread = allNotifications.some((item) => !item.read);

  const handleMarkAll = async () => {
    try {
      await markAllAsRead().unwrap();
      setAllNotifications((items) => items.map((item) => ({ ...item, read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Notifications could not be updated");
    }
  };

  const handleDelete = async (event, notification) => {
    event.stopPropagation();
    try {
      await deleteNotification(notification._id).unwrap();
      setAllNotifications((items) => items.filter((item) => item._id !== notification._id));
      toast.info(
        <span>
          Notification removed.{" "}
          <button
            className="font-semibold underline"
            onClick={async () => {
              await restoreNotification(notification._id).unwrap();
              setAllNotifications((items) => [notification, ...items]);
            }}
          >
            Undo
          </button>
        </span>,
        { autoClose: 6000 }
      );
    } catch {
      toast.error("Notification could not be removed");
    }
  };

  if (isLoading && !allNotifications.length) return <Loading />;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-primary sm:text-2xl">Notifications</h2>
          <p className="mt-1 text-sm text-gray-600">Important updates and actions from across CMDA.</p>
        </div>
        {hasUnread && <Button label="Mark all read" loading={isMarkingAll} onClick={handleMarkAll} />}
      </div>

      <section className="mx-auto max-w-screen-md">
        <div className="mb-3 flex gap-2" role="tablist" aria-label="Notification filters">
          {[
            { id: "all", label: "All" },
            { id: "unread", label: "Unread" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                filter === item.id ? "bg-primary text-white" : "bg-white text-gray-700 shadow-sm"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow">
          {isError && !allNotifications.length ? (
            <div className="p-8 text-center">
              <p className="mb-4 text-sm text-gray-600">We could not load your notifications.</p>
              <Button label="Try again" onClick={refetch} />
            </div>
          ) : visibleNotifications.length ? (
            <>
              <div className="divide-y">
                {visibleNotifications.map((item) => (
                  <article
                    key={item._id}
                    className={`group flex cursor-pointer gap-3 p-4 transition hover:bg-gray-50 ${!item.read ? "bg-purple-50/60" : ""}`}
                    onClick={() => navigate(`/dashboard/notifications/${item._id}`, { state: { item } })}
                  >
                    <span
                      className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${item.read ? "bg-gray-300" : "bg-primary"}`}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className={`text-base ${item.read ? "font-medium" : "font-bold"}`}>
                        {notificationTitle(item)}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-gray-700">{item.content}</p>
                      <time className="mt-2 block text-xs text-gray-500">{formatDate(item.createdAt).dateTime}</time>
                    </div>
                    <button
                      type="button"
                      className="self-center rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-red-700"
                      onClick={(event) => handleDelete(event, item)}
                      aria-label={`Remove ${notificationTitle(item)}`}
                    >
                      Remove
                    </button>
                  </article>
                ))}
              </div>
              {page < totalPages && (
                <div className="flex justify-center p-4">
                  <Button label="Load more" loading={isFetching} onClick={() => setPage((current) => current + 1)} />
                </div>
              )}
            </>
          ) : (
            <div className="p-8">
              <EmptyData title={filter === "unread" ? "No unread notifications" : "Notifications"} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardNotificationsPage;
