import { useNavigate } from "react-router-dom";
import icons from "~/assets/js/icons";
import { classNames } from "~/utilities/classNames";
import convertToCapitalizedWords from "~/utilities/convertToCapitalizedWords";

const MemberCard = ({ width = 288, fullName, id, avatar, role, region }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border rounded-xl hover:shadow pt-4" style={{ width }}>
      {/* <div
        className={classNames(
          "h-16 overflow-hidden rounded-t-xl",
          role === "student" ? "bg-secondary" : role.includes("global") ? "bg-tertiary" : "bg-primary"
        )}
      /> */}
      {avatar ? (
        <img
          className={classNames(
            "size-20 object-cover p-1 rounded-full -mot-12 mx-auto",
            role === "student" ? "bg-onSecondary" : role.includes("global") ? "bg-onTertiary" : "bg-onPrimary"
          )}
          src={avatar}
          alt=""
        />
      ) : (
        <div className="text-center -omt-12">
          <span
            className={classNames(
              "inline-flex justify-center items-center text-4xl size-20 p-1 rounded-full",
              role === "student"
                ? "bg-onSecondary text-secondary"
                : role === "doctor"
                  ? "bg-onPrimary text-primary"
                  : "bg-onTertiary text-tertiary"
            )}
          >
            {icons.person}
          </span>
        </div>
      )}

      <div className="text-center px-2 mt-2">
        <h2 className="text-sm font-bold mb-1.5 truncate">{fullName}</h2>
        <span
          className={classNames(
            "px-2 py-1 capitalize text-xs font-semibold rounded-3xl",
            role === "student"
              ? "bg-onSecondary text-secondary"
              : role.includes("global")
                ? "bg-onTertiary text-tertiary"
                : "bg-onPrimary text-primary"
          )}
        >
          {role.includes("global") ? "Global Network Member" : convertToCapitalizedWords(role)}
        </span>
        <p className="text-gray-dark text-xs mt-2 capitalize truncate">{region}</p>
      </div>
      <hr className="mt-3" />
      <div className="flex  bg-gray- rounded-b-xl">
        <button
          type="button"
          onClick={() => navigate(`/dashboard/members/${id}`)}
          className="text-center w-1/2 py-2 px-2 text-xs text-primary hover:bg-onPrimary hover:underline font-semibold"
        >
          View Profile
        </button>
        <div className="border"></div>
        <button
          type="button"
          onClick={() => navigate(`/messaging?id=${id}`)}
          className="text-center w-1/2 py-2 px-2 text-xs text-primary hover:bg-onPrimary hover:underline font-semibold"
        >
          Message
        </button>
      </div>
    </div>
  );
};

export default MemberCard;
