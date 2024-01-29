import Logo from "~/components/Logo/Logo";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="h-screen flex w-full">
      <div className="h-full w-full hidden lg:flex flex-col bg-gradient-to-r from-[#DEFCF3] to-[#F6F6F6]">
        <div className="p-8">
          <Logo />
        </div>
        <img src="" className="max-w-lg mx-auto mt-8" />
      </div>
      <div className="h-full w-full flex flex-col justify-center items-center p-4 lg:p-8 gap-4">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div className="max-w-md w-full p-8 bg-white shadow-md rounded-lg border border-gray-light/30">
          <Outlet />
        </div>
        <p className="text-gray-dark text-sm">&copy;{new Date().getFullYear()} CMDA Nigeria</p>
      </div>
    </div>
  );
};

export default AuthLayout;
