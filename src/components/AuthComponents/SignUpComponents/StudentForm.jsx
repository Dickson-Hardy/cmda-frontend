import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../Global/Button/Button";
import TextInput from "../../Global/FormElements/TextInput/TextInput";
import { EMAIL_PATTERN, PASSWORD_PATTERN, PASSWORD_REQUIREMENT_MESSAGE } from "~/utilities/regExpValidations";
import Select from "../../Global/FormElements/Select/Select";
import { useSignUpMutation } from "~/redux/api/auth/authApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setVerifyEmail } from "~/redux/features/auth/authSlice";
import { admissionYearOptions, currentYearOptions, genderOptions } from "~/utilities/reusableVariables";
import { fourteenYrsAgo } from "~/utilities/fomartDate";
import { useEffect } from "react";
import { useChapters } from "~/hooks/useChapters";
import { getApiErrorMessage } from "~/utilities/getApiErrorMessage";

const StudentForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
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
  const { chapters: chapterOptions, isLoading: isLoadingChapters } = useChapters("Student");

  // Get email from URL parameters if present
  useEffect(() => {
    const email = location.state?.email;
    const conferenceSlug = searchParams.get("conference");

    // Pre-fill email field if it's provided in the URL
    if (email) {
      setValue("email", email);
    }

    // Store conference slug in localStorage if present
    if (conferenceSlug) {
      localStorage.setItem("conferenceSlug", conferenceSlug);
    }
  }, [location.state, searchParams, setValue]);
  const handleSignUp = (payload) => {
    const data = { ...payload };
    delete data.confirmPassword;
    signUp({ ...data, role: "Student" })
      .unwrap()
      .then(() => {
        toast.success("Student account created successfully. Check your email for the verification code.");
        dispatch(setVerifyEmail(payload.email));
        navigate("/verify-email");
      })
      .catch((error) => {
        toast.error(getApiErrorMessage(error, "Sign up failed. Please try again."));
      });
  };

  return (
    <div>
      <div className="mb-4 text-center">
        <h2 className="md:text-3xl text-2xl font-bold">Create a Student Account</h2>
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
          <TextInput
            title="Date of Birth"
            label="dateOfBirth"
            register={register}
            errors={errors}
            placeholder="Enter email address"
            type="date"
            max={fourteenYrsAgo}
            required
          />
        </div>

        <div>
          <TextInput type="tel" title="Phone number (optional)" label="phone" register={register} errors={errors} />
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
            rules={{
              pattern: { value: PASSWORD_PATTERN, message: PASSWORD_REQUIREMENT_MESSAGE },
            }}
          />
          {!errors.password ? <p className="mt-1.5 text-xs text-gray-600">{PASSWORD_REQUIREMENT_MESSAGE}.</p> : null}
        </div>

        <div>
          <TextInput
            type="password"
            label="confirmPassword"
            required={true}
            register={register}
            errors={errors}
            placeholder="Set a password"
            title="Confirm Password"
            rules={{
              validate: (value) => value === watch("password") || "Passwords do not match",
            }}
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
            options={chapterOptions}
            errors={errors}
            required
            title="Chapter/Region"
            placeholder={isLoadingChapters ? "Loading chapters..." : "choose your chapter/region"}
            disabled={isLoadingChapters}
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
          <Button large label="Create Account" loading={isLoading} className="w-full" type="submit" />
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
