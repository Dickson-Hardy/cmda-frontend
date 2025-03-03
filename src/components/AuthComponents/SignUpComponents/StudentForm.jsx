import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../Global/Button/Button";
import TextInput from "../../Global/FormElements/TextInput/TextInput";
import { EMAIL_PATTERN } from "~/utilities/regExpValidations";
import Select from "../../Global/FormElements/Select/Select";
import { useSignUpMutation } from "~/redux/api/auth/authApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setVerifyEmail } from "~/redux/features/auth/authSlice";
import {
  admissionYearOptions,
  currentYearOptions,
  genderOptions,
  studentChapterOptions,
} from "~/utilities/reusableVariables";
import { fourteenYrsAgo } from "~/utilities/fomartDate";

const StudentForm = () => {
  const navigate = useNavigate();
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({ mode: "all" });

  const [signUp, { isLoading }] = useSignUpMutation();
  const dispatch = useDispatch();

  const handleSignUp = (payload) => {
    signUp({ ...payload, role: "Student" })
      .unwrap()
      .then(() => {
        toast.success("Student account created successfully, Check email for token");
        dispatch(setVerifyEmail(payload.email));
        navigate("/verify-email");
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
          />
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
