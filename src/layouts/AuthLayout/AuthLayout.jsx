import Logo from "~/components/Logo/Logo";
import { Outlet, useLocation } from "react-router-dom";
import loginImg from "~/assets/images/auth/login-img.png";
import doctorImg from "~/assets/images/auth/signup-doctor-img.png";
import studentImg from "~/assets/images/auth/signup-student-img.png";
import globalImg from "~/assets/images/auth/signup-global-img.png";
import { useEffect, useState } from "react";
import { classNames } from "~/utilities/classNames";

const AuthLayout = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    if (pathname === "/login") {
      setCurrentPage("login");
    } else if (pathname === "/signup" && new URLSearchParams(location.search).get("type") == undefined) {
      setCurrentPage("getStarted");
    } else if (pathname === "/signup" && new URLSearchParams(location.search).get("type") == "student") {
      setCurrentPage("student");
    } else if (pathname === "/signup" && new URLSearchParams(location.search).get("type") == "doctor") {
      setCurrentPage("doctor");
    } else if (pathname === "/signup" && new URLSearchParams(location.search).get("type") == "global member") {
      setCurrentPage("global");
    } else {
      return;
    }
  }, [pathname, location.search]);

  const allImages = {
    global: globalImg,
    student: studentImg,
    doctor: doctorImg,
    login: loginImg,
  };

  // the active page base on the value of the search param
  const activeImg = allImages[currentPage];

  return (
    <div className="h-screen flex w-full">
      <div
        className={classNames(
          "h-full w-full hidden lg:flex flex-col bg-gradient-to-r from-[#DEFCF3] to-[#F6F6F6] relative",
          currentPage == "getStarted" && "lg:hidden",
          pathname == "/forgot-password" && "lg:hidden"
        )}
      >
        <div className="p-8 relative z-30 ">
          <Logo />
        </div>
        <img src={activeImg} className="w-full h-full object-cover z-10 absolute inset-0" />

        {/* an overlay to make the logo show */}
        <div className="bg-gradient-to-r from-white/30 to-black/10 absolute inset-0 w-full h-full z-20" />
      </div>
      <div className="h-full w-full flex flex-col  items-center p-4 lg:p-8 gap-4 overflow-y-auto">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div
          className={classNames(
            "w-full px-4 md:px-8 py-8 bg-white  rounded-lg  ",
            currentPage == "getStarted" ? "max-w-3xl" : "max-w-md "
          )}
        >
          <Outlet />
        </div>
        <p className="text-gray-dark text-sm">&copy;{new Date().getFullYear()} CMDA Nigeria</p>
      </div>
    </div>
  );
};

export default AuthLayout;
