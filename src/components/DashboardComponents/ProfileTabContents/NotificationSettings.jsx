import { useForm } from "react-hook-form";
import Switch from "../../Global/FormElements/Switch/Switch";

const ProfileTabNotificationSettings = () => {
  const { control } = useForm({ mode: "all" });

  return (
    <div className="p-4 pt-0 flex gap-10">
      <div>
        <h3 className="text-base font-bold">General Notifications</h3>
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
  );
};

export default ProfileTabNotificationSettings;
