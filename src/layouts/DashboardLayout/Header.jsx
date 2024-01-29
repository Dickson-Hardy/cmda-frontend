import icons from "~/assets/js/icons";
import Dropdown from "~/components/Dropdown/DropDown";
import Logo from "~/components/Logo/Logo";
import Button from "~/components/Button/Button";

const Header = ({ onToggleSidebar }) => {
  const handleLogout = () => {};

  return (
    <header className="bg-background fixed top-0 inset-x-0 z-[2] gap-4">
      <nav className="h-full w-full max-w-screen-xl mx-auto flex items-center gap-4 py-5">
        {/* Sidebar Toggle Button */}
        <button
          className="text-primary text-2xl focus:outline-none hover:bg-primary-light rounded-md transition-all p-1 lg:hidden"
          onClick={onToggleSidebar}
        >
          {icons.menu}
        </button>
        {/* Logo */}
        <Logo className="w-auto h-14" />

        <div className="flex-1" />
        {/* Notification Icon */}
        <button className="text-primary text-xl focus:outline-none hover:bg-primary-light rounded-md transition-all p-1.5">
          {icons.bell}
        </button>
        {/* Avatar Dropdown */}
        <Dropdown toggleElement={<Button variant="outlined" label="Get Started" />}>
          <ul className="w-56 rounded-2xl text-sm pt-2 pb-2 bg-white shadow-lg border border-gray/20">
            <li className="py-2 px-4 truncate">
              <span className="font-semibold">Person Papa</span>
              <p className="text-xs text-gray">somebody@gmail.com</p>
            </li>
            <li
              className="flex gap-3 items-center cursor-pointer px-5 py-2 border-t hover:bg-primary-light text-gray-dark"
              onClick={() => alert("Account")}
            >
              <span className="text-lg">{icons.settings}</span> Account
            </li>
            <li
              className="flex gap-3 items-center text-gray-dark cursor-pointer border-t px-5 py-2 hover:bg-primary-light"
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
