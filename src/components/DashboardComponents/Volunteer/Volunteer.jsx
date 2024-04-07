import icons from "~/assets/js/icons";

const Volunteer = ({ position, location }) => {
  return (
    <div className="bg-white border rounded-xl p-4 flex justify-between items-center gap-4 w-full">
      <div>
        <h4 className="text-sm font-bold truncate">{position || "--- ---"}</h4>
        <p className="text-gray-dark text-xs mt-1 truncate">{location || "---, ---"}</p>
      </div>
      <span className="text-base">{icons.chevronRight}</span>
    </div>
  );
};

export default Volunteer;
