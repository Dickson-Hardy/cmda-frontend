import { useState } from "react";
import { BiBriefcase } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BackButton from "~/components/Global/BackButton/BackButton";
import Button from "~/components/Global/Button/Button";
import ConfirmationModal from "~/components/Global/ConfirmationModal/ConfirmationModal";
import Loading from "~/components/Global/Loading/Loading";
import { useGetSingleVolunteerJobQuery, useVolunteerForJobMutation } from "~/redux/api/volunteer/volunteerApi";
import { selectAuth } from "~/redux/features/auth/authSlice";
import formatDate from "~/utilities/fomartDate";

const DashboardVolunteerDetailsPage = () => {
  const { id } = useParams();
  const { data: volunteerJob, isLoading } = useGetSingleVolunteerJobQuery(id);
  const { user } = useSelector(selectAuth);
  const [registerForJob, { isLoading: isRegistering }] = useVolunteerForJobMutation();
  const [confirmRegister, setConfirmRegister] = useState(false);

  const handleRegisterForJob = () => {
    registerForJob({ id })
      .unwrap()
      .then(() => {
        toast.success("Volunteered for job successfully");
        setConfirmRegister(false);
      });
  };

  return (
    <div>
      <BackButton to="/dashboard/jobs" label="Back to Volunteer Jobs" />

      <div className="max-screen-xl mx-auto min-h-[calc(100vh-180px)] bg-white shadow rounded-lg p-5 mt-6">
        {isLoading ? (
          <Loading height={48} width={48} className="text-primary mx-auto my-40" />
        ) : (
          <div>
            <span
              className={`px-2 py-1 text-sm font-semibold rounded-3xl ${volunteerJob?.isActive ? "bg-success/20 text-success" : "bg-error/20 text-error"}`}
            >
              {volunteerJob?.isActive ? "Open" : "Closed"}
            </span>

            <h3 className="font-bold text-lg mt-4 mb-2">{volunteerJob?.title}</h3>
            <p className="text-base mb-2">{volunteerJob?.description}</p>

            <div className="mt-8">
              <h4 className="text-sm text-gray-600 font-semibold uppercase mb-1">Responsibilities</h4>
              {volunteerJob?.responsibilities?.map((x) => (
                <p key={x} className="mb-1 text-base">
                  {x}
                </p>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-sm text-gray-600 font-semibold uppercase mb-1">Requirements</h4>
              {volunteerJob?.requirements?.map((x) => (
                <p key={x} className="mb-1 text-base">
                  {x}
                </p>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-sm text-gray-600 font-semibold uppercase mb-1">How to Apply</h4>
              <p className="text-base mb-1">{volunteerJob?.applicationInstructions}</p>
            </div>

            <div className="mt-8">
              <h4 className="text-sm text-gray-600 font-semibold uppercase mb-1">Closing Date</h4>
              <p className="text-base mb-1">{formatDate(volunteerJob?.closingDate).date}</p>
            </div>

            <div className="flex items-center gap-4 my-6">
              <span className="size-16 bg-onPrimary rounded-xl flex-shrink-0 inline-flex items-center justify-center text-3xl text-primary">
                <BiBriefcase />
              </span>
              <div>
                <h4 className="text-sm font-semibold">{volunteerJob?.companyName}</h4>
                <p className="text-sm font-medium text-gray-600 my-1">{volunteerJob?.companyLocation}</p>
                <p className="text-sm font-medium text-primary">{volunteerJob?.contactEmail}</p>
              </div>
            </div>

            <p className="text-gray text-sm mb-4">
              Posted: <span className="text-black font-medium">{formatDate(volunteerJob?.createdAt).dateTime}</span>{" "}
            </p>

            {new Date(volunteerJob?.closingDate).getTime() > Date.now() && (
              <div className="flex flex-wrap gap-2 lg:gap-4 justify-end mt-4 mb-4">
                <Button
                  label={volunteerJob?.applicants?.includes(user._id) ? "Already Volunteered" : "Volunteer for Job"}
                  large
                  disabled={volunteerJob?.applicants?.includes(user._id)}
                  onClick={() => setConfirmRegister(true)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/*  */}
      <ConfirmationModal
        icon={<BiBriefcase />}
        title={"Volunteer for this Position"}
        subtitle={volunteerJob?.title}
        subAction={() => setConfirmRegister(false)}
        subActionText="Cancel"
        maxWidth={400}
        mainAction={handleRegisterForJob}
        mainActionText="Confirm"
        mainActionLoading={isRegistering}
        isOpen={confirmRegister}
        onClose={() => setConfirmRegister(false)}
      />
    </div>
  );
};

export default DashboardVolunteerDetailsPage;
