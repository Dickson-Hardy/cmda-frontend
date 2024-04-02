import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import icons from "~/assets/js/icons";

const ProfileTabAbout = () => {
  const user = useSelector((state) => state.auth.user);

  const INFO = useMemo(() => {
    return {
      Phone: user?.phone,
      Email: user?.email,
      "Date of Birth": user?.gender,
    };
  }, [user]);

  const handleSocialClick = (item) => {
    alert("Visiting " + item);
  };

  return (
    <div className="p-4 pt-0 flex gap-10">
      <div className="w-2/3">
        <p className="text-sm font-medium">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque alias molestias, ducimus excepturi natus
          incidunt doloremque modi debitis autem, aspernatur aperiam a rem? Nemo ratione neque consequuntur. Ratione,
          obcaecati repellendus?
        </p>

        <div className="my-8">
          <h3 className="text-base font-bold mb-2">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(INFO).map(([key, value]) => (
              <div key={key}>
                <h5 className="text-gray-dark font-semibold mb-0.5 text-sm">{key}</h5>
                <p>{value || "---"}</p>
              </div>
            ))}
            <div>
              <h5 className="text-gray-dark font-semibold mb-1 text-sm">Social Links</h5>
              <div className="flex flex-wrap gap-2">
                {["facebook", "twitter", "linkedIn", "instagram"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="bg-gray-light rounded-full text-xl h-10 w-10 inline-flex justify-center items-center hover:text-primary"
                    onClick={() => handleSocialClick(item)}
                  >
                    {icons[item]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold mb-2">Security</h3>
          <Link
            to="/update-password"
            className="text-sm inline-flex gap-2 items-center hover:underline text-primary font-medium"
          >
            <span>{icons.logout}</span>
            Change Password
          </Link>
        </div>
      </div>

      <div className="w-1/3 bg-white border px-6 py-4 rounded-xl">
        <h3 className="text-base font-bold mb-2">Community Statitics</h3>
        <ul className="space-y-4 capitalize">
          <li className="flex items-center gap-4">
            <span className="h-14 w-14 rounded-xl inline-flex items-center justify-center bg-black/10 text-black text-2xl">
              {icons.calendar}
            </span>
            <div>
              <span className="font-bold text-lg">0</span>
              <p className="text-xs text-gray-dark">Total events attended</p>
            </div>
          </li>
          <li className="flex items-center gap-4">
            <span className="h-14 w-14 rounded-xl inline-flex items-center justify-center bg-onPrimary text-primary text-2xl">
              {icons.person}
            </span>
            <div>
              <span className="font-bold text-lg">0</span>
              <p className="text-xs text-gray-dark">Total trainings attended</p>
            </div>
          </li>
          <li className="flex items-center gap-4">
            <span className="h-14 w-14 rounded-xl inline-flex items-center justify-center bg-onSecondary text-secondary text-2xl">
              {icons.verified}
            </span>
            <div>
              <span className="font-bold text-lg">0</span>
              <p className="text-xs text-gray-dark">CME points awarded</p>
            </div>
          </li>
          <li className="flex items-center gap-4">
            <span className="h-14 w-14 rounded-xl inline-flex items-center justify-center bg-onTertiary text-tertiary text-2xl">
              {icons.file}
            </span>
            <div>
              <span className="font-bold text-lg">0</span>
              <p className="text-xs text-gray-dark">Total times volunteered</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileTabAbout;
