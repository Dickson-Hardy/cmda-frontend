import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../Global/Button/Button";
import TextInput from "../../Global/FormElements/TextInput/TextInput";
import { EMAIL_PATTERN } from "~/utilities/regExpValidations";
import Select from "../../Global/FormElements/Select/Select";
import PhoneInput from "../../Global/FormElements/phoneInput/PhoneInput";
import { useSignUpMutation } from "~/redux/api/auth/authApi";
import { toast } from "react-toastify";
import { setVerifyEmail } from "~/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";

const DoctorForm = () => {
  const navigate = useNavigate();
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "all" });

  const [signUp, { isLoading }] = useSignUpMutation();
  const dispatch = useDispatch();

  const handleSignUp = (payload) => {
    // removing the rememberMe checkbox from payload cos it is not used
    const { email, password, firstName, middleName, lastName, phone, gender, licenseNumber, specialty, region } =
      payload;

    // making request using signUp() from RTK Query
    signUp({
      email,
      password,
      firstName,
      middleName,
      lastName,
      phone,
      gender,
      licenseNumber,
      specialty,
      region,
      role: "doctor",
    })
      .unwrap()
      .then(() => {
        toast.success("Doctor account created successfully, Check email for token");
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

  const doctorsRegionLists = [
    "Abia - Umahia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra (NAUTH)",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "CMDA Uyo",
    "Delta",
    "Delta - DELSUTH, Oghara",
    "Delta FMC, Asaba",
    "Ebonyi",
    "Edo-Benin",
    "Edo-SHMB",
    "Edo-Irrua",
    "Ekiti - Ido",
    "Ekiti-Ado",
    "Enugu",
    "FCT Gwagwalada",
    "FCT Municipal",
    "Gombe",
    "Imo",
    "Kaduna - Kaduna",
    "Kaduna - Zaria",
    "Kano",
    "Kogi",
    "Kwara",
    "Lagos-Lasuth",
    "Lagos-Luth",
    "Nasarawa - Keffi",
    "Nasarawa - Lafiya",
    "Niger-Bida",
    "Ogun - Abeokuta",
    "Ogun - Shagamu",
    "Ondo - Owo",
    "ONDO – UNIMEDTH",
    "Osun-Ife",
    "Osun-Osogbo",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Kebbi",
  ].map((x) => ({
    label: x,
    value: x,
  }));

  return (
    <div>
      <div className="mb-4 text-center">
        <h2 className="md:text-3xl text-2xl font-bold">Create a Doctor account</h2>
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
            options={doctorsRegionLists}
            errors={errors}
            required
            title="Chapter/Region"
            placeholder="choose your chapter/region"
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
          <Button label="Get Started" large loading={isLoading} className="w-full" type="submit" />
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

export default DoctorForm;
