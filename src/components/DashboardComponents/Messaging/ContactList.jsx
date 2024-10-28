import SearchBar from "~/components/Global/SearchBar/SearchBar";
import ContactListItem from "./ContactListItem";
import { useGetAllContactsQuery } from "~/redux/api/chats/chatsApi";
import { useSearchParams } from "react-router-dom";
import Loading from "~/components/Global/Loading/Loading";

const ContactList = () => {
  const [, setSearchParams] = useSearchParams();
  const {
    data: { contacts: allContacts, adminUnreadCount, adminLastMessage } = { contacts: [] },
    isLoading: loadingChats,
  } = useGetAllContactsQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="w-full lg:w-2/5 border-r p-1">
      <SearchBar className="mr-2 mb-4" />

      <div className="mt-4 h-[calc(100%-160px)] overflow-y-auto">
        <h4 className="text-sm font-semibold mb-1 sticky top-0 pb-1 bg-background">Recent Messages</h4>

        <ContactListItem
          name="Admin"
          image=""
          subText={adminLastMessage || "--"}
          onClick={() => setSearchParams({ id: "admin" })}
          unreadCount={adminUnreadCount || 0}
        />

        <div className="flex flex-col gap-1">
          {loadingChats ? (
            <div className="w-full h-full justify-center flex items-center">
              <Loading />
            </div>
          ) : (
            allContacts?.map((contact) => {
              return (
                <ContactListItem
                  key={contact._id}
                  name={contact.chatWith?.fullName}
                  image={contact.chatWith?.avatarUrl}
                  subText={contact.lastMessage}
                  onClick={() => setSearchParams({ id: contact.chatWith?._id })}
                  unreadCount={contact?.unreadCount}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactList;
