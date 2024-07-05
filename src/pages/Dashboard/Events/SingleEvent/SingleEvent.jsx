import { useState } from "react";
import { useParams } from "react-router-dom";
import icons from "~/assets/js/icons";
import BackButton from "~/components/Global/BackButton/BackButton";
import Button from "~/components/Global/Button/Button";
import ConfirmationModal from "~/components/Global/ConfirmationModal/ConfirmationModal";
import { useGetSingleEventQuery } from "~/redux/api/events/eventsApi";
import { classNames } from "~/utilities/classNames";
import formatDate from "~/utilities/fomartDate";

const DashboardStoreSingleEventPage = () => {
  const { slug } = useParams();
  const { data: singleEvent } = useGetSingleEventQuery(slug);
  const [confirmRegister, setConfirmRegister] = useState(false);

  const handleShare = (social) => alert("Sharing on " + social);

  return (
    <div>
      <BackButton label="Back to Events List" to="/dashboard/events" />

      <section className="bg-white rounded-2xl p-6 shadow w-full mt-6">
        <span className="capitalize bg-onTertiary text-tertiary px-4 py-2 rounded-lg text-xs font-semibold mb-4 inline-block">
          {singleEvent?.eventType}
        </span>

        <h2 className="font-bold mb-4 text-2xl">{singleEvent?.name}</h2>

        <img src={singleEvent?.featuredImageUrl} className="w-full max-h-[500px] mb-6" />

        <p className="text-base">{singleEvent?.description}</p>

        <div className="mt-6">
          <h4 className="text-sm text-gray-600 font-semibold uppercase mb-1">
            Event {singleEvent?.eventType === "Physical" ? "Location" : "Link"}
          </h4>
          <p className="text-base mb-1">{singleEvent?.linkOrLocation}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <h4 className="text-sm text-gray-600 font-semibold uppercase mb-1">Access Code</h4>
            <p className="text-base mb-1">{singleEvent?.accessCode || "N/A"}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-600 font-semibold uppercase mb-1">Event Date &amp; Time</h4>
            <p className="text-base mb-1">{formatDate(singleEvent?.eventDateTime).dateTime}</p>
          </div>
          <div className="col-span-2">
            <h4 className="text-sm text-gray-600 font-semibold uppercase mb-2">Members Group</h4>
            <p className="flex flex-wrap gap-4">
              {singleEvent?.membersGroup?.map((grp) => (
                <span
                  key={grp}
                  className={classNames(
                    "capitalize px-4 py-2 rounded text-xs font-medium",
                    grp === "Student"
                      ? "bg-onPrimaryContainer text-primary"
                      : grp === "Doctor"
                        ? "bg-onSecondaryContainer text-secondary"
                        : "bg-onTertiaryContainer text-tertiary"
                  )}
                >
                  {grp}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm text-gray-600 font-semibold uppercase mb-1">Additional Information</h4>
          <p className="text-base mb-1">{singleEvent?.additionalInformation}</p>
        </div>

        <div className="flex flex-wrap gap-4 my-6">
          {singleEvent?.eventTags?.map((tag) => (
            <span key={tag} className="capitalize bg-gray-light px-4 py-2 rounded text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-1">
          <h4 className="text-sm text-gray-600 font-semibold uppercase mb-1">Share this Event</h4>
          <div className="flex flex-wrap gap-x-5">
            {["facebook", "twitter", "whatsapp", "linkedIn", "instagram"].map((item) => (
              <button
                key={item}
                type="button"
                className="bg-gray-light rounded-full text-xl h-10 w-10 inline-flex justify-center items-center hover:text-primary"
                onClick={() => handleShare(item)}
              >
                {icons[item]}
              </button>
            ))}
          </div>
        </div>

        <div className="my-6">
          <h4 className="text-sm text-gray-600 font-semibold uppercase mb-1">CME Points</h4>
          <p className="text-base mb-1">{singleEvent?.cmePoints || 0}</p>
        </div>

        {singleEvent?.eventDateTime && (
          <div className="flex flex-wrap gap-2 lg:gap-4 justify-end mt-4 mb-4">
            <Button label="Register for free" large onClick={() => setConfirmRegister(true)} />
            <Button label="Add to calender" large variant="outlined" icon={icons.calendar} />
          </div>
        )}
      </section>

      <ConfirmationModal
        icon={icons.calendar}
        title={singleEvent?.name}
        subtitle={singleEvent?.linkOrLocation + " --- " + formatDate(singleEvent?.eventDateTime).dateTime}
        subAction={() => setConfirmRegister(false)}
        subActionText="Cancel"
        maxWidth={400}
        mainAction={() => setConfirmRegister(false)}
        mainActionText="Confirm"
        isOpen={confirmRegister}
        onClose={() => setConfirmRegister(false)}
      />
    </div>
  );
};

export default DashboardStoreSingleEventPage;
