import { format } from "timeago.js";

const Message = ({ message, userId }) => {
  return (
    <div
      className={`flex  my-2 mx-7 ${(message?.sender?._id || message?.sender) !== userId ? "justify-end" : "justify-start"}`}
    >
      <div>
        <div
          className={`${(message?.sender?._id || message?.sender) === userId ? "bg-gray-light" : "bg-onPrimary"} text-tertiaryContainer text-sm w-max max-w-[290px] py-2 px-4 rounded-xl text-left shadow`}
        >
          <p>{message.content}</p>
        </div>

        <p className="text-[9px] text-[#000000bd] mt-1 text-right">{format(message.timestamp)}</p>
      </div>
    </div>
  );
};

export default Message;
