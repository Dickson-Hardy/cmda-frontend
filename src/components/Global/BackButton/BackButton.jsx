import { BiChevronLeft } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { classNames } from "~/utilities/classNames";

const BackButton = ({ label, to, className }) => {
  const navigate = useNavigate();

  return (
    <button
      className={classNames(
        "inline-flex items-center gap-0.5 text-primary hover:underline text-base font-semibold",
        className
      )}
      type="button"
      onClick={() => navigate(to || -1)}
    >
      <BiChevronLeft size={28} />
      {label || "Back"}
    </button>
  );
};

export default BackButton;
