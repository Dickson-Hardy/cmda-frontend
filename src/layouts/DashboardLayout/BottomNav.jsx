import { useLocation, useNavigate } from "react-router-dom";
import icons from "~/assets/js/icons";
import { classNames } from "~/utilities/classNames";

/**
 * Map nav item titles to tutorial data attributes
 * Used for mobile tutorial targeting (Requirements 7.2)
 */
const getTutorialAttribute = (title) => {
  const titleMap = {
    Home: "bottomnav-home",
    Events: "bottomnav-events",
    Resources: "bottomnav-resources",
    "Manage Payments": "bottomnav-payments",
  };
  return titleMap[title] || null;
};

const BottomNav = ({ navLinks, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="block md:hidden fixed bottom-0 left-0 z-20 w-full h-16 bg-primary shadow-lg">
      <nav className="flex h-full w-full items-stretch font-medium" aria-label="Dashboard navigation">
        {navLinks.slice(0, 4).map((item) => {
          const tutorialAttr = getTutorialAttribute(item.title);
          const isActive =
            location.pathname === item.link ||
            (item.link !== "/dashboard" && location.pathname.startsWith(`${item.link}/`));

          return (
            <button
              key={item.title}
              type="button"
              className={classNames(
                "inline-flex min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-1 px-1 transition-all",
                "hover:bg-white hover:text-primary",
                isActive ? "bg-white text-primary" : "text-white"
              )}
              onClick={() => navigate(item.link)}
              aria-current={isActive ? "page" : undefined}
              {...(tutorialAttr && { "data-tutorial": tutorialAttr })}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="block w-full truncate text-center text-[11px] font-semibold leading-tight sm:text-xs">
                {item.title.includes("Payments") ? "Payments" : item.title}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          className={classNames(
            "inline-flex min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-1 px-1 text-white transition-all",
            "hover:bg-white hover:text-primary"
          )}
          onClick={toggleSidebar}
          data-tutorial="bottomnav-more"
        >
          <span className="text-xl leading-none">{icons.menu}</span>
          <span className="block w-full truncate text-center text-[11px] font-semibold leading-tight sm:text-xs">
            More
          </span>
        </button>
      </nav>
    </div>
  );
};

export default BottomNav;
