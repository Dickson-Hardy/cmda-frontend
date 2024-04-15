import { useForm } from "react-hook-form";
import Switch from "../../Global/FormElements/Switch/Switch";
import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";

const ProfileTabNotificationSettings = () => {
  const { control } = useForm({ mode: "all" });

  return (
    <div>
      <div className="p-4 pt-0 flex flex-col md:flex-row gap-10">
        <div>
          <h3 className="text-base font-bold">Notifications Settings</h3>
          <p className="text-sm">Select how you will be notified when the following changes occur</p>
        </div>
        <div>
          <form className="space-y-4 text-sm">
            <li className="flex justify-between items-center gap-4">
              Someone sends a message
              <Switch control={control} label="newMessage" showStatusText={false} showTitleLabel={false} />
            </li>
            <li className="flex justify-between gap-4">
              Someone replies a message
              <Switch control={control} label="replies" showStatusText={false} showTitleLabel={false} />
            </li>
            <li className="flex justify-between gap-4">
              Announcements
              <Switch control={control} label="announcements" showStatusText={false} showTitleLabel={false} />
            </li>
          </form>
        </div>
      </div>

      <div className="p-4 mt-6 pb-8">
        <h3 className="text-base font-bold mb-2">Security</h3>
        <Link
          to="/update-password"
          className="text-sm inline-flex gap-2 items-center hover:underline text-primary font-medium"
        >
          <span>{icons.logout}</span>
          Change Password
        </Link>
      </div>
    </div>
  );
};

export default ProfileTabNotificationSettings;
