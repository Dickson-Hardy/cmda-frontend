import { useState } from "react";
import { BiBriefcase, BiCalendar, BiTime, BiUserCheck } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BackButton from "~/components/Global/BackButton/BackButton";
import Button from "~/components/Global/Button/Button";
import ConfirmationModal from "~/components/Global/ConfirmationModal/ConfirmationModal";
import Loading from "~/components/Global/Loading/Loading";
import StatusChip from "~/components/Global/StatusChip/StatusChip";
import {
  useGetSingleVolunteerJobQuery,
  useVolunteerForJobMutation,
  useGetShiftsForJobQuery,
  useSignUpForShiftMutation,
  useWithdrawFromShiftMutation,
} from "~/redux/api/volunteer/volunteerApi";
import { selectAuth } from "~/redux/features/auth/authSlice";
import formatDate from "~/utilities/fomartDate";

const DashboardVolunteerDetailsPage = () => {
  const { id } = useParams();
  const { data: volunteerJob, isLoading } = useGetSingleVolunteerJobQuery(id);
  const { user } = useSelector(selectAuth);
  const [registerForJob, { isLoading: isRegistering }] = useVolunteerForJobMutation();
  const [confirmRegister, setConfirmRegister] = useState(false);
  const [shiftTab, setShiftTab] = useState("available");

  const { data: shiftsData, isLoading: isLoadingShifts } = useGetShiftsForJobQuery({ jobId: id }, { skip: !id });
  const [signUpForShift, { isLoading: isSigningUp }] = useSignUpForShiftMutation();
  const [withdrawFromShift, { isLoading: isWithdrawing }] = useWithdrawFromShiftMutation();

  const [confirmShiftAction, setConfirmShiftAction] = useState(null);

  const handleRegisterForJob = () => {
    registerForJob({ id })
      .unwrap()
      .then(() => {
        toast.success("Volunteered for job successfully");
        setConfirmRegister(false);
      });
  };

  const handleSignUpForShift = (shiftId, shiftTitle) => {
    signUpForShift({ shiftId })
      .unwrap()
      .then(() => {
        toast.success(`Signed up for "${shiftTitle}" successfully`);
        setConfirmShiftAction(null);
      });
  };

  const handleWithdrawFromShift = (shiftId, shiftTitle) => {
    withdrawFromShift({ shiftId })
      .unwrap()
      .then(() => {
        toast.success(`Withdrawn from "${shiftTitle}" successfully`);
        setConfirmShiftAction(null);
      });
  };

  const allShifts = shiftsData?.items || shiftsData || [];
  const myShifts = allShifts.filter((s) => s.volunteers?.includes(user._id) || s.signedUp);
  const availableShifts = allShifts.filter((s) => !s.volunteers?.includes(user._id) && !s.signedUp);
  const displayShifts = shiftTab === "my" ? myShifts : availableShifts;

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

            {/* Available Shifts Section */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm text-gray-600 font-semibold uppercase">Shifts</h4>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setShiftTab("available")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${shiftTab === "available" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    Available
                  </button>
                  <button
                    type="button"
                    onClick={() => setShiftTab("my")}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${shiftTab === "my" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    My Shifts
                    {myShifts.length > 0 && (
                      <span className="ml-1.5 bg-primary text-white text-[10px] rounded-full w-4 h-4 inline-flex items-center justify-center">
                        {myShifts.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {isLoadingShifts ? (
                <Loading height={32} width={32} className="text-primary mx-auto my-8" />
              ) : displayShifts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayShifts.map((shift) => {
                    const isSignedUp = shift.volunteers?.includes(user._id) || shift.signedUp;
                    const spotsLeft = shift.maxVolunteers
                      ? shift.maxVolunteers - (shift.volunteerCount || shift.volunteers?.length || 0)
                      : null;

                    return (
                      <div key={shift._id} className="border border-gray-200 rounded-xl p-4 hover:border-primary/30 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <h5 className="font-semibold text-sm">{shift.title}</h5>
                          {spotsLeft !== null && (
                            <StatusChip status={spotsLeft > 0 ? "Open" : "Full"} />
                          )}
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <BiCalendar className="text-sm flex-shrink-0" />
                            <span>{formatDate(shift.date || shift.startDate).date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <BiTime className="text-sm flex-shrink-0" />
                            <span>
                              {shift.startTime || formatDate(shift.startDate).time} - {shift.endTime || formatDate(shift.endDate).time}
                            </span>
                          </div>
                          {spotsLeft !== null && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <BiUserCheck className="text-sm flex-shrink-0" />
                              <span>
                                {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} available
                                {shift.maxVolunteers && ` of ${shift.maxVolunteers}`}
                              </span>
                            </div>
                          )}
                        </div>

                        {shiftTab === "available" ? (
                          <Button
                            label="Sign Up"
                            small
                            disabled={spotsLeft === 0 || !volunteerJob?.isActive}
                            onClick={() => setConfirmShiftAction({ type: "signUp", shiftId: shift._id, title: shift.title })}
                          />
                        ) : (
                          <Button
                            label="Withdraw"
                            small
                            variant="outlined"
                            onClick={() => setConfirmShiftAction({ type: "withdraw", shiftId: shift._id, title: shift.title })}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">
                  {shiftTab === "my" ? "You haven't signed up for any shifts yet." : "No shifts available for this job."}
                </p>
              )}
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
              Posted:{" "}
              <span className="text-black font-medium">{formatDate(volunteerJob?.createdAt).dateTime}</span>{" "}
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

      <ConfirmationModal
        icon={confirmShiftAction?.type === "signUp" ? <BiUserCheck /> : <BiCalendar />}
        title={confirmShiftAction?.type === "signUp" ? "Sign Up for Shift" : "Withdraw from Shift"}
        subtitle={confirmShiftAction?.title}
        subAction={() => setConfirmShiftAction(null)}
        subActionText="Cancel"
        maxWidth={400}
        mainAction={() => {
          if (confirmShiftAction?.type === "signUp") {
            handleSignUpForShift(confirmShiftAction.shiftId, confirmShiftAction.title);
          } else {
            handleWithdrawFromShift(confirmShiftAction.shiftId, confirmShiftAction.title);
          }
        }}
        mainActionText={confirmShiftAction?.type === "signUp" ? "Sign Up" : "Withdraw"}
        mainActionLoading={isSigningUp || isWithdrawing}
        isOpen={!!confirmShiftAction}
        onClose={() => setConfirmShiftAction(null)}
      />
    </div>
  );
};

export default DashboardVolunteerDetailsPage;
