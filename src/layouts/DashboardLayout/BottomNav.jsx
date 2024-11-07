import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import icons from "~/assets/js/icons";
import { classNames } from "~/utilities/classNames";

const BottomNav = ({ navLinks, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="block md:hidden fixed bottom-0 left-0 z-20 w-full h-16 bg-primary shadow-lg">
      <nav className="flex h-full w-full font-medium">
        {navLinks.slice(0, 4).map((item) => (
          <button
            key={item.title}
            type="button"
            className={classNames(
              "inline-flex flex-col justify-center items-center gap-1 px-4 truncate transition-all",
              "hover:bg-white hover:text-primary",
              activePath === item.link ? "bg-white text-primary" : "text-white"
            )}
            onClick={() => navigate(item.link)}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs truncate font-semibold">
              {item.title.includes("Payments") ? "Payments" : item.title}
            </span>
          </button>
        ))}
        <button
          type="button"
          className={classNames(
            "inline-flex flex-col justify-center items-center gap-1 px-4 truncate transition-all text-white",
            "hover:bg-white hover:text-primary"
          )}
          onClick={toggleSidebar}
        >
          <span className="text-xl">{icons.menu}</span>
          <span className="text-xs truncate font-semibold">More</span>
        </button>
      </nav>
    </div>
  );
};

export default BottomNav;
