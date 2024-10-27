import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { useSignUpMutation } from "~/redux/api/auth/authApi";
import { toast } from "react-toastify";
import TextInput from "../../Global/FormElements/TextInput/TextInput";
import { EMAIL_PATTERN } from "~/utilities/regExpValidations";
import Select from "../../Global/FormElements/Select/Select";
import Button from "../../Global/Button/Button";
import { setVerifyEmail } from "~/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { genderOptions, globalRegionsData } from "~/utilities/reusableVariables";

const GlobalForm = () => {
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
    // removing the rememberMe checkbox from payload cos it is not used
    const { email, firstName, middleName, lastName, phone, password, gender, licenseNumber, specialty, region } =
      payload;

    signUp({
      email,
      firstName,
      middleName,
      lastName,
      phone,
      password,
      gender,
      licenseNumber,
      specialty,
      region,
      role: "GlobalNetwork",
    })
      .unwrap()
      .then(() => {
        toast.success("Global account created successfully, Check email for token");
        dispatch(setVerifyEmail(email));
        navigate("/verify-email");
      });
  };

  return (
    <div>
      <div className="mb-4 text-center">
        <h2 className="md:text-2xl text-xl font-bold">Create a Global Network Member Account</h2>
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
            title="Last name/Surname"
            label="lastName"
            type="text"
            register={register}
            errors={errors}
            required
            placeholder="Enter your last name"
          />
        </div>

        <div>
          <TextInput type="tel" title="Phone number (optional)" label="phone" register={register} errors={errors} />
        </div>
        <div>
          <TextInput
            title="Email Address"
            label="email"
            type="email"
            register={register}
            errors={errors}
            required
            placeholder="Enter email address"
            rules={{
              pattern: { value: EMAIL_PATTERN, message: "Invalid email address" },
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
            options={globalRegionsData}
            errors={errors}
            required
            placeholder="choose your region"
          />
        </div>

        <div>
          <TextInput
            title="License number"
            label="licenseNumber"
            register={register}
            errors={errors}
            required
            placeholder="Enter your license number"
          />
        </div>

        <div>
          <TextInput
            label="specialty"
            type="text"
            register={register}
            errors={errors}
            required
            placeholder="professional Cadre"
          />
        </div>

        <div>
          <Select
            label="yearsOfExperience"
            control={control}
            options={["0 - 5 Years", "5 Years and Above"]}
            errors={errors}
            required
            placeholder="Select..."
          />
        </div>

        <div className="grid gap-6">
          <Button label="Create Account" loading={isLoading} className="w-full" type="submit" />
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

export default GlobalForm;
