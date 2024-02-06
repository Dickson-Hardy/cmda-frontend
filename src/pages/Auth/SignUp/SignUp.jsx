import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DoctorForm from "~/components/SignUpComponents/DoctorForm";
import GetStarted from "~/components/SignUpComponents/GetStarted";
import StudentForm from "~/components/SignUpComponents/StudentForm";
import GlobalForm from "~/components/SignUpComponents/GlobalForm";

const SignUp = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState("getStarted");

  useEffect(() => {
    if (location.pathname === "/signup" && new URLSearchParams(location.search).get("type") == undefined) {
      setCurrentPage("getStarted");
    } else if (location.pathname === "/signup" && new URLSearchParams(location.search).get("type") == "student") {
      setCurrentPage("student");
    } else if (location.pathname === "/signup" && new URLSearchParams(location.search).get("type") == "doctor") {
      setCurrentPage("doctor");
    } else if (location.pathname === "/signup" && new URLSearchParams(location.search).get("type") == "global member") {
      setCurrentPage("global");
    } else {
      return;
    }
  }, [location.pathname, location.search]);

  const allPages = {
    global: GlobalForm,
    student: StudentForm,
    doctor: DoctorForm,
    getStarted: GetStarted,
  };

  // the active page base on the value of the search param
  const ActivePage = allPages[currentPage];

  return (
    <div>
      <ActivePage />
    </div>
  );
};

export default SignUp;
