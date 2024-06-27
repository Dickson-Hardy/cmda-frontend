import { useState } from "react";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Modal from "~/components/Global/Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useEditProfileMutation, useUpdateProfilePictureMutation } from "~/redux/api/profile/editProfile";
import { toast } from "react-toastify";
import { setUser } from "~/redux/features/auth/authSlice";

const ProfileImageUpdate = () => {
  const user = useSelector((state) => state.auth.user);
  // console.log(user);
  // const [updateProfilePicture, { isLoading }] = useUpdateProfilePictureMutation();
  const [editProfile, { isLoading }] = useEditProfileMutation();

  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState("");

  const handleImageChange = (e) => {
    setImagePreview(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  const handleUpdateImage = () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("avatar", image);

    // updateProfilePicture({ id: user?._id, payload: formData })
    //   .unwrap()
    //   .then((data) => {
    // dispatch(setUser(data.data));
    // toast.success(data?.message);
    // setImagePreview("");
    // setImage("");
    // setOpenModal(false);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     toast.error(error);
    //   });

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
        console.log(error);
        toast.error(error[0]);
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
          <img src={user?.avatarUrl} alt="img" className="size-32 md:size-40 object-cover rounded-full" />
        )}

        <span
          className="p-2 sm:p-3 rounded-full border border-gray-light bg-white text-primary cursor-pointer absolute bottom-1 -right-2"
          onClick={() => setOpenModal(true)}
        >
          {icons.pencil}
        </span>
      </div>

      <Modal isOpen={openModal} className="max-w-3xl px-3 md:px-6" onClose={() => setOpenModal(false)}>
        <div className="px-2 mb-2">
          <div className="flex items-center justify-between mb-7 w-full">
            <h2 className="text-lg font-bold">Edit Profile Photo</h2>
            <span className="text-xl text-gray-dark cursor-pointer" onClick={() => setOpenModal(false)}>
              {icons.close}
            </span>
          </div>

          <div className="flex items-center justify-between w-full gap-x-8">
            <div className="relative">
              <div className="size-[8rem] sm:size-[12rem] overflow-hidden rounded-full relative">
                {!imagePreview && !user?.avatarUrl && (
                  <span className="w-full h-full bg-onPrimary rounded-full inline-flex items-center justify-center text-6xl text-primary">
                    {icons.person}
                  </span>
                )}
                <img
                  src={imagePreview ? imagePreview : user?.avatarUrl}
                  alt="img"
                  className=" w-full h-full object-cover rounded-full object-conain"
                />
              </div>
            </div>

            <div className="w-full space-y-5 flex flex-col items-center">
              {/* <Button className="w-full h-full" disabled={isLoading}> */}
              <label htmlFor="image" className="cursor-pointer text-primary font-semibold hover:underline">
                Click here to browse image
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept=".jpg,.jpeg,.png"
                  className="sr-only"
                  disabled={isLoading}
                  onChange={handleImageChange}
                />
              </label>
              {/* </Button> */}

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
