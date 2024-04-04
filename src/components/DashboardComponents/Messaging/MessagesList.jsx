import SearchBar from "~/components/Global/SearchBar/SearchBar";
import ContactListItem from "./ContactListItem";
import { useGetChatsHistoryQuery } from "~/redux/api/chats/chatsApi";
import { getFullName } from "~/utilities/reusableVariables";
import { useSearchParams } from "react-router-dom";
import Loading from "~/components/Global/Loading/Loading";
import { useState } from "react";

const MessagesLists = ({ userId }) => {
  let [searchParams, setSearchParams] = useSearchParams();

  const [searchText, setSearchText] = useState("");

  // getting all previous chats between the two users
  const { data: allChatsHistory, isLoading: loadingChats } = useGetChatsHistoryQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );
  // console.log(allChatsHistory);
  return (
    <div className="w-1/4 border-r p-1">
      <SearchBar className="mx-2 mb-4" />

      <div className="mt-8 h-[calc(100%-160px)] overflow-y-auto">
        <h4 className="text-sm font-semibold mb-1 sticky top-0 pb-1 bg-background">Recent Messages</h4>

        <div className="flex flex-col gap-1">
          {loadingChats ? (
            <div className="w-full h-full justify-center flex items-center">
              <Loading />
            </div>
          ) : (
            allChatsHistory &&
            allChatsHistory?.data &&
            allChatsHistory?.data.length > 0 &&
            [...allChatsHistory.data[0].participants].map((user, id) => {
              if (user?._id !== userId) {
                return (
                  <ContactListItem
                    key={id}
                    name={getFullName(user)}
                    image={user.profileImageUrl}
                    subText={user?.email}
                    onClick={() => {
                      setSearchParams({ id: user?._id });
                    }}
                  />
                );
              }
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesLists;
