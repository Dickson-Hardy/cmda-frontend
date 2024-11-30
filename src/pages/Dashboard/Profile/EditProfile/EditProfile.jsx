import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import icons from "~/assets/js/icons";
import AddSocials from "~/components/DashboardComponents/ProfileTabContents/AddSocials";
import BackButton from "~/components/Global/BackButton/BackButton";
import Button from "~/components/Global/Button/Button";
import Select from "~/components/Global/FormElements/Select/Select";
import TextArea from "~/components/Global/FormElements/TextArea/TextArea";
import TextInput from "~/components/Global/FormElements/TextInput/TextInput";
import { useEditProfileMutation } from "~/redux/api/profile/profileApi";
import { setUser } from "~/redux/features/auth/authSlice";
import { EMAIL_PATTERN } from "~/utilities/regExpValidations";
import {
  admissionYearOptions,
  currentYearOptions,
  doctorsRegionLists,
  genderOptions,
  globalRegionsData,
  studentChapterOptions,
} from "~/utilities/reusableVariables";

const DashboardEditProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [socials, setSocials] = useState(user?.socials || []);
  const [addSocialVisible, setAddSocialVisible] = useState(false);
  const [editProfile, { isLoading }] = useEditProfileMutation();
  const dispatch = useDispatch();
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "all",
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      middleName: user?.middleName || "",
      phone: user?.phone || "",
      email: user?.email || "",
      gender: user?.gender || "",
      region: user?.region || "",
      bio: user?.bio || "",
      dateOfBirth: user?.dateOfBirth?.slice(0, 10) || "",
      admissionYear: user?.admissionYear || "",
      yearOfStudy: user?.yearOfStudy || "",
      licenseNumber: user?.licenseNumber || "",
      specialty: user?.specialty || "",
      yearsOfExperience: user?.yearsOfExperience,
    },
  });

  // Function to remove a social
  const removeSocial = (indexToRemove) => {
    setSocials(socials.filter((_, index) => index !== indexToRemove));
  };
  const handleUpdateProfile = (payload) => {
    const data = {
      firstName: payload.firstName,
      middleName: payload.middleName,
      lastName: payload.lastName,
      phone: payload.phone,
      gender: payload.gender,
      dateOfBirth: payload.dateOfBirth,
      bio: payload?.bio,
      leadershipPosition: payload.leadershipPosition,
      socials: socials,
      ...(user?.role == "Student" && {
        admissionYear: payload.admissionYear.toString(),
        yearOfStudy: payload.yearOfStudy,
      }),
      region: payload.region,
      ...(user?.role != "Student" && {
        licenseNumber: payload.licenseNumber,
        specialty: payload.specialty,
        yearsOfExperience: payload.yearsOfExperience,
      }),
    };

    editProfile(data)
      .unwrap()
      .then((data) => {
        dispatch(setUser(data.data));
        toast.success(data?.message);
        navigate("/dashboard/profile");
      });
  };

  const eighteenYrsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0];

  return (
    <div>
      <BackButton label="Back to Profile" to="/dashboard/profile" />

      <div className="mt-6 flex items-center justify-center relative">
        <div className="bg-white w-full max-w-2xl max-auto p-5 md:p-8 rounded-lg ">
          <form onSubmit={handleSubmit(handleUpdateProfile)}>
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
              <Button label="Save Changes" type="submit" loading={isLoading} loadingText="Saving..." />
            </div>
            <div className="flex flex-col gap-6">
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

              {/* TODO: add the phone number */}
              <div>
                <TextInput
                  type="tel"
                  title="Phone number (optional)"
                  label="phone"
                  register={register}
                  errors={errors}
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
                  label="region"
                  control={control}
                  options={
                    user.role == "Doctor"
                      ? doctorsRegionLists
                      : user.role == "Student"
                        ? studentChapterOptions
                        : globalRegionsData
                  }
                  errors={errors}
                  required
                  title="Chapter/Region"
                  placeholder="choose your chapter/region"
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

              <div>
                <TextInput
                  title="Date of Birth"
                  label="dateOfBirth"
                  register={register}
                  errors={errors}
                  placeholder="Enter email address"
                  type="date"
                  max={eighteenYrsAgo}
                  required
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
              {/* students only roles */}
              {user.role == "Student" && (
                <>
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
                </>
              )}
              {/* doctors and global only roles */}
              {user.role != "Student" && (
                <>
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
                </>
              )}
              <div>
                <TextInput label="leadershipPosition" register={register} errors={errors} />
              </div>
            </div>
          </form>

          {/* socials */}
          <div className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold mb-4">Socials</h2>
              <Button
                variant="outlined"
                icon={icons.add}
                label="Add"
                className="px-[12px]"
                onClick={() => setAddSocialVisible(true)}
              />
            </div>

            {/* add  social form */}
            {addSocialVisible && (
              <AddSocials
                onSave={(name, link) => {
                  setSocials([...socials, { name, link }]);
                  setAddSocialVisible(false);
                }}
              />
            )}
            <div>
              {socials.map((social, index) => (
                <div key={index} className="w-full flex justify-between items-center my-3 ">
                  <div className="flex items-center gap-x-4">
                    <span className="bg-gray-light p-3 flex justify-center items-center rounded-full">
                      {social.name === "facebook" && icons.facebook}
                      {social.name === "instagram" && icons.instagram}
                      {social.name === "twitter" && icons.twitter}
                      {social.name === "linkedIn" && icons.linkedIn}
                    </span>
                    <p className="text-primaryContainer font-medium text-sm">{social.link}</p>
                  </div>
                  <p className="text-primary font-semibold cursor-pointer text-sm" onClick={() => removeSocial(index)}>
                    Remove
                  </p>
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
