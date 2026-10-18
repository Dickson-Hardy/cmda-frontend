import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ChatBox from "~/components/DashboardComponents/Messaging/ChatBox";
import ContactList from "~/components/DashboardComponents/Messaging/ContactList";
import SendNewMessage from "~/components/DashboardComponents/Messaging/SendNewMessage";

const DashboardMessagingPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [searchParams] = useSearchParams();
  const recipientId = searchParams.get("id");

  return (
    <div>
      <div className="flex justify-between gap-2 items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-primary">Messaging</h2>
        <SendNewMessage userId={user?._id} />
      </div>

      <section className="gap-10 h-[calc(100vh-190px)] flex">
        <div className={recipientId ? "hidden lg:contents" : "contents"}>
          <ContactList />
        </div>
        {recipientId ? (
          <ChatBox key={recipientId} userId={user._id} recipientId={recipientId} />
        ) : (
          <div className="hidden lg:flex w-3/5 flex-col justify-center items-center">
            <p className="font-bold text-lg text-center">Select a member to start a conversation.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardMessagingPage;
