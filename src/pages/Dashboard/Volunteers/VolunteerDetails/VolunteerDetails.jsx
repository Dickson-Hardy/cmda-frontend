import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import ConfirmationModal from "~/components/Global/ConfirmationModal/ConfirmationModal";

const DashboardVolunteerDetailsPage = () => {
  const [confirmVolunteer, setConfirmVolunteer] = useState(false);

  const volunteerInfo = useMemo(() => {
    return {
      position: "Head of Doctor",
      location: "Gbagada, Lagos",
      "Job Description":
        "Leads physician team, ensures quality care, and sets departmental direction. Provides strategic direction, oversees performance, and fosters collaboration among doctors to deliver exceptional patient care.",
    };
  }, []);
  return (
    <div>
      <div className="flex justify-start items-center">
        <Link
          to="/volunteers"
          className="inline-flex justify-center p-2 text-base items-center rounded-full bg-[rgba(175,175,175,0.20)] font-medium text-[#181818]"
        >
          {icons.arrowLeft}
        </Link>
      </div>

      <div className="max-w-2xl mx-auto min-h-screen bg-white rounded-lg p-5 mt-6 ">
        <div className="flex flex-col md:flex-row justify-center gap-y-3 md:justify-between items-center">
          <p className="text-[#181818] text-2xl font-bold leading-6">Volunteer Details</p>
          <Button className="gap-2 font-semibold " onClick={() => setConfirmVolunteer(true)}>
            Volunteer
          </Button>
        </div>

        <div className="space-y-5 mt-10">
          {Object.entries(volunteerInfo).map(([key, value]) => (
            <div key={key}>
              <h5 className="font-bold mb-0.5 text-lg capitalize">{key}</h5>
              <p className="text-gray-dark text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <ConfirmationModal
        icon={icons.check}
        title="Volunteer for this role?"
        subtitle="Head of Doctor"
        subAction={() => {}}
        subActionText="Cancel"
        actionsFlex="flex-col-reverse"
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
