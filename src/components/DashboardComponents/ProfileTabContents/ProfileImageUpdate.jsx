import { useState } from "react";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Modal from "~/components/Global/Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateProfilePicture2Mutation } from "~/redux/api/profile/editProfile";
import { toast } from "react-toastify";
import { setUser } from "~/redux/features/auth/authSlice";

const ProfileImageUpdate = () => {
  const user = useSelector((state) => state.auth.user);

  const [updateProfilePicture2, { isLoading }] = useUpdateProfilePicture2Mutation();
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
    formData.append("image", image);

    updateProfilePicture2({ id: user?._id, payload: formData })
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
        toast.error(error);
      });
  };

  return (
    <div className="">
      <div className="w-full h-full rounded-full relative">
        {!user?.profileImageUrl ? (
          <span className="w-[6rem] h-[5.5rem] md:h-28 md:w-28 bg-onPrimary rounded-full inline-flex items-center justify-center text-6xl text-primary">
            {icons.person}
          </span>
        ) : (
          <img
            src={user?.profileImageUrl}
            alt="img"
            className="w-[6rem] h-[5.5rem] md:h-28 md:w-28  rounded-full object-cntain"
          />
        )}

        <span
          className="p-1.5 sm:p-3 rounded-full border border-gray-light bg-white cursor-pointer absolute bottom-1 -right-2"
          onClick={() => setOpenModal(true)}
        >
          {icons.pencil}
        </span>
      </div>

      <Modal isOpen={openModal} className="max-w-3xl px-3 md:px-6" onClose={() => setOpenModal(false)}>
        <div className="p-2 sm:p-7">
          <div className="flex items-center justify-between mb-7 w-full">
            <h2 className="text-lg font-bold">Edit Profile Photo</h2>
            <span className="text-2xl text-black cursor-pointer" onClick={() => setOpenModal(false)}>
              {icons.close}
            </span>
          </div>

          <div className="flex items-center justify-between w-full gap-x-8">
            <div className="relative">
              <div className="size-[8rem] sm:size-[12rem] overflow-hidden rounded-full relative">
                {!imagePreview && !user?.profileImageUrl && (
                  <span className="w-full h-full bg-onPrimary rounded-full inline-flex items-center justify-center text-6xl text-primary">
                    {icons.person}
                  </span>
                )}
                <img
                  src={imagePreview ? imagePreview : user?.profileImageUrl}
                  alt="img"
                  className=" w-full h-full rounded-full object-conain"
                />
              </div>
            </div>

            <div className="w-full space-y-5 flex flex-col items-center">
              <Button className="w-full h-full" disabled={isLoading}>
                <label
                  htmlFor="image"
                  className="justify-center items-center w-full h-full border-[#949494] overflow-hidden"
                >
                  Change Image
                  <input
                    type="file"
                    name="image"
                    id="image"
                    accept=".jpg,.jpeg,.png"
                    className="sr-only "
                    onChange={handleImageChange}
                  />
                </label>
              </Button>

              <Button
                label="Save Image"
                className="w-full"
                disabled={!image || isLoading}
                loading={isLoading}
                onClick={handleUpdateImage}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileImageUpdate;
