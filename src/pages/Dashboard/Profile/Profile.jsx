import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Tabs from "~/components/Global/Tabs/Tabs";
import ProfileTabAbout from "~/components/DashboardComponents/ProfileTabContents/About";
import ProfileTabManageSubscriptions from "~/components/DashboardComponents/ProfileTabContents/ManageSubscriptions";
import ProfileTabNotificationSettings from "~/components/DashboardComponents/ProfileTabContents/NotificationSettings";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardProfilePage = () => {
  const navigate = useNavigate();

  const profileTabs = [
    { label: "About", content: <ProfileTabAbout /> },
    { label: "Manage subscriptions", content: <ProfileTabManageSubscriptions /> },
    { label: "Notification settings", content: <ProfileTabNotificationSettings /> },
  ];

  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <section className="flex items-center gap-6">
        <div className="inline-flex gap-6 items-center flex-1">
          <span className="h-28 w-28 bg-onPrimary rounded-full inline-flex items-center justify-center text-6xl text-primary">
            {icons.person}
          </span>
          <div>
            <h4 className="text-xl font-bold flex items-center gap-3">
              {user ? user.firstName + " " + user?.middleName + " " + user?.lastName : "No Name"}{" "}
              <span className="text-secondary">{icons.verified}</span>
            </h4>
            <p className="text-sm font-semibold my-1 capitalize">CMDA10001 // {user?.role}</p>
            <span className="text-primary text-sm">{user?.region || "--"}</span>
          </div>
        </div>
        <Button label="Edit profile" variant="outlined" onClick={() => navigate("/edit-profile")} />
        <Button label="Transit" color="secondary" />
      </section>

      <section className="bg-white rounded-2xl mt-6">
        <Tabs tabs={profileTabs} equalTab={false} />
      </section>
    </div>
  );
};

export default DashboardProfilePage;
