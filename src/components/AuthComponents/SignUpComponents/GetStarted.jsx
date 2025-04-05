import { classNames } from "~/utilities/classNames";
import studentImg from "~/assets/images/auth/student.svg";
import doctorImg from "~/assets/images/auth/doctor.svg";
import globalImg from "~/assets/images/auth/global.svg";
import { useState } from "react";
import Button from "../../Global/Button/Button";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const GetStarted = () => {
  const [accountType, setAccountType] = useState(""); //to get the selected account type
  let [, setSearchParams] = useSearchParams();

  const getStartedList = [
    { title: "student", bg: "bg-onPrimary", border: "ring ring-primary", image: studentImg },
    { title: "doctor", bg: "bg-onSecondary", border: "ring ring-secondary", image: doctorImg },
    { title: "global member", bg: "bg-onTertiary", border: "ring ring-tertiary", image: globalImg },
  ];

  // the continue button adds the selected account type to the url as search params
  const handleSelectedAccount = () => {
    if (accountType) {
      setSearchParams({ type: accountType });
    } else {
      toast.error("Please select an account type");
    }
  };

  const REQUIRES = {
    student: "Admission Year & Student Chapter",
    doctor: "License Number, Specialty & State Chapter",
    "global member": "License Number, Specialty & Region",
  };

  return (
    <>
      <div className="mb-9 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Get Started</h2>
        <p className="text-gray-dark mt-2">Select account type to create</p>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center gap-4 cursor-pointer">
        {getStartedList.map(({ title, bg, border, image }) => (
          <div
            key={title}
            className={classNames(
              "w-full rounded-2xl p-6 flex flex-col items-center justify-center gap-4",
              bg,
              accountType == title && border
            )}
            onClick={() => setAccountType(title)}
          >
            <img src={image} alt="Student Icon" className="size-[3rem] object-contain" />

            <p className="text-black text-sm font-bold capitalize">
              {title === "global member" ? "Global Network Member" : title}
            </p>
            <p className="text-gray-600 text-xs text-center -mt-3">
              <b className="text-error">*</b> Requires {REQUIRES[title]}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center mt-12">
        <Button large label="Continue" onClick={handleSelectedAccount} />
      </div>
    </>
  );
};

export default GetStarted;
