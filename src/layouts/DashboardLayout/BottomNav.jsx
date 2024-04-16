import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { classNames } from "~/utilities/classNames";

const BottomNav = ({ navLinks }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activePath, setActivePath] = useState();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="block md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-primary shadow-lg">
      <nav className="flex h-full w-full font-medium">
        {navLinks.map((item) => (
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
            <span className="text-xs truncate">{item.title?.split(" ")[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
