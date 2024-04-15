import { useState } from "react";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Modal from "~/components/Global/Modal/Modal";
import ContactListItem from "./ContactListItem";
import { useGetAllUsersQuery } from "~/redux/api/user/userApi";
import Loading from "~/components/Global/Loading/Loading";
import { useSearchParams } from "react-router-dom";
import { getFullName } from "~/utilities/reusableVariables";

const SendNewMessage = ({ userId }) => {
  let [, setSearchParams] = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: allUsers,
    isLoading: loadingUsers,
    isFetching,
  } = useGetAllUsersQuery({ searchText: searchTerm }, { refetchOnMountOrArgChange: true });

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>
        <span>{icons.pencil}</span>
        New
      </Button>

      <Modal
        isOpen={openModal}
        className="w-full sm:w-[400px] px-3 md:px-6 overflow-y-auto"
        onClose={() => setOpenModal(false)}
      >
        <div className="">
          <div className="flex items-center justify-between mb-7 w-full">
            <h2 className="text-lg font-bold">Send a Message to</h2>
            <span className="text-2xl text-black cursor-pointer" onClick={() => setOpenModal(false)}>
              {icons.close}
            </span>
          </div>

          {/* search bar */}
          <div className="bg-white border border-gray rounded-md w-full text-sm px-3 h-[55px] relative flex gap-x-3 items-center">
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email"
              className="border-none outline-none placeholder:text-gray placeholder:text-xs w-full h-full"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="space-y- mt-4 h-[300px] overflow-y-auto">
            {isFetching || loadingUsers ? (
              <div className="flex w-full h-full justify-center items-center">
                <Loading />
              </div>
            ) : (
              allUsers &&
              allUsers.data &&
              allUsers?.data?.length > 1 &&
              allUsers.data.map(
                (user, id) =>
                  user?._id !== userId && (
                    <ContactListItem
                      key={id}
                      name={getFullName(user)}
                      image={user?.profileImageUrl}
                      subText={user?.email}
                      onClick={() => {
                        setSearchParams({ id: user?._id });
                        setOpenModal(false);
                      }}
                    />
                  )
              )
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SendNewMessage;
