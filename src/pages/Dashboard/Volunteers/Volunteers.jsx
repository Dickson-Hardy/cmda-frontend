import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";
import Volunteer from "~/components/DashboardComponents/Volunteer/Volunteer";

const DashboardVolunteersPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center text-black">
        <h3 className="font-bold leading-10 text-2xl  md:text-4xl">Volunteer Positions</h3>
        <Link to="/">
          <span>{icons.close}</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 place-items-center gap-x-5 gap-y-3 mt-6">
        {[...Array(7)].map((_, i) => (
          <Volunteer key={i} />
        ))}
      </div>
    </div>
  );
};

export default DashboardVolunteersPage;
