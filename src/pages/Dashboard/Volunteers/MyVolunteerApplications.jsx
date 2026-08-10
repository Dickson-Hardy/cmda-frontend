import { useState } from "react";
import { Link } from "react-router-dom";
import { BiBriefcase, BiCalendar, BiTime, BiUserCheck } from "react-icons/bi";
import { toast } from "react-toastify";
import Button from "~/components/Global/Button/Button";
import ConfirmationModal from "~/components/Global/ConfirmationModal/ConfirmationModal";
import Loading from "~/components/Global/Loading/Loading";
import StatusChip from "~/components/Global/StatusChip/StatusChip";
import {
  useGetMyApplicationsQuery,
  useGetMyShiftsQuery,
  useWithdrawApplicationMutation,
  useWithdrawFromShiftMutation,
} from "~/redux/api/volunteer/volunteerApi";
import formatDate from "~/utilities/fomartDate";

const MyVolunteerApplications = () => {
  const [tab, setTab] = useState("applications");
  const [confirmAction, setConfirmAction] = useState(null);

  const { data: applicationsData, isLoading: isLoadingApps } = useGetMyApplicationsQuery();
  const { data: shiftsData, isLoading: isLoadingShifts } = useGetMyShiftsQuery();
  const [withdrawApplication, { isLoading: isWithdrawingApp }] = useWithdrawApplicationMutation();
  const [withdrawFromShift, { isLoading: isWithdrawingShift }] = useWithdrawFromShiftMutation();

  const applications = applicationsData?.items || applicationsData || [];
  const shifts = shiftsData?.items || shiftsData || [];

  const handleWithdrawApplication = (id, title) => {
    withdrawApplication({ id })
      .unwrap()
      .then(() => {
        toast.success(`Withdrawn from "${title}" successfully`);
        setConfirmAction(null);
      });
  };

  const handleWithdrawShift = (shiftId, title) => {
    withdrawFromShift({ shiftId })
      .unwrap()
      .then(() => {
        toast.success(`Withdrawn from "${title}" successfully`);
        setConfirmAction(null);
      });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      accepted: "Approved",
      approved: "Approved",
      pending: "Pending",
      rejected: "Declined",
      declined: "Declined",
      withdrawn: "Inactive",
    };
    return statusMap[status?.toLowerCase()] || status;
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6">My Volunteer Activity</h2>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
        <button
          type="button"
          onClick={() => setTab("applications")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === "applications" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          <BiBriefcase className="inline mr-1.5" />
          Applications
          {applications.length > 0 && (
            <span className="ml-1.5 bg-primary/10 text-primary text-xs rounded-full px-1.5 py-0.5">
              {applications.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("shifts")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === "shifts" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          <BiCalendar className="inline mr-1.5" />
          Shifts
          {shifts.length > 0 && (
            <span className="ml-1.5 bg-primary/10 text-primary text-xs rounded-full px-1.5 py-0.5">
              {shifts.length}
            </span>
          )}
        </button>
      </div>

      {tab === "applications" && (
        <div className="bg-white shadow rounded-2xl p-6">
          {isLoadingApps ? (
            <Loading height={32} width={32} className="text-primary mx-auto my-12" />
          ) : applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app) => {
                const job = app.job || app;
                const status = app.status || "pending";
                return (
                  <div
                    key={app._id}
                    className="flex items-center justify-between gap-4 p-4 border border-gray-200 rounded-xl hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="size-12 bg-onPrimary rounded-lg flex-shrink-0 inline-flex items-center justify-center text-xl text-primary">
                        <BiBriefcase />
                      </span>
                      <div className="min-w-0">
                        <Link
                          to={`/dashboard/jobs/${job._id || app.jobId}`}
                          className="font-semibold text-sm hover:text-primary truncate block"
                        >
                          {job.title || app.jobTitle}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">{job.companyName || app.companyName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Applied: {formatDate(app.appliedAt || app.createdAt).date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <StatusChip status={getStatusBadge(status)} />
                      {(status === "pending" || status === "accepted") && (
                        <Button
                          label="Withdraw"
                          small
                          variant="outlined"
                          onClick={() =>
                            setConfirmAction({ type: "application", id: app._id, title: job.title || app.jobTitle })
                          }
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BiBriefcase className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">You haven&apos;t applied to any volunteer jobs yet.</p>
              <Link to="/dashboard/jobs">
                <Button label="Browse Opportunities" small className="mt-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {tab === "shifts" && (
        <div className="bg-white shadow rounded-2xl p-6">
          {isLoadingShifts ? (
            <Loading height={32} width={32} className="text-primary mx-auto my-12" />
          ) : shifts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shifts.map((shift) => (
                <div
                  key={shift._id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-semibold text-sm">{shift.title}</h5>
                      <p className="text-xs text-gray-500 mt-0.5">{shift.jobTitle || shift.job?.title}</p>
                    </div>
                    <StatusChip status={shift.status || "Active"} />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <BiCalendar className="text-sm flex-shrink-0" />
                      <span>{formatDate(shift.date || shift.startDate).date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <BiTime className="text-sm flex-shrink-0" />
                      <span>
                        {formatDate(shift.startDate).time} - {formatDate(shift.endDate).time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <BiUserCheck className="text-sm flex-shrink-0" />
                      <span>Volunteer</span>
                    </div>
                  </div>

                  <Button
                    label="Withdraw"
                    small
                    variant="outlined"
                    onClick={() => setConfirmAction({ type: "shift", id: shift._id, title: shift.title })}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BiCalendar className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">You haven&apos;t signed up for any shifts yet.</p>
              <Link to="/dashboard/jobs">
                <Button label="Browse Jobs" small className="mt-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        icon={confirmAction?.type === "application" ? <BiBriefcase /> : <BiCalendar />}
        title={confirmAction?.type === "application" ? "Withdraw Application" : "Withdraw from Shift"}
        subtitle={`Are you sure you want to withdraw from "${confirmAction?.title}"?`}
        subAction={() => setConfirmAction(null)}
        subActionText="Cancel"
        maxWidth={400}
        mainAction={() => {
          if (confirmAction?.type === "application") {
            handleWithdrawApplication(confirmAction.id, confirmAction.title);
          } else {
            handleWithdrawShift(confirmAction.id, confirmAction.title);
          }
        }}
        mainActionText="Withdraw"
        mainActionLoading={isWithdrawingApp || isWithdrawingShift}
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
      />
    </div>
  );
};

export default MyVolunteerApplications;
