import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import useCountry from "~/hooks/useCountry ";
import { useMemo } from "react";
import { useSignUpMutation } from "~/redux/api/auth/authApi";
import { toast } from "react-toastify";
import TextInput from "../../Global/FormElements/TextInput/TextInput";
import PhoneInput from "../../Global/FormElements/phoneInput/PhoneInput";
import { EMAIL_PATTERN } from "~/utilities/regExpValidations";
import Select from "../../Global/FormElements/Select/Select";
import CountryFlags from "../../Global/FormElements/CountryWithFlagsInput/CountyFlags";
import Button from "../../Global/Button/Button";
import { setVerifyEmail } from "~/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";

const GlobalForm = () => {
  const navigate = useNavigate();
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "all" });

  // watching the country field so as to updates the state field
  const selectedCountry = watch("country", "");
  const [signUp, { isLoading }] = useSignUpMutation();
  const dispatch = useDispatch();

  const handleSignUp = (payload) => {
    // removing the rememberMe checkbox from payload cos it is not used
    const {
      email,
      firstName,
      middleName,
      lastName,
      phone,
      password,
      gender,
      licenseNumber,
      specialty,
      country,
      state,
    } = payload;

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
      country,
      region: state,
      role: "global",
    })
      .unwrap()
      .then(() => {
        toast.success("Global account created successfully, Check email for token");
        dispatch(setVerifyEmail(email));
        navigate("/verify-email");
      })
      .catch((error) => console.log("Error ", error));
  };

  //   gender options
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const { getAllStatesByCountryCode } = useCountry();

  const allStates = useMemo(() => {
    return getAllStatesByCountryCode(selectedCountry);
  }, [getAllStatesByCountryCode, selectedCountry]);

  return (
    <div>
      <div className="mb-4 text-center">
        <h2 className="md:text-2xl text-xl font-bold">Create a global member account</h2>
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
          <CountryFlags
            selected={selectedCountry}
            setSelected={(code) =>
              setValue("country", code, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
          />
        </div>

        <div className="w-full">
          <Select
            label="state"
            control={control}
            options={allStates}
            errors={errors}
            required
            placeholder="choose your state"
            disabled={!selectedCountry}
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

        <div className="grid gap-6">
          <Button label="Get Started" loading={isLoading} className="w-full" type="submit" />
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
