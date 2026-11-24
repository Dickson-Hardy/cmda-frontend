import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "~/utilities/getApiErrorMessage";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import ConfirmationModal from "~/components/Global/ConfirmationModal/ConfirmationModal";
import Switch from "~/components/Global/FormElements/Switch/Switch";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "~/redux/api/auth/authApi";
import {
  createPushSubscription,
  isPushSupported,
  removeLocalPushSubscription,
} from "~/utilities/pwa";
import {
  useSubscribeToPushMutation,
  useUnsubscribeFromPushMutation,
} from "~/redux/api/notification/notificationApi";

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
  const [subscribeToPush] = useSubscribeToPushMutation();
  const [unsubscribeFromPush] = useUnsubscribeFromPushMutation();
  const { data: userSettings } = useGetSettingsQuery(null, { refetchOnMountOrArgChange: true });

  const { control, handleSubmit, reset } = useForm({
    defaultValues: DEFAULT_SETTINGS,
  });
  const [marketingConfirmOpen, setMarketingConfirmOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null);

  useEffect(() => {
    if (userSettings) reset({ ...DEFAULT_SETTINGS, ...userSettings });
  }, [reset, userSettings]);

  const saveChanges = async (changes) => {
    try {
      if ("pushNotifications" in changes) {
        if (changes.pushNotifications) {
          if (!isPushSupported()) {
            toast.warn("Push notifications are not supported on this device");
          } else {
            try {
              const subscription = await createPushSubscription();
              await subscribeToPush(subscription).unwrap();
              toast.success("This device is now subscribed to push notifications");
            } catch (error) {
              toast.error(
                getApiErrorMessage(
                  error,
                  "Push notifications could not be enabled. Check your browser permissions.",
                ),
              );
              return;
            }
          }
        } else {
          const endpoint = await removeLocalPushSubscription();
          if (endpoint) {
            try {
              await unsubscribeFromPush({ endpoint }).unwrap();
            } catch (error) {
              toast.warn("Removed this device locally, but the server could not be updated");
            }
          }
        }
      }
      if (!Object.keys(changes).length) {
        toast.info("No preferences changed");
        return;
      }
      await updateSettings(changes).unwrap();
      toast.success("Notification preferences saved");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Settings could not be saved. Please try again."));
    }
  };

  const handleUpdate = (payload) => {
    const changes = Object.fromEntries(
      Object.keys(DEFAULT_SETTINGS)
        .filter((key) => payload[key] !== (userSettings?.[key] ?? DEFAULT_SETTINGS[key]))
        .map((key) => [key, payload[key]])
    );
    if (changes.marketing === true) {
      setPendingChanges(changes);
      setMarketingConfirmOpen(true);
      return;
    }
    saveChanges(changes);
  };

  const confirmMarketing = () => {
    setMarketingConfirmOpen(false);
    saveChanges({
      ...pendingChanges,
      marketingConsentConfirmed: true,
      marketingConsentVersion: Number(userSettings?.marketingConsentVersion || 0),
    });
    setPendingChanges(null);
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

      <ConfirmationModal
        isOpen={marketingConfirmOpen}
        onClose={() => {
          setMarketingConfirmOpen(false);
          setPendingChanges(null);
        }}
        icon={icons.mail || icons.announcement || undefined}
        title="Receive optional campaigns?"
        subtitle="Receive optional CMDA campaigns and promotions? You can unsubscribe at any time."
        mainAction={confirmMarketing}
        mainActionText="Yes, subscribe"
        subAction={true}
        subActionText="No, thanks"
      />
    </div>
  );
};

export default DashboardSettingsPage;
