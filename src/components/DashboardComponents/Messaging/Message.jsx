import { fromNow } from "~/utilities/timeFromNow";

const Message = ({ message, userId }) => {
  return (
    <div
      className={`flex my-2 mx-2 ${(message?.sender?._id || message?.sender) !== userId ? "justify-start" : "justify-end"}`}
    >
      <div>
        <div
          className={`${(message?.sender?._id || message?.sender) === userId ? "bg-primary text-white" : "bg-white black"} text-sm w-max max-w-[290px] py-2 px-4 rounded-xl text-left shadow`}
        >
          <p>{message.content}</p>
        </div>

        <p className="text-[9px] text-gray mt-1 text-right">{fromNow(message.timestamp)}</p>
      </div>
    </div>
  );
};

export default Message;
