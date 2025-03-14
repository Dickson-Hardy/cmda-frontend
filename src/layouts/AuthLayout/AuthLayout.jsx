import Logo from "~/components/Global/Logo/Logo";
import { Outlet, useLocation } from "react-router-dom";
import loginImg from "~/assets/images/auth/login-img.webp";
import doctorImg from "~/assets/images/auth/signup-doctor-img.webp";
import studentImg from "~/assets/images/auth/signup-student-img.webp";
import globalImg from "~/assets/images/auth/signup-global-img.webp";
import { useEffect, useState } from "react";
import { classNames } from "~/utilities/classNames";

const AuthLayout = ({ withOutlet = true, children }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const [currentPage, setCurrentPage] = useState("getStarted");

  useEffect(() => {
    if (pathname === "/signup" && new URLSearchParams(location.search).get("type") == undefined) {
      setCurrentPage("getStarted");
    } else if (pathname === "/signup" && new URLSearchParams(location.search).get("type") == "student") {
      setCurrentPage("student");
    } else if (pathname === "/signup" && new URLSearchParams(location.search).get("type") == "doctor") {
      setCurrentPage("doctor");
    } else if (pathname === "/signup" && new URLSearchParams(location.search).get("type") == "global member") {
      setCurrentPage("global");
    } else {
      setCurrentPage("login");
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
      <div className={classNames("h-full w-full hidden lg:flex flex-col relative")}>
        <div className="p-8 relative z-30 ">
          <Logo />
        </div>
        <img src={activeImg} className="w-full h-full object-cover z-10 absolute inset-0" />

        {/* an overlay to make the logo show */}
        <div className="bg-gradient-to-r from-white/30 to-black/10 absolute inset-0 w-full h-full z-20" />
      </div>
      <div
        className={classNames(
          "h-full w-full flex flex-col items-center p-4 lg:p-8 gap-4 overflow-y-auto",
          (pathname !== "/signup" || currentPage === "getStarted") && "justify-center"
        )}
      >
        <div className={"lg:hidden"}>
          <Logo />
        </div>
        <div
          className={classNames(
            "w-full px-4 md:px-8 py-8 bg-white  rounded-lg",
            pathname === "/signup" && currentPage == "getStarted" ? "max-w-3xl" : "max-w-xl"
          )}
        >
          {withOutlet ? <Outlet /> : children}
        </div>
        <p className="text-gray-500 text-sm">&copy;{new Date().getFullYear()} CMDA Nigeria</p>
      </div>
    </div>
  );
};

export default AuthLayout;
