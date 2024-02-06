import { classNames } from "~/utilities/classNames";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, onToggleSidebar, navLinks = [] }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-[5] lg:hidden" onClick={onToggleSidebar}></div>}

      {/* Sidebar */}
      <aside
        className={classNames(
          isOpen ? "translate-x-0 animate-slidein" : "-translate-x-full",
          "shadow-md lg:shadow-none lg:border-r",
          "transition-all duration-200 fixed inset-y-0 left-0 w-72 bg-background overflow-y-auto ease-in-out transform z-10 lg:z-[1]"
        )}
      >
        <nav className="h-full w-full flex flex-col gap-6 pt-24">
          {/* Navigation Links */}
          <ul className="flex-1 mt-4 ml-20">
            {navLinks.map((navItem) =>
              navItem.header ? (
                <li
                  key={navItem.header}
                  className="border-t mt-2 uppercase pt-4 pb-2 px-3 text-xs font-semibold text-black"
                >
                  {navItem.header}
                </li>
              ) : (
                <li key={navItem.title}>
                  <NavLink
                    to={navItem.link}
                    className={({ isActive }) =>
                      classNames(
                        "flex items-center gap-2.5 px-4 py-3 cursor-pointer text-sm font-medium",
                        isActive ? "bg-primary text-white" : "bg-transparent text-primary hover:bg-onPrimary"
                      )
                    }
                  >
                    <span className="text-xl">{navItem.icon}</span> {navItem.title}
                  </NavLink>
                </li>
              )
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
