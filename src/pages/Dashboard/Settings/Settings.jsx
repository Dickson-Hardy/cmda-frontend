import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Switch from "~/components/Global/FormElements/Switch/Switch";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "~/redux/api/auth/authApi";

const DEFAULT_SETTINGS = {
  newMessage: false,
  replies: false,
  announcements: true,
  pushNotifications: true,
  emailNotifications: true,
  events: true,
  payments: true,
  reminders: true,
  marketing: false,
};

const DashboardSettingsPage = () => {
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();
  const { data: userSettings } = useGetSettingsQuery(null, { refetchOnMountOrArgChange: true });

  const { control, handleSubmit, reset } = useForm({
    defaultValues: DEFAULT_SETTINGS,
  });

  useEffect(() => {
    if (userSettings) reset({ ...DEFAULT_SETTINGS, ...userSettings });
  }, [reset, userSettings]);

  const handleUpdate = async (payload) => {
    try {
      await updateSettings(payload).unwrap();
      toast.success("Notification preferences saved");
    } catch (error) {
      toast.error(error?.data?.message || "Settings could not be saved");
    }
  };

  const groups = [
    {
      title: "Delivery channels",
      description: "Choose where CMDA can reach you.",
      items: [
        ["pushNotifications", "Mobile push notifications"],
        ["emailNotifications", "Email notifications"],
      ],
    },
    {
      title: "Activity",
      description: "Control updates about conversations and CMDA activity.",
      items: [
        ["newMessage", "New private messages"],
        ["replies", "Replies to your activity"],
        ["announcements", "CMDA announcements"],
        ["events", "Events and registration updates"],
        ["payments", "Payments, orders, donations and membership"],
        ["reminders", "Scheduled reminders"],
        ["marketing", "Optional campaigns and promotions"],
      ],
    },
  ];

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-primary">Settings</h2>

      <form className="mt-6" onSubmit={handleSubmit(handleUpdate)}>
        <div className="mb-6 md:mb-4 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h3 className="text-base font-bold">Notifications Settings</h3>
            <p className="text-sm text-gray">Select how you will be notified when the following changes occur</p>
          </div>
          <div className="flex justify-end">
            <Button type="submit" label="Save Changes" loading={isLoading} loadingText="Saving.." />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {groups.map((group) => (
            <section key={group.title} className="rounded-2xl bg-white p-5 shadow-sm">
              <h4 className="font-bold">{group.title}</h4>
              <p className="mb-4 mt-1 text-sm text-gray-600">{group.description}</p>
              <ul className="space-y-4 text-sm">
                {group.items.map(([key, label]) => (
                  <li key={key} className="flex items-center justify-between gap-4">
                    <span>{label}</span>
                    <Switch control={control} label={key} showStatusText={false} showTitleLabel={false} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
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
