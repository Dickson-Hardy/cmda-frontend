import { classNames } from "~/utilities/classNames";
import formatDate from "~/utilities/fomartDate";

const EventCard = ({ width = 288, row }) => {
  return (
    <div
      className={classNames(
        "bg-white border p-4 rounded-2xl flex",
        row ? "flex-row gap-4 items-center" : "flex-col gap-2"
      )}
      style={{ width }}
    >
      <img src="/atmosphere.png" className="bg-onPrimary h-32 w-full rounded-lg" />
      <div>
        <span className="px-2 py-1 text-tertiary text-xs font-semibold bg-onTertiary rounded-3xl">Conference</span>
        <h4 className="text-sm font-bold truncate my-2">Medical Problems in West Africa And How to Solve them</h4>
        <p className="text-gray-dark text-xs">{formatDate(new Date()).date + ", " + formatDate(new Date()).time}</p>
        <p className="text-gray-dark text-xs mt-2 truncate">Gbagada, Lagos</p>
      </div>
    </div>
  );
};

export default EventCard;
