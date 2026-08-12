import icons from "~/assets/js/icons";
import { classNames } from "~/utilities/classNames";

const getPlanLabel = (membershipType) => {
  if (!membershipType || membershipType === "lifetime") return "CMDA Nigeria";
  return `${membershipType.charAt(0).toUpperCase()}${membershipType.slice(1).toLowerCase()} membership`;
};

const LifetimeMemberStatus = ({ membershipType, compact = false, className }) => (
  <div
    className={classNames(
      "inline-flex items-center border border-primary/20 bg-onPrimary text-primary",
      compact ? "gap-1.5 rounded-full px-2.5 py-1" : "gap-3 rounded-xl px-4 py-3",
      className
    )}
    aria-label={`Lifetime member, ${getPlanLabel(membershipType)}`}
  >
    <span
      className={classNames(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-white text-primary",
        compact ? "text-sm" : "h-9 w-9 text-xl"
      )}
    >
      {icons.verified}
    </span>
    <span className="text-left leading-tight">
      <span className={classNames("block font-semibold", compact ? "text-xs" : "text-sm")}>Lifetime membership</span>
      {!compact ? <span className="mt-0.5 block text-xs text-gray-dark">{getPlanLabel(membershipType)}</span> : null}
    </span>
  </div>
);

export default LifetimeMemberStatus;
