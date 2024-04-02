import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import ConfirmationModal from "~/components/Global/ConfirmationModal/ConfirmationModal";
import { useGetSingleEventQuery } from "~/redux/api/events/eventsApi";
import { classNames } from "~/utilities/classNames";
import formatDate from "~/utilities/fomartDate";

const DashboardStoreSingleEventPage = () => {
  const { id } = useParams();
  const { data: singleEvent } = useGetSingleEventQuery(id, { refetchOnMountOrArgChange: true, skip: !id });
  const [confirmRegister, setConfirmRegister] = useState(false);

  const handleShare = (social) => alert("Sharing on " + social);

  return (
    <div className="bg-white py-6 px-2 lg:px-6 rounded-3xl">
      <Link to="/events" className="inline-flex gap-2 text-base items-center font-medium text-primary hover:underline">
        {icons.arrowLeft}
      </Link>

      {/* content */}
      <div className="mt-4">
        <img
          src={singleEvent?.eventImageUrl}
          className={classNames("bg-onPrimary h-auto max-h-[300px] md:max-h-[350px] w-full rounded-lg object-cover")}
        />

        <span className="inline-block mt-6 px-4 py-2 capitalize text-tertiary text-sm font-semibold bg-onTertiary rounded-3xl">
          {singleEvent?.eventTag}
        </span>

        <h4 className="text-xl lg:text-2xl font-bold capitalize mt-3">{singleEvent?.title}</h4>

        {singleEvent?.isActive && (
          <div className="flex flex-wrap gap-2 lg:gap-4 items-center justify-start mt-4 mb-8">
            <Button label="Register for free" onClick={() => setConfirmRegister(true)} />
            <Button label="Add to calender" variant="outlined" />
          </div>
        )}

        <div className="mt-6 flex flex-col lg:flex-row lg:justify-between gap-y-5 items-start">
          {/* when and where */}
          <div className="space-y-1">
            <h5 className="font-semibold">When and Where</h5>
            <div className="flex gap-x-2 items-center text-sm">
              <p className="">
                {formatDate(singleEvent?.eventDateTime).date + ", " + formatDate(singleEvent?.eventDateTime).time}
              </p>
              <span className="">{icons.dot}</span>
              <p className="">
                {singleEvent?.eventType === "physical" ? singleEvent?.physicalLocation : singleEvent?.virtualLink}
              </p>
            </div>
          </div>
          {/* share */}
          <div className="space-y-1">
            <h5 className="font-semibold">Share this Event</h5>
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
        </div>

        {/* event details */}
        <div className="space-y-1 mt-8">
          <h5 className="font-semibold">Event Details</h5>
          <div>{singleEvent?.description}</div>
        </div>

        {/* cme points */}
        <div className="mt-8 space-y-1">
          <h5 className="font-semibold">CME Points</h5>
          <p className="text-sm">{singleEvent?.cmePoints || 0} points</p>
        </div>
      </div>

      <ConfirmationModal
        icon={icons.check}
        title="Medical Problems in West Africa And How to Solve them"
        subtitle={formatDate(new Date()).date + ", " + formatDate(new Date()).time}
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
