import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import BackButton from "~/components/Global/BackButton/BackButton";
import Loading from "~/components/Global/Loading/Loading";
import { useGetNotificationQuery, useMarkAsReadMutation } from "~/redux/api/notification/notificationApi";
import formatDate from "~/utilities/fomartDate";
import { notificationAction, notificationTitle } from "~/utilities/notificationPresentation";

const SingleNotification = () => {
  const { id } = useParams();
  const stateItem = useLocation().state?.item;
  const { data: fetchedItem, isLoading, isError, refetch } = useGetNotificationQuery(id, { skip: Boolean(stateItem) });
  const item = stateItem || fetchedItem;
  const [markAsRead] = useMarkAsReadMutation();

  useEffect(() => {
    if (item && !item.read)
      markAsRead(item._id)
        .unwrap()
        .catch(() => undefined);
  }, [item, markAsRead]);

  const action = notificationAction(item);

  return (
    <div>
      <BackButton label="Back to Notifications" to="/dashboard/notifications" />
      <section className="mx-auto mt-8 max-w-screen-md">
        <div className="rounded-2xl bg-white px-6 py-8 shadow">
          {isLoading && !item ? (
            <Loading />
          ) : isError && !item ? (
            <div className="text-center">
              <h2 className="text-lg font-semibold">Notification unavailable</h2>
              <p className="my-3 text-sm text-gray-600">It may have been removed or the connection was interrupted.</p>
              <button type="button" className="font-semibold text-primary underline" onClick={refetch}>
                Try again
              </button>
            </div>
          ) : item ? (
            <article>
              <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {notificationTitle(item)}
              </span>
              <h1 className="mt-4 text-2xl font-bold">{notificationTitle(item)}</h1>
              <p className="mt-4 text-base leading-7 text-gray-800">{item.content}</p>
              <time className="mt-6 block text-sm text-gray-500">{formatDate(item.createdAt).dateTime}</time>
              {action && (
                <Link
                  to={action.to}
                  className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 font-semibold text-white hover:opacity-90"
                >
                  {action.label}
                </Link>
              )}
            </article>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default SingleNotification;
