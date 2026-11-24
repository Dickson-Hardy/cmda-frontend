import { useState } from "react";
import { classNames } from "~/utilities/classNames";
import { Link, NavLink, useNavigate } from "react-router-dom";
import icons from "~/assets/js/icons";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationModal from "~/components/Global/ConfirmationModal/ConfirmationModal";
import { setUser } from "~/redux/features/auth/authSlice";
import { clearTokens } from "~/redux/features/auth/tokenSlice";
import Logo from "~/components/Global/Logo/Logo";

/**
 * Map nav item titles to tutorial data attributes
 * Used for tutorial targeting (Requirements 2.2)
 */
const getTutorialAttribute = (title) => {
  const titleMap = {
    Home: "nav-home",
    Events: "nav-events",
    Resources: "nav-resources",
    "Manage Payments": "nav-payments",
    "Connect with Others": "nav-members",
    Volunteer: "nav-volunteer",
    "Faith Entry": "nav-faith",
    Messaging: "nav-messaging",
    Store: "nav-store",
  };
  return titleMap[title] || null;
};

const Sidebar = ({ isOpen, onToggleSidebar, navLinks = [], unreadMessagesCount }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearTokens());
    dispatch(setUser(null));
    setLogoutOpen(false);
    navigate("/login", { replace: true });
  };

  const fullName =
    user?.fullName ||
    (user ? [user.firstName, user?.middleName, user.lastName].filter(Boolean).join(" ") : "No Name");

  return (
    <>
      {/* Overlay for small screens */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onToggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={classNames(
          isOpen ? "translate-x-0" : "-translate-x-full",
          "shadow-md p-4 md:block",
          "pt-safe-header pb-safe-area transition-all duration-200 fixed inset-y-0 left-0 w-60 bg-primary overflow-y-auto ease-in-out transform z-40 md:z-30"
        )}
      >
        <Logo className="w-auto h-12 sm:h-12 mx-auto" />

        <div className="flex items-center gap-2 my-6">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="bg-onPrimary object-cover rounded-full h-14 w-14 flex-shrink-0" />
          ) : (
            <span className="h-14 w-14 flex-shrink-0 bg-onPrimary rounded-full inline-flex items-center justify-center text-4xl text-primary">
              {icons.person}
            </span>
          )}
          <div className="truncate">
            <h5 className="font-bold text-base truncate text-white">{fullName || "No Name"}</h5>
            <Link
              to="/dashboard/profile"
              className="text-white text-sm hover:underline focus-visible:underline"
              onClick={onToggleSidebar}
              data-tutorial="nav-profile"
            >
              View Profile
            </Link>
          </div>
        </div>

        <nav aria-label="Dashboard navigation">
          <ul className="flex-1 space-y-2">
            {navLinks.map((navItem) => {
              const tutorialAttr = getTutorialAttribute(navItem.title);
              return (
                <li key={navItem.title}>
                  <NavLink
                    to={navItem.link}
                    className={({ isActive }) =>
                      classNames(
                        "flex items-center gap-4 px-4 py-2.5 cursor-pointer text-sm font-semibold rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-white/70",
                        isActive ? "bg-white text-primary" : "bg-transparent text-white hover:bg-onPrimary/20"
                      )
                    }
                    end={navItem.link === "/dashboard"}
                    onClick={onToggleSidebar}
                    {...(tutorialAttr && { "data-tutorial": tutorialAttr })}
                  >
                    <span className="text-lg">{navItem.icon}</span> {navItem.title}
                    {navItem.title === "Messaging" && unreadMessagesCount ? (
                      <span className="ml-auto inline-flex items-center justify-center w-6 h-6 text-[10px] font-bold text-white bg-primary border border-white rounded-full">
                        {unreadMessagesCount}
                      </span>
                    ) : null}
                  </NavLink>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                className={classNames(
                  "flex items-center gap-4 px-4 py-2.5 cursor-pointer text-sm font-semibold rounded-lg transition-all w-full text-left focus-visible:ring-2 focus-visible:ring-white/70",
                  "bg-transparent text-white hover:bg-onPrimary/20"
                )}
                onClick={() => setLogoutOpen(true)}
              >
                <span className="text-xl">{icons.logout}</span> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <ConfirmationModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        icon={<span>{icons.logout}</span>}
        title="Log out of CMDA?"
        subtitle="You'll need to sign in again to access your account."
        mainAction={handleLogout}
        mainActionText="Log out"
      />
    </>
  );
};

export default Sidebar;
