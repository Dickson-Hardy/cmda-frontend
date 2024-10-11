import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfileImageUpdate from "~/components/DashboardComponents/ProfileTabContents/ProfileImageUpdate";
import Chip from "~/components/Global/Chip/Chip";
import { useEffect, useState } from "react";
import formatDate from "~/utilities/fomartDate";
import ConfirmationModal from "~/components/Global/ConfirmationModal/ConfirmationModal";
import { useInitSubscriptionSessionMutation } from "~/redux/api/payments/subscriptionApi";
import { selectAuth, setUser } from "~/redux/features/auth/authSlice";
import { useGetAllTrainingsQuery } from "~/redux/api/events/eventsApi";
import StatusChip from "~/components/Global/StatusChip/StatusChip";
import Table from "~/components/Global/Table/Table";
import TransitionModal from "~/components/DashboardComponents/Members/TransitionModal";
import {
  useCreateUpdateTransitionMutation,
  useGetProfileQuery,
  useGetTransitionQuery,
} from "~/redux/api/profile/profileApi";
import { toast } from "react-toastify";

const DashboardProfilePage = () => {
  const { user } = useSelector(selectAuth);

  const [openSubscribe, setOpenSubscribe] = useState(false);
  const [openTransit, setOpenTransit] = useState(false);
  const [initSubscription, { isLoading: isSubscribing }] = useInitSubscriptionSessionMutation();
  const { data: allTrainings, isLoading: isLoadingTrainings } = useGetAllTrainingsQuery(
    { membersGroup: user.role },
    { refetchOnMountOrArgChange: true }
  );

  const { data: transitionInfo } = useGetTransitionQuery(null, { refetchOnMountOrArgChange: true });
  const [postTransition, { isLoading: isTransiting }] = useCreateUpdateTransitionMutation();

  const { data: myProfile } = useGetProfileQuery(null, { refetchOnMountOrArgChange: true });
  const dispatch = useDispatch();

  useEffect(() => {
    if (myProfile && myProfile?.email) {
      dispatch(setUser(myProfile));
    }
  }, [myProfile, dispatch]);

  const COLUMNS = [
    { header: "Training Name", accessor: "name" },
    { header: "Status", accessor: "status" },
  ];
  const formattedColumns = COLUMNS.map((col) => ({
    ...col,
    cell: (info) => {
      const [value, item] = [info.getValue(), info.row.original];
      return col.accessor === "name" ? (
        <span className="capitalize">{value}</span>
      ) : col.accessor === "status" ? (
        <StatusChip status={item.completedUsers.includes(user._id) ? "completed" : "pending"} />
      ) : (
        value || "--"
      );
    },
    enableSorting: false,
  }));

  const onSubscribe = () => {
    initSubscription({})
      .unwrap()
      .then((res) => {
        window.open(res.checkout_url, "_self");
      });
  };

  const handleTransit = (payload) => {
    const body = {
      ...payload,
      ...(user.role === "Doctor" ? { specialty: user.specialty, licenseNumber: user.licenseNumber } : {}),
    };
    postTransition(body)
      .unwrap()
      .then(() => {
        toast.success("Transition info updated successfully");
        setOpenTransit(false);
      });
  };

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
        <Button
          icon={icons.checkAlt}
          label={user?.subscribed ? "Subscribed" : "Subscribe Now"}
          color={user?.subscribed ? "secondary" : "primary"}
          disabled={user?.subscribed}
          onClick={() => setOpenSubscribe(true)}
        />
        {["Student", "Doctor"].includes(user?.role) ? (
          <Button
            label={
              transitionInfo
                ? "Transition in Progress"
                : `Transit to ${user.role === "Student" ? "Doctor" : "GlobalNetwork"}`
            }
            onClick={() => setOpenTransit(true)}
          />
        ) : null}
      </div>

      <section className="flex gap-6 flex-col md:flex-row mb-6">
        <div className="w-full md:w-1/2 bg-white rounded-xl p-4 md:px-4 md:py-8 shadow">
          <div className="w-full flex flex-col md:flex-row h-full items-center gap-3 md:gap-6">
            <ProfileImageUpdate />
            <div className="flex flex-col justify-between h-full w-full">
              <h3 className="capitalize font-semibold text-lg mb-4">{user?.fullName || "No Name"}</h3>
              <p className="text-sm font-medium mb-4">
                <span className="text-gray">ID: </span> {user?.membershipId}
              </p>
              <p className="text-sm mb-4 font-medium flex items-center gap-2">
                <span className="text-gray">Type:</span>
                <Chip
                  className="capitalize text-xs !h-7 !rounded-full"
                  color={user?.role === "Student" ? "primary" : user?.role === "Doctor" ? "secondary" : "tertiary"}
                  label={user?.role}
                />
              </p>
              <p className="text-sm font-medium mb-4">
                <span className="text-gray">Chapter/Region: </span> {user?.region}
              </p>
              <p className="text-sm font-medium mb-4">
                <span className="text-gray">Leadership Position: </span> {user?.leadershipPosition || "--"}
              </p>
              <p className="text-sm font-medium mb-4">
                <span className="text-gray">Email: </span> {user?.email}
              </p>
              <p className="text-sm font-medium mb-4">
                <span className="text-gray">Phone: </span> {user?.phone || "---"}
              </p>
              <div className="flex gap-2">
                {user?.socials?.map((item) => (
                  <a
                    key={item.name}
                    href={item.link?.startsWith("http") ? item.link : "https://" + item.link}
                    className="bg-gray-light rounded-full text-lg h-9 w-9 inline-flex justify-center items-center hover:text-primary cursor-pointer"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {icons[item.name]}
                  </a>
                ))}
              </div>
              <div className="flex justify-end text-sm">
                <Link to="/dashboard/edit-profile" className="text-primary font-semibold underline">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-white rounded-xl p-4 flex flex-col md:px-4 md:py-8 shadow">
          <h3 className="mb-2 text-base font-semibold">About Me</h3>
          <p className="text-gray-dark text-sm font-medium mb-4">{user?.bio}</p>
          <p className="text-sm font-medium mb-4">
            <span className="text-gray">Date of Brith: </span>{" "}
            {user?.dateOfBirth ? formatDate(user.dateOfBirth).date : "--/--/----"}
          </p>
          <p className="text-sm font-medium mb-4 capitalize">
            <span className="text-gray">Gender: </span> {user?.gender}
          </p>
          {user.role === "Student" ? (
            <>
              <p className="text-sm font-medium mb-4">
                <span className="text-gray">Admission Year: </span> {user?.admissionYear}
              </p>
              <p className="text-sm font-medium mb-4">
                <span className="text-gray">Current Year: </span> {user?.yearOfStudy}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium mb-4">
                <span className="text-gray">Specialty: </span> {user?.specialty}
              </p>
              <p className="text-sm font-medium mb-4">
                <span className="text-gray">License Number: </span> {user?.licenseNumber}
              </p>
            </>
          )}
          <div className="flex justify-end mt-auto text-sm">
            <Link to="/dashboard/edit-profile" className="text-primary font-semibold underline">
              Edit Profile
            </Link>
          </div>
        </div>
      </section>

      <section className="my-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3 bg-white rounded-2xl shadow pt-2">
          <div className="w-full  px-4 py-4">
            <h3 className="text-base font-bold mb-4">Training Records</h3>
            <Table
              tableData={allTrainings || []}
              tableColumns={formattedColumns}
              loading={isLoadingTrainings}
              showPagination={allTrainings?.length > 10}
            />
          </div>
        </div>

        <div className="w-full md:w-1/3 bg-white shadow px-4 py-4 rounded-xl">
          <h3 className="text-base font-bold mb-2">Community Statistics</h3>
          <ul className="space-y-4 capitalize">
            <li className="flex items-center gap-4">
              <span className="h-14 w-14 rounded-xl inline-flex items-center justify-center bg-black/10 text-black text-2xl">
                {icons.calendar}
              </span>
              <div>
                <span className="font-bold text-lg">0</span>
                <p className="text-xs text-gray-dark">Total events attended</p>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <span className="h-14 w-14 rounded-xl inline-flex items-center justify-center bg-onPrimary text-primary text-2xl">
                {icons.person}
              </span>
              <div>
                <span className="font-bold text-lg">
                  {allTrainings?.filter((x) => x.completedUsers.includes(user._id)).length}
                </span>
                <p className="text-xs text-gray-dark">Total trainings attended</p>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <span className="h-14 w-14 rounded-xl inline-flex items-center justify-center bg-onTertiary text-tertiary text-2xl">
                {icons.file}
              </span>
              <div>
                <span className="font-bold text-lg">0</span>
                <p className="text-xs text-gray-dark">Total times volunteered</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <ConfirmationModal
        isOpen={openSubscribe}
        onClose={() => setOpenSubscribe(false)}
        icon={icons.card}
        title="Pay Annual Subscription"
        subtitle="Would you like to subscribe annually to access premium features and enjoy enhanced benefits?"
        mainActionLoading={isSubscribing}
        mainAction={onSubscribe}
        subAction
      />

      <TransitionModal
        isOpen={openTransit}
        transition={transitionInfo}
        onClose={() => setOpenTransit(false)}
        onSubmit={handleTransit}
        loading={isTransiting}
      />
    </div>
  );
};

export default DashboardProfilePage;
