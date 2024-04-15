import { useEffect, useRef, useState } from "react";
import icons from "~/assets/js/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { classNames } from "~/utilities/classNames";
import ContactListItem from "./ContactListItem";
import { useAddToHistoryMutation, useGetAllChatsQuery } from "~/redux/api/chats/chatsApi";
import { useGetSingleUserQuery } from "~/redux/api/user/userApi";
import { getCombinedId, getFullName } from "~/utilities/reusableVariables";
import Loading from "~/components/Global/Loading/Loading";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Message from "./Message";
const ENDPOINT = import.meta.env.VITE_WEBSOCKET_BASE_URL;

const ChatBox = ({ user, recipientId }) => {
  const [inputValue, setInputValue] = useState("");
  const [inputHeight, setInputHeight] = useState(48); // Initial height
  const [allMessages, setAllMessages] = useState([]);
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const maxInputHeight = 160;

  // get the room id by combining the two users id
  const uniqueId = getCombinedId(user?._id, recipientId);

  // getting all previous chats between the two users
  const {
    data: allChatsBetweenUsers,
    isLoading: loadingChats,
    isFetching,
  } = useGetAllChatsQuery({ limit: 50, room: uniqueId }, { refetchOnMountOrArgChange: true });

  const [addToHistory] = useAddToHistoryMutation();

  useEffect(() => {
    if (!loadingChats && allChatsBetweenUsers?.data) {
      const sortedMessages = [...allChatsBetweenUsers.data];

      setAllMessages(sortedMessages.reverse());
    }
  }, [allChatsBetweenUsers, loadingChats, uniqueId]);

  // fetching recipients data by fteching their details with their id
  const { data: recipientData, isLoading: loadingRecipientData } = useGetSingleUserQuery(recipientId, {
    refetchOnMountOrArgChange: true,
  });

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(`${ENDPOINT}/chats/${uniqueId}`, {
    share: false,
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: () => true,
  });

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setInputHeight(e.target.scrollHeight);
    // Ensure the input height does not exceed the maximum height
    if (inputHeight > maxInputHeight) {
      setInputHeight(maxInputHeight);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    // Implement your send message logic here
    if (readyState === ReadyState.OPEN) {
      sendJsonMessage({
        room: uniqueId,
        sender: user?._id,
        receiver: recipientId,
        content: inputValue,
      });
      // if (!allMessages) {
      addToHistory({ participants: [recipientId] });
      // }
    }
    setInputValue("");
  };
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // update the lists of messages in the messages array with the new message
  useEffect(() => {
    if (lastJsonMessage !== null) {
      setAllMessages((prevMessages) => [lastJsonMessage, ...prevMessages]);
    }
  }, [lastJsonMessage]);

  return (
    <div className="w-full lg:w-3/4 flex flex-col">
      {/* back button mobile screen */}
      <div className="lg:hidden ">
        <div
          className="flex items-center text-black gap-x-2 my-5 cursor-pointer"
          onClick={() => navigate("/messaging")}
        >
          <span className="text-lg">{icons.arrowLeft}</span> <span>Back</span>
        </div>
      </div>

      <div className="bg-white rounded-t-xl max-md:pt-4">
        {loadingRecipientData ? (
          <div className="flex justify-center items-center w-full h-full">
            <Loading />
          </div>
        ) : (
          <ContactListItem
            asHeader={true}
            name={getFullName(recipientData)}
            image={recipientData?.profileImageUrl}
            subText={recipientData?.email}
          />
        )}
      </div>
      <div className="flex-1  bg-white">
        {loadingChats || isFetching ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loading />
          </div>
        ) : (
          <div className="w-full max-h-[300px] h-full overflow-y-scroll  flex flex-col-reverse " ref={scrollRef}>
            {allMessages.map(
              (message, id) => message.content && <Message key={id} message={message} userId={user?._id} />
            )}
          </div>
        )}
      </div>
      <div className="bg-white rounded-b-xl p-4">
        <form onSubmit={handleSend} className="flex gap-4">
          <button
            type="button"
            className={classNames(
              "py-2 px-3 rounded-lg cursor-pointer hover:text-primary hover:bg-onPrimary",
              "text-gray-dark text-xl transition-all"
            )}
          >
            {icons.clip}
          </button>
          <textarea
            className={classNames(
              "bg-white border border-gray placeholder:text-[gray] rounded-lg block w-full text-sm p-3",
              "focus:ring focus:ring-primary/25 focus:outline-none focus:bg-white focus:border-transparent transition-all",
              inputHeight >= maxInputHeight && "overflow-auto"
            )}
            style={{ height: `${inputHeight}px` }}
            placeholder="Your message..."
            onChange={handleInputChange}
            value={inputValue}
            required
          />
          <button
            type="submit"
            className={classNames(
              "bg-primary text-white hover:bg-primaryContainer h-12 w-12 p-4 rounded-full",
              "inline-flex justify-center items-center text-2xl cursor-pointer",
              "focus:ring focus:ring-primary/25 focus:outline-none focus:border-transparent transition-all"
            )}
          >
            {icons.send}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
