import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../Global/Button/Button";
import TextInput from "../../Global/FormElements/TextInput/TextInput";
import { EMAIL_PATTERN } from "~/utilities/regExpValidations";
import Select from "../../Global/FormElements/Select/Select";
import PhoneInput from "../../Global/FormElements/phoneInput/PhoneInput";
import { useSignUpMutation } from "~/redux/api/auth/authApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setVerifyEmail } from "~/redux/features/auth/authSlice";

const StudentForm = () => {
  const navigate = useNavigate();
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm({ mode: "all" });

  const [signUp, { isLoading }] = useSignUpMutation();
  const dispatch = useDispatch();

  const handleSignUp = (payload) => {
    delete payload.numbers;
    delete payload.countryCode;
    //
    signUp({ ...payload, role: "student" })
      .unwrap()
      .then((data) => {
        toast.success("Sign Up successful, Confirm your email to continue");
        // console.log(data);
        toast.success("Student account created successfully, Check email for token");
        dispatch(setVerifyEmail(payload.email));
        navigate("/verify-email");
      })
      .catch((error) => console.log("Error ", error));
  };

  //   gender options
  const genderOptions = ["Male", "Female"].map((y) => ({ label: y, value: y.toLowerCase() }));

  // admission year select option
  const admissionYearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((x) => ({
    label: x,
    value: x,
  }));

  // current year select option
  const currentYearOptions = [
    { value: "1st Year", label: "1st Year" },
    { value: "2nd Year", label: "2nd Year" },
    { value: "3rd Year", label: "3rd Year" },
    { value: "4th Year", label: "4th Year" },
    { value: "5th Year", label: "5th Year" },
    { value: "6th Year", label: "6th Year" },
    { value: "7th Year", label: "7th Year" },
    { value: "8th Year", label: "8th Year" },
  ];

  const studentChapterOptions = [
    "AAU/ISTH",
    "ABUADTH",
    "BUTH",
    "DELSUTH",
    "EKSUTH",
    "IUTH",
    "UITH",
    "LTH",
    "LUTH",
    "UNIMEDTH",
    "LASUTH",
    "UCH",
    "OAUTHc",
    "OOUTH",
    "UBTH",
    "ABSUTH",
    "COOUTH",
    "EBSUTH",
    "ESUTH",
    "GUTH",
    "IMSUTH",
    "UPTH",
    "NAUTH",
    "UCTH",
    "UNTH",
    "UUTH",
    "NDUTH",
    "ABUTH",
    "AKTH",
    "BDTH/KASU",
    "BHUTH",
    "BSUTH",
    "GSUTH",
    "JUTH",
    "UDUTH",
    "UMTH",
    "UATH",
  ].map((x) => ({
    label: x + " Chapter",
    value: x + " Chapter",
  }));

  return (
    <div>
      <div className="mb-4 text-center">
        <h2 className="md:text-3xl text-2xl font-bold">Create a Student account</h2>
      </div>
      <form onSubmit={handleSubmit(handleSignUp)} className="grid grid-cols-1 gap-4">
        <div>
          <TextInput
            title="First name"
            label="firstName"
            type="text"
            register={register}
            errors={errors}
            required
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <TextInput
            title="Middle name (optional)"
            label="middleName"
            type="text"
            register={register}
            errors={errors}
            placeholder="Enter your middle name"
          />
        </div>

        <div>
          <TextInput
            title="Last name"
            label="lastName"
            type="text"
            register={register}
            errors={errors}
            required
            placeholder="Enter your last name"
          />
        </div>

        <div>
          <PhoneInput
            title="Phone number (optional)"
            label="phone"
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        </div>
        <div>
          <TextInput
            title="Email Address"
            label="email"
            register={register}
            errors={errors}
            required
            placeholder="Enter email address"
            rules={{
              pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address" },
            }}
          />
        </div>
        <div>
          <TextInput
            type="password"
            label="password"
            required={true}
            register={register}
            errors={errors}
            placeholder="Set a password"
            title="Create Password"
          />
        </div>

        <div className="w-full">
          <Select
            label="gender"
            control={control}
            options={genderOptions}
            errors={errors}
            required={"Select your gender"}
            placeholder="Male or Female"
          />
        </div>

        <div className="w-full">
          <Select
            label="region"
            control={control}
            options={studentChapterOptions}
            errors={errors}
            required
            title="Chapter/Region"
            placeholder="choose your chapter/region"
          />
        </div>

        <div className="w-full">
          <Select
            label="admissionYear"
            control={control}
            options={admissionYearOptions}
            errors={errors}
            required
            title="Admission Year"
            placeholder="year of admission"
          />
        </div>

        <div className="w-full">
          <Select
            label="yearOfStudy"
            control={control}
            options={currentYearOptions}
            errors={errors}
            required
            title="Current year of study"
            placeholder="Enter current level/year"
          />
        </div>

        <div className="grid gap-6">
          <Button large label="Get Started" loading={isLoading} className="w-full" type="submit" />
          <div className="text-center font-bold text-black ">
            Already have an account?
            <Link to="/login" className="ml-2 text-primary font-medium text-sm hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
