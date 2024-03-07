import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import CountryFlags from "~/components/Global/FormElements/CountryWithFlagsInput/CountyFlags";
import Select from "~/components/Global/FormElements/Select/Select";
import TextArea from "~/components/Global/FormElements/TextArea/TextArea";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import PhoneInput from "~/components/Global/FormElements/phoneInput/PhoneInput";
import { EMAIL_PATTERN } from "~/utilities/regExpValidations";

const DashboardEditProfile = () => {
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm({ mode: "all" });

  const navigate = useNavigate();

  // watching the country field so as to updates the state field
  const selectedCountry = watch("country", "");

  //   gender options
  const genderOptions = ["Male", "Female"].map((y) => ({ label: y, value: y.toLowerCase() }));

  return (
    <div>
      <Button variant="text" onClick={() => navigate(-1)}>
        {icons.arrowLeft} Back
      </Button>
      <div className="mt-6 flex items-center justify-center">
        <div className="bg-white w-full max-w-2xl max-auto p-8 rounded-lg">
          <form onSubmit={handleSubmit(console.log)}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
              <Button label="Save Changes" color="secondary" type="submit" />
            </div>
            <div className="flex flex-col gap-6 px-2 lg:px-5">
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
                  disabled
                  placeholder="Enter email address"
                  rules={{
                    pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address" },
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

              <div>
                <TextInput
                  title="Professional Cadre"
                  label="professional_cadre"
                  type="text"
                  register={register}
                  errors={errors}
                  required
                  placeholder="Professional Cadre"
                />
              </div>

              <div className="">
                <TextArea
                  title="Bio"
                  label="bio"
                  register={register}
                  control={control}
                  errors={errors}
                  placeholder="About you"
                />
              </div>
            </div>
          </form>

          {/* socials */}
          <div className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold mb-4">Socials</h2>
              <div className="p-2 flex gap-2 border rounded-full text-black justify-center items-center text-sm cursor-pointer">
                {icons.plus}
                Add
              </div>
            </div>
            <div className="px-2 lg:px-5">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="max-w-sm flex justify-between items-center my-3 ">
                  <div className="flex items-center gap-x-4">
                    <span className="bg-gray-light p-3 flex justify-center items-center rounded-full">
                      {icons.facebook}
                    </span>
                    <p className="text-primaryContainer font-semibold text-sm">Facebook.com/kingSolomon</p>
                  </div>
                  <p className="text-primary font-semibold cursor-pointer text-sm">Remove</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEditProfile;
