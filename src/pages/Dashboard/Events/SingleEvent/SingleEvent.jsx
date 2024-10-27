import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import icons from "~/assets/js/icons";
import BackButton from "~/components/Global/BackButton/BackButton";
import Button from "~/components/Global/Button/Button";
import ConfirmationModal from "~/components/Global/ConfirmationModal/ConfirmationModal";
import Modal from "~/components/Global/Modal/Modal";
import {
  useConfirmEventPaymentMutation,
  useGetSingleEventQuery,
  usePayForEventMutation,
  useRegisterForEventMutation,
} from "~/redux/api/events/eventsApi";
import { selectAuth } from "~/redux/features/auth/authSlice";
import { classNames } from "~/utilities/classNames";
import formatDate from "~/utilities/fomartDate";
import { formatCurrency } from "~/utilities/formatCurrency";

const DashboardStoreSingleEventPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const paymentSuccess = searchParams.get("payment");
  const reference = searchParams.get("reference");
  const navigate = useNavigate();
  const { data: singleEvent } = useGetSingleEventQuery(slug);
  const [registerForEvent, { isLoading: isRegistering }] = useRegisterForEventMutation();
  const [payForEvent, { isLoading: isPaying }] = usePayForEventMutation();
  const [confirmRegister, setConfirmRegister] = useState(false);
  const { user } = useSelector(selectAuth);
  const [openSuccess, setOpenSuccess] = useState(false);

  const [confirmPayment, { isLoading: isConfirming }] = useConfirmEventPaymentMutation();

  useEffect(() => {
    if (paymentSuccess && reference) {
      setOpenSuccess(true);
      confirmPayment({ reference })
        .unwrap()
        .then(() => {
          toast.success("Event registeration successfully");
        });
    }
  }, [confirmPayment, paymentSuccess, reference]);

  const handleShare = (social) => alert("Sharing on " + social);

  const handleRegisterEvent = () => {
    if (singleEvent?.isPaid) {
      payForEvent({ slug })
        .unwrap()
        .then(({ data }) => {
          window.open(data?.checkout_url, "_self");
        });
    } else {
      registerForEvent({ slug })
        .unwrap()
        .then(() => {
          toast.success("Registered for event successfully");
          setConfirmRegister(false);
        });
    }
  };

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
            <h4 className="text-sm text-gray-600 font-semibold uppercase mb-1">Payment Plans</h4>
            {singleEvent?.isPaid
              ? singleEvent?.paymentPlans.map((x) => (
                  <p className="text-sm mb-2" key={x.role}>
                    {x.role + " - " + formatCurrency(x.price)}
                  </p>
                ))
              : null}
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

        {new Date(singleEvent?.eventDateTime).getTime() > Date.now() && (
          <div className="flex flex-wrap gap-2 lg:gap-4 justify-end mt-4 mb-4">
            <Button
              label={singleEvent?.registeredUsers?.includes(user._id) ? "Already Registered" : "Register for Event"}
              large
              disabled={singleEvent?.registeredUsers?.includes(user._id)}
              onClick={() => setConfirmRegister(true)}
            />
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
        mainAction={handleRegisterEvent}
        mainActionText="Confirm"
        mainActionLoading={isRegistering || isPaying}
        isOpen={confirmRegister}
        onClose={() => setConfirmRegister(false)}
      />

      <Modal isOpen={openSuccess}>
        <div className="flex flex-col gap-4 text-center">
          <span className="text-6xl text-primary mx-auto">{icons.checkAlt}</span>
          <h3 className="text-xl font-bold capitalize">Event Payment Successful</h3>

          <p className="text-base text-gray-600">
            You have successfully paid and registered for this event - {singleEvent?.name?.toUpperCase()}
          </p>
          <Button
            label="Continue"
            large
            loading={isConfirming}
            onClick={() => {
              setOpenSuccess(false);
              navigate(`/dashboard/events/${slug}`);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default DashboardStoreSingleEventPage;
