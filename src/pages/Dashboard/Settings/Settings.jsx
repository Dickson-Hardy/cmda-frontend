import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Switch from "~/components/Global/FormElements/Switch/Switch";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "~/redux/api/auth/authApi";

const DashboardSettingsPage = () => {
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();
  const { data: userSettings } = useGetSettingsQuery(null, { refetchOnMountOrArgChange: true });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      newMessage: !!userSettings?.newMessage,
      replies: !!userSettings?.replies,
      announcements: !!userSettings?.announcements || true,
    },
  });

  const handleUpdate = (payload) => {
    updateSettings(payload)
      .unwrap()
      .then(() => toast.success("Changes saved successfully"));
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-primary">Settings</h2>

      <form className="mt-6" onSubmit={handleSubmit(handleUpdate)}>
        <div className="mb-4 flex justify-between gap-4">
          <div>
            <h3 className="text-base font-bold">Notifications Settings</h3>
            <p className="text-sm text-gray">Select how you will be notified when the following changes occur</p>
          </div>
          <Button type="submit" label="Save Changes" loading={isLoading} loadingText="Saving.." />
        </div>
        <div className="space-y-4 text-sm w-1/3">
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
        </div>
      </form>

      <hr className="my-10 border-gray" />

      <div>
        <h3 className="text-base font-bold mb-2">Security</h3>
        <Link
          to="/dashboard/update-password"
          className="text-sm inline-flex gap-2 items-center hover:underline text-primary font-medium"
        >
          <span>{icons.logout}</span>
          Change Password
        </Link>
      </div>
    </div>
  );
};

export default DashboardSettingsPage;
