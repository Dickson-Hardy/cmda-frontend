import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import TextInput from "../FormElements/TextInput/TextInput";
import { EMAIL_PATTERN } from "~/utilities/regExpValidations";
import Select from "../FormElements/Select/Select";
import PhoneInput from "../FormElements/phoneInput/PhoneInput";
import useCountry from "~/hooks/useCountry ";
import { useMemo } from "react";

const GlobalForm = () => {
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

  const handleSignUp = (payload) => {
    // removing the rememberMe checkbox from payload cos it is not used
    const { uid, firstName, middleName, lastName, phoneNumber, gender, licenseNumber, specialty, country, state } =
      payload;
    console.log(uid, firstName, middleName, lastName, phoneNumber, gender, licenseNumber, specialty, country, state);

    // TODO make request using signUp() from RTK Query
  };

  //   gender options
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const { allCountries, getAllStatesByCountryCode } = useCountry();

  const allStates = useMemo(() => {
    return getAllStatesByCountryCode(selectedCountry);
  }, [getAllStatesByCountryCode, selectedCountry]);
  return (
    <div>
      <div className="mb-4 text-center">
        <h2 className="text-3xl font-bold">Create a global member account</h2>
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
            label="phoneNumber"
            register={register}
            errors={errors}
            required
            watch={watch}
            setValue={setValue}
          />
        </div>
        <div>
          <TextInput
            title="Email"
            label="uid"
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
        {/* <div>
          <TextInput
            type="password"
            label="Create password"
            required={true}
            register={register}
            errors={errors}
            placeholder="Set a password"
          />
        </div> */}

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
            label="country"
            control={control}
            options={allCountries}
            errors={errors}
            required
            title="Country/Region"
            placeholder="choose your country/region"
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
            type="number"
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
          <Button label="Get Started" className="w-full" type="submit" />
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
