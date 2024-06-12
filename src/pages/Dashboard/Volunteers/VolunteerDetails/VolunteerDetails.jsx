import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import ConfirmationModal from "~/components/Global/ConfirmationModal/ConfirmationModal";
import Loading from "~/components/Global/Loading/Loading";
import { useGetSingleVolunteerJobQuery } from "~/redux/api/volunteer/volunteerApi";
import { classNames } from "~/utilities/classNames";
import formatDate from "~/utilities/fomartDate";

const DashboardVolunteerDetailsPage = () => {
  const { id } = useParams();

  const { data: volunteerJob, isLoading } = useGetSingleVolunteerJobQuery(id, {
    refetchOnMountOrArgChange: true,
    skip: !id,
  });
  const { user } = useSelector((state) => state.auth);
  console.log("ID", volunteerJob);

  const [confirmVolunteer, setConfirmVolunteer] = useState(false);

  const volunteerInfo = useMemo(() => {
    return {
      position: volunteerJob?.position || "---",
      location: volunteerJob?.location || "---",
      "Job Description": volunteerJob?.jobDescription || "---",
      "Date Posted": volunteerJob ? formatDate(volunteerJob.createdAt).date : "--/--/----",
    };
  }, [volunteerJob]);

  return (
    <div>
      <div className="flex justify-start items-center">
        <Link
          to="/dashboard/volunteers"
          className="inline-flex gap-2 text-base items-center font-medium text-primary hover:underline"
        >
          {icons.arrowLeft}
          Back to Volunteer Jobs
        </Link>
      </div>

      <div className="max-w-2xl mx-auto min-h-[calc(100vh-180px)] bg-white rounded-lg p-5 mt-6">
        <div className="flex flex-col md:flex-row justify-center gap-y-3 md:justify-between items-center">
          <p className="text-[#181818] text-2xl font-bold leading-6">Volunteer Details</p>
          <Button
            className="gap-2 font-semibold"
            disabled={volunteerJob?.registeredUsers?.includes(user?._id)}
            onClick={() => setConfirmVolunteer(true)}
          >
            {volunteerJob?.registeredUsers?.includes(user?._id) ? "Already volunteered" : "Volunteer"}
          </Button>
        </div>

        {isLoading ? (
          <Loading height={48} width={48} className="text-primary mx-auto my-40" />
        ) : (
          <div className="space-y-5 mt-10">
            {Object.entries(volunteerInfo).map(([key, value]) => (
              <div key={key}>
                <h5 className="font-bold mb-0.5 text-sm capitalize">{key}</h5>
                <p className={classNames("text-black text-base")}>{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmationModal
        icon={icons.check}
        title="Volunteer for this role?"
        subtitle={volunteerJob?.position?.toUpperCase()}
        subAction={() => setConfirmVolunteer(false)}
        subActionText="Cancel"
        actionsFlex="flex-row"
        maxWidth={400}
        mainAction={() => setConfirmVolunteer(false)}
        mainActionText="Confirm"
        isOpen={confirmVolunteer}
        onClose={() => setConfirmVolunteer(false)}
      />
    </div>
  );
};

export default DashboardVolunteerDetailsPage;
