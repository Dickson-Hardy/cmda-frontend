import { useNavigate } from "react-router-dom";
import icons from "~/assets/js/icons";
import { classNames } from "~/utilities/classNames";

const MemberCard = ({ width = 288, fullName, id, avatar, role, region }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border rounded-xl" style={{ width }}>
      <div
        className={classNames(
          "h-32 overflow-hidden rounded-t-xl",
          role === "student" ? "bg-secondary" : role === "doctor" ? "bg-primary" : "bg-tertiary"
        )}
      />
      {avatar ? (
        <img className="h-32 w-32 bg-white p-1 rounded-full -mt-16 mx-auto" src={avatar} alt="" />
      ) : (
        <div className="text-center -mt-16">
          <span
            className={classNames(
              "inline-flex justify-center items-center text-6xl h-32 w-32 bg-white p-1 rounded-full",
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

      <div className="text-center px-2">
        <h2 className="text-lg font-bold mb-1 truncate">{fullName}</h2>
        <span
          className={classNames(
            "px-2 py-1 capitalize text-xs font-semibold rounded-3xl",
            role === "student"
              ? "bg-onSecondary text-secondary"
              : role === "doctor"
                ? "bg-onPrimary text-primary"
                : "bg-onTertiary text-tertiary"
          )}
        >
          {role}
        </span>
        <p className="text-gray-dark text-sm mt-2 capitalize truncate">{region}</p>
      </div>
      <hr className="mt-6" />
      <div className="flex  bg-gray-50 rounded-b-xl">
        <button
          type="button"
          onClick={() => navigate(`/members/${id}`)}
          className="text-center w-1/2 p-2 text-sm text-primary hover:underline font-semibold"
        >
          View Profile
        </button>
        <div className="border"></div>
        <button
          type="button"
          onClick={() => navigate(`/messaging/${id}`)}
          className="text-center w-1/2 p-2 text-sm text-primary hover:underline font-semibold"
        >
          Message
        </button>
      </div>
    </div>
  );
};

export default MemberCard;
