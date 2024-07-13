import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import icons from "~/assets/js/icons";
import Dropdown from "~/components/Global/Dropdown/DropDown";
import Logo from "~/components/Global/Logo/Logo";
import { setUser } from "~/redux/features/auth/authSlice";
import { clearTokens } from "~/redux/features/auth/tokenSlice";
import { classNames } from "~/utilities/classNames";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { cartItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    window.location.href = "/login";
    dispatch(clearTokens());
    dispatch(setUser(null));
  };

  return (
    <header className="bg-white fixed top-0 inset-x-0 z-[2] shadow">
      <nav className="h-full w-full flex items-center gap-2 md:gap-4 p-6 px-3 md:px-6 py-3">
        <Logo className="w-auto h-10 sm:h-12 md:hidde" />

        <div className="flex-1" />
        {/* Shopping Cart */}
        {cartItems.length ? (
          <button
            type="button"
            className="relative inline-flex items-center p-1.5 text-2xl font-medium text-center text-primary rounded-lg hover:bg-onPrimary focus:outline-none"
            onClick={() => navigate("/dashboard/store/cart")}
          >
            {icons.cart}
            <span className="absolute inline-flex items-center justify-center w-6 h-6 text-[10px] font-bold text-white bg-secondary border-2 border-white rounded-full -top-2 -end-2">
              {cartItems.length}
            </span>
          </button>
        ) : null}
        {/* Notification Icon */}
        <button
          type="button"
          className="relative inline-flex items-center p-1.5 text-xl font-medium text-center text-primary rounded-lg hover:bg-onPrimary focus:outline-none"
        >
          {icons.bell}
          {/* <span className="absolute inline-flex items-center justify-center w-6 h-6 text-[10px] font-bold text-white bg-secondary border-2 border-white rounded-full -top-2 -end-2">
            20
          </span> */}
        </button>
        {/* Avatar Dropdown */}
        <Dropdown
          toggleElement={
            <button className="inline-flex items-center gap-2 hover:bg-onPrimary transition rounded-lg">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} className="bg-onPrimary object-cover rounded-full h-10 w-10 flex-shrink-0" />
              ) : (
                <span className="h-10 w-10 flex-shrink-0 bg-onPrimary rounded-full inline-flex items-center justify-center text-3xl text-primary">
                  {icons.person}
                </span>
              )}
              <span className="hidden md:inline-block">{icons.caretDown}</span>
            </button>
          }
        >
          <ul className="w-56 rounded-2xl text-sm pt-2 pb-2 bg-white shadow-lg border border-gray/20">
            <li className="py-2 px-4 truncate">
              <p className="font-semibold truncate">
                {user ? user.firstName + " " + user?.middleName + " " + user?.lastName : "No Name"}
              </p>
              <p className="text-xs text-gray truncate">{user?.email || "----"}</p>
            </li>
            <li>
              <NavLink
                to="/dashboard/profile"
                className={({ isActive }) =>
                  classNames(
                    "flex items-center gap-3 px-5 py-2 cursor-pointer border-t  font-medium transition-all",
                    isActive ? "bg-onPrimary text-primary" : "bg-transparent text-black hover:bg-onPrimary"
                  )
                }
              >
                <span className="text-lg">{icons.person}</span> View profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/settings"
                className={({ isActive }) =>
                  classNames(
                    "flex items-center gap-3 px-5 py-2 cursor-pointer border-t  font-medium transition-all",
                    isActive ? "bg-onPrimary text-primary" : "bg-transparent text-black hover:bg-onPrimary"
                  )
                }
              >
                <span className="text-lg">{icons.settings}</span> Settings
              </NavLink>
            </li>
            <li
              className="flex gap-3 items-center text-black cursor-pointer border-t px-5 py-2 hover:bg-onPrimary transition-all"
              onClick={handleLogout}
            >
              <span className="text-lg">{icons.logout}</span> Logout
            </li>
          </ul>
        </Dropdown>
      </nav>
    </header>
  );
};

export default Header;
