import { classNames } from "~/utilities/classNames";
import { Link, NavLink } from "react-router-dom";
import icons from "~/assets/js/icons";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "~/redux/features/auth/authSlice";
import { clearTokens } from "~/redux/features/auth/tokenSlice";
import Logo from "~/components/Global/Logo/Logo";

const Sidebar = ({ isOpen, onToggleSidebar, navLinks = [] }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    window.location.href = "/login";
    dispatch(clearTokens());
    dispatch(setUser(null));
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-[5] hidden" onClick={onToggleSidebar}></div>}

      {/* Sidebar */}
      <aside
        className={classNames(
          // isOpen ? "translate-x-0 animate-slidein" : "-translate-x-full",
          "shadow-md md:shadow-none p-4 hidden md:block",
          "transition-all duration-200 fixed inset-y-0 left-0 w-60 bg-primary overflow-y-auto ease-in-out transform z-10 md:z-[1]"
        )}
      >
        <div className="bg-whit">
          <Logo className="w-auto h-10 sm:h-12 hidden md:block" />
        </div>

        <div className="flex items-center gap-2 my-6 mt-2 pt-8">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              className="bg-onPrimary object-cover rounded-full h-14 w-14 flex-shrink-0"
            />
          ) : (
            <span className="h-14 w-14 flex-shrink-0 bg-onPrimary rounded-full inline-flex items-center justify-center text-4xl text-primary">
              {icons.person}
            </span>
          )}
          <div className="truncate">
            <h5 className="font-bold text-base truncate text-white">
              {user ? user.firstName + " " + user?.middleName + " " + user?.lastName : "No Name"}
            </h5>
            <Link to="/profile" className="text-white text-sm hover:underline">
              View Profile
            </Link>
          </div>
        </div>
        {/* Navigation Links */}
        <nav>
          <ul className="flex-1 space-y-4">
            {navLinks.map((navItem) => (
              <li key={navItem.title}>
                <NavLink
                  to={navItem.link}
                  className={({ isActive }) =>
                    classNames(
                      "flex items-center gap-4 px-4 py-3 cursor-pointer text-sm font-semibold rounded-lg transition-all",
                      isActive ? "bg-white text-primary" : "bg-transparent text-white hover:bg-onPrimary/20"
                    )
                  }
                >
                  <span className="text-xl">{navItem.icon}</span> {navItem.title}
                </NavLink>
              </li>
            ))}
            <li
              className={classNames(
                "flex items-center gap-4 px-4 py-3 cursor-pointer text-sm font-semibold rounded-lg transition-all",
                "bg-transparent text-white hover:bg-onPrimary/20"
              )}
              onClick={handleLogout}
            >
              <span className="text-xl">{icons.logout}</span> Logout
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
