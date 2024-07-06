import { useState } from "react";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Modal from "~/components/Global/Modal/Modal";
import ContactListItem from "./ContactListItem";
import { useGetAllUsersQuery } from "~/redux/api/user/userApi";
import Loading from "~/components/Global/Loading/Loading";
import { useSearchParams } from "react-router-dom";
import SearchBar from "~/components/Global/SearchBar/SearchBar";

const SendNewMessage = ({ userId }) => {
  let [, setSearchParams] = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [searchBy, setSearchBy] = useState("");

  const {
    data: allUsers,
    isLoading: loadingUsers,
    isFetching,
  } = useGetAllUsersQuery({ page: 1, limit: 50, searchBy }, { refetchOnMountOrArgChange: true });

  return (
    <>
      <Button icon={icons.pencil} label="New" onClick={() => setOpenModal(true)} />

      <Modal isOpen={openModal} title="Send a Message to" maxWidth={400} onClose={() => setOpenModal(false)}>
        {/* search bar */}
        <SearchBar onSearch={setSearchBy} />

        <div className="space-y- mt-4 h-80 overflow-y-auto">
          {isFetching || loadingUsers ? (
            <div className="flex w-full h-full justify-center items-center">
              <Loading />
            </div>
          ) : (
            allUsers?.items
              .filter((x) => x._id !== userId)
              .map((user) => (
                <ContactListItem
                  key={user._id}
                  name={user.fullName}
                  image={user?.avatarUrl}
                  subText={user?.email}
                  onClick={() => {
                    setSearchParams({ id: user?._id });
                    setOpenModal(false);
                  }}
                />
              ))
          )}
        </div>
      </Modal>
    </>
  );
};

export default SendNewMessage;
