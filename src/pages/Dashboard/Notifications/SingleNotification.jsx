import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import BackButton from "~/components/Global/BackButton/BackButton";
import Loading from "~/components/Global/Loading/Loading";
import { useMarkAsReadMutation } from "~/redux/api/notification/notificationApi";
import formatDate from "~/utilities/fomartDate";

const SingleNotification = () => {
  const { item } = useLocation().state;

  const [markAsRead, { isLoading }] = useMarkAsReadMutation();

  useEffect(() => {
    markAsRead(item._id).unwrap();
  }, [markAsRead, item._id]);

  return (
    <div>
      <BackButton label="Back to Notifications" to="/dashboard/notifications" />

      <section className="flex justify-center mt-8">
        <div className="max-w-screen-md w-full bg-white rounded-2xl shadow p-1 divide-y">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="bg-white px-6 py-8">
              <h4 className="text-xl font-semibold mb-4">New {item.type}</h4>
              <p className="text-base mb-6">{item.content}</p>

              <span className="text-sm">{formatDate(item.createdAt).dateTime}</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SingleNotification;
