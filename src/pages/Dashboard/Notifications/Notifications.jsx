import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "~/components/Global/Button/Button";
import EmptyData from "~/components/Global/EmptyData/EmptyData";
import { useGetAllNotificationsQuery } from "~/redux/api/notification/notificationApi";
import formatDate from "~/utilities/fomartDate";

const DashboardNotificationsPage = () => {
  const [allNotifications, setAllNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const { data: notificationsData, isLoading } = useGetAllNotificationsQuery({ page, limit: 10 });

  useEffect(() => {
    if (notificationsData) {
      setAllNotifications((prevVols) => {
        const combinedVols = [...prevVols, ...notificationsData.items];
        const uniqueVols = Array.from(new Set(combinedVols.map((vol) => vol._id))).map((_id) =>
          combinedVols.find((vol) => vol._id === _id)
        );
        return uniqueVols;
      });

      setTotalPages(notificationsData.meta?.totalPages);
    }
  }, [notificationsData]);

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6">Notifications</h2>

      <section className="flex justify-center">
        <div className="max-w-screen-md w-full bg-white rounded-2xl shadow p-1 divide-y">
          {allNotifications?.length ? (
            <>
              {allNotifications?.map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/dashboard/notifications/${item._id}`, { state: { item } })}
                >
                  <h4 className={`text-base ${item.read ? "font-medium" : "font-bold"}`}>New {item.type}</h4>
                  <p className={`text-sm ${item.read ? "font-normal" : "font-semibold"}`}>{item.content}</p>
                  <span className="text-xs">{formatDate(item.createdAt).dateTime}</span>
                </div>
              ))}
              <div className="flex justify-center px-4 py-4">
                <Button
                  large
                  disabled={page === totalPages}
                  label={page === totalPages ? "The End" : "Load More"}
                  className={"md:w-1/3 w-full"}
                  loading={isLoading}
                  onClick={() => setPage((prev) => prev + 1)}
                />
              </div>
            </>
          ) : (
            <EmptyData title="Notifications" />
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardNotificationsPage;
