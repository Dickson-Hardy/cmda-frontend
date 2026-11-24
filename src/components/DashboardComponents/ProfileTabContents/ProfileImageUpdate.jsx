import { useEffect, useState } from "react";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Modal from "~/components/Global/Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useEditProfileMutation } from "~/redux/api/profile/profileApi";
import { toast } from "react-toastify";
import { setUser } from "~/redux/features/auth/authSlice";
import { getApiErrorMessage } from "~/utilities/getApiErrorMessage";

const ProfileImageUpdate = () => {
  const user = useSelector((state) => state.auth.user);
  const [editProfile, { isLoading }] = useEditProfileMutation();

  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState("");

  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0];
    if (!selectedImage) return;

    setImagePreview(URL.createObjectURL(selectedImage));
    setImage(selectedImage);
  };

  useEffect(
    () => () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    },
    [imagePreview]
  );

  const handleUpdateImage = () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("avatar", image);

    editProfile(formData)
      .unwrap()
      .then((data) => {
        dispatch(setUser(data.data));
        toast.success(data?.message);
        setImagePreview("");
        setImage("");
        setOpenModal(false);
      })
      .catch((error) => {
        toast.error(getApiErrorMessage(error, "Unable to update the profile photo. Please try again."));
      });
  };

  return (
    <>
      <div className="relative flex-shrink-0">
        {!user?.avatarUrl ? (
          <span className="size-32 md:size-40 bg-onPrimary rounded-full inline-flex items-center justify-center text-6xl text-primary">
            {icons.person}
          </span>
        ) : (
          <img
            src={user?.avatarUrl}
            alt={`${user?.fullName || "Member"} profile`}
            className="size-32 md:size-40 object-cover rounded-full"
          />
        )}

        <button
          type="button"
          aria-label="Edit profile photo"
          className="p-2 sm:p-3 rounded-full border border-gray-light bg-white text-primary cursor-pointer absolute bottom-1 -right-2 focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => setOpenModal(true)}
        >
          {icons.pencil}
        </button>
      </div>

      <Modal isOpen={openModal} className="max-w-3xl px-3 md:px-6" onClose={() => setOpenModal(false)}>
        <div className="px-2 mb-2">
          <div className="flex items-center justify-between mb-7 w-full">
            <h2 className="text-lg font-bold">Edit Profile Photo</h2>
            <span className="text-xl text-gray-dark cursor-pointer" onClick={() => setOpenModal(false)}>
              {icons.close}
            </span>
          </div>

          <div className="flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-between sm:gap-x-8">
            <div className="relative">
              <div className="size-[8rem] sm:size-[12rem] overflow-hidden rounded-full relative">
                {!imagePreview && !user?.avatarUrl && (
                  <span className="w-full h-full bg-onPrimary rounded-full inline-flex items-center justify-center text-6xl text-primary">
                    {icons.person}
                  </span>
                )}
                <img
                  src={imagePreview ? imagePreview : user?.avatarUrl}
                  alt="Profile preview"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            <div className="w-full space-y-5 flex flex-col items-center">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                <label htmlFor="image" className="cursor-pointer text-primary font-semibold hover:underline">
                  Browse from gallery
                  <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/jpeg,image/png"
                    className="sr-only"
                    disabled={isLoading}
                    onChange={handleImageChange}
                  />
                </label>
                <label htmlFor="camera-image" className="cursor-pointer text-primary font-semibold hover:underline">
                  Take a photo
                  <input
                    type="file"
                    name="camera-image"
                    id="camera-image"
                    accept="image/jpeg,image/png"
                    capture="environment"
                    className="sr-only"
                    disabled={isLoading}
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <Button
                label="Save Image"
                large
                className="w-full"
                disabled={!image}
                loading={isLoading}
                onClick={handleUpdateImage}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileImageUpdate;
