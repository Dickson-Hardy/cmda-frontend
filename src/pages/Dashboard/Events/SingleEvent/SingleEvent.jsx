import { useState } from "react";
import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import ConfirmationModal from "~/components/Global/ConfirmationModal/ConfirmationModal";
import { classNames } from "~/utilities/classNames";
import formatDate from "~/utilities/fomartDate";

const DashboardStoreSingleEventPage = () => {
  const [confirmRegister, setConfirmRegister] = useState(false);
  return (
    <div className="bg-white py-6 px-2 lg:px-6 rounded-3xl">
      <Link to="/events" className="inline-flex gap-2 text-base items-center font-medium text-primary hover:underline">
        {icons.arrowLeft}
      </Link>

      {/* content */}
      <div className="mt-4">
        <img src="/atmosphere.png" className={classNames("bg-onPrimary h-40 lg:h-64 w-full rounded-lg object-cover")} />

        <h4 className="text-xl lg:text-2xl font-bold  mt-4">Medical Problems in West Africa And How to Solve them</h4>

        <div className="flex gap-x-2 lg:gap-x-4 items-center justify-start mt-6">
          <Button label="Register for free" large onClick={() => setConfirmRegister(true)} />
          <Button label="Add to calender" large variant="outlined" />
        </div>

        <div className="mt-6 flex flex-col lg:flex-row lg:justify-between gap-y-5 items-start text-gray-dark font-semibold">
          {/* when and where */}
          <div className="space-y-3">
            <p className="">When and where</p>
            <div className="flex gap-x-2 items-center text-sm">
              <p className="">{formatDate(new Date()).date + ", " + formatDate(new Date()).time}</p>
              <span className="">{icons.dot}</span>
              <p className="">Gbagada, Lagos</p>
            </div>
          </div>
          {/* share */}
          <div className="space-y-3">
            <p>Share this event</p>
            <div className="flex flex-wrap gap-x-5">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="text-2xl inline-flex items-center">
                  {icons.bell}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* event details */}
        <div className="space-y-4 mt-8 text-gray-dark font-semibold">
          <p>Event details</p>

          <ul className="list-disc list-inside space-y-2 pl-2">
            {[...Array(7)].map((_, i) => (
              <li key={i} className="text-sm ">
                Learn about the growing technology
              </li>
            ))}
          </ul>
        </div>

        {/* cme points */}
        <div className="mt-8 space-y-3 font-semibold text-gray-dark">
          <p>CME Points</p>
          <p className="text-sm">250 points</p>
        </div>
      </div>

      <ConfirmationModal
        icon={icons.check}
        title="Medical Problems in West Africa And How to Solve them"
        subtitle={formatDate(new Date()).date + ", " + formatDate(new Date()).time}
        subAction={() => {}}
        subActionText="Cancel"
        actionsFlex="flex-col-reverse"
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
