import SearchBar from "~/components/Global/SearchBar/SearchBar";
import ContactListItem from "./ContactListItem";
import { useGetAllChatsQuery } from "~/redux/api/chats/chatsApi";
import { getFullName } from "~/utilities/reusableVariables";
import { useSearchParams } from "react-router-dom";
import Loading from "~/components/Global/Loading/Loading";
import { useMemo } from "react";

const MessagesLists = ({ userId }) => {
  let [searchParams, setSearchParams] = useSearchParams();

  // getting all previous chats between the two users
  const { data: allChatsUserHas, isLoading: loadingChats } = useGetAllChatsQuery(
    { searchText: userId },
    { refetchOnMountOrArgChange: true }
  );
  // console.log("all", allChatsUserHas);
  // console.log(userId);
  const useUniqueSenderOrReceiver = (allChatsUserHas, userId) => {
    return useMemo(() => {
      if (allChatsUserHas && allChatsUserHas.data.length) {
        const uniqueChats = [...allChatsUserHas.data].reduce((accumulator, currentValue) => {
          if (currentValue.sender._id === userId) {
            accumulator.add(JSON.stringify(currentValue.receiver)); // Add receiver object
          } else if (currentValue.receiver._id === userId) {
            accumulator.add(JSON.stringify(currentValue.sender)); // Add sender object
          }
          return accumulator;
        }, new Set());

        return Array.from(uniqueChats).map((chat) => JSON.parse(chat));
      }
    }, [allChatsUserHas, userId]); // Dependencies array
  };

  const uniqueArray = useUniqueSenderOrReceiver(allChatsUserHas, userId);

  // console.log({ uniqueArray });

  // useEffect(() => {
  //   if (!searchText) return setSearchText(user?._id);
  // }, [searchText, user?._id]);

  return (
    <div className="w-1/4 border-r p-1">
      <SearchBar className="mx-2 mb-4" />

      <div className="mt-4 h-[calc(100%-160px)] overflow-y-auto">
        <h4 className="text-sm font-semibold mb-1 sticky top-0 pb-1 bg-background">Recent Messages</h4>

        <div className="flex flex-col gap-1">
          {loadingChats ? (
            <div className="w-full h-full justify-center flex items-center">
              <Loading />
            </div>
          ) : (
            uniqueArray &&
            uniqueArray.map((message, id) => {
              return (
                <ContactListItem
                  key={id}
                  name={getFullName(message)}
                  image={message?.profileImageUrl}
                  subText={message?.email}
                  onClick={() => {
                    setSearchParams({ id: message?._id });
                  }}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesLists;
