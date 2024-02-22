import { classNames } from "~/utilities/classNames";
import studentImg from "~/assets/images/auth/student.svg";
import { useState } from "react";
import Button from "../Global/Button/Button";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const GetStarted = () => {
  const [accountType, setAccountType] = useState(""); //to get the selected account type
  let [, setSearchParams] = useSearchParams();

  const getStartedList = [
    { title: "student", bg: "bg-onSecondary", border: "ring ring-secondary" },
    { title: "doctor", bg: "bg-onPrimary", border: "ring ring-primary" },
    { title: "global member", bg: "bg-onTertiary", border: "ring ring-tertiary" },
  ];

  // the continue button adds the selected account type to the url as search params
  const handleSelectedAccount = () => {
    if (accountType) {
      setSearchParams({ type: accountType });
    } else {
      toast.error("Please select an account type");
    }
  };

  return (
    <>
      <div className="mb-9 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Get Started</h2>
        <p className="text-gray-dark mt-2">Select account type to create</p>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center gap-6 cursor-pointer">
        {getStartedList.map(({ title, bg, border }) => (
          <div
            key={title}
            className={classNames(
              "w-full rounded-2xl p-6 flex flex-col items-center justify-center gap-4",
              bg,
              accountType == title && border
            )}
            onClick={() => setAccountType(title)}
          >
            <img src={studentImg} alt="Student Icon" className="size-[3.2rem] object-contain" />
            <p className="text-black font-bold capitalize">I&apos;m a {title}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center mt-12">
        <Button label="Continue" onClick={handleSelectedAccount} />
      </div>
    </>
  );
};

export default GetStarted;
