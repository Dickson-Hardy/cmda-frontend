import { useState } from "react";
import icons from "~/assets/js/icons";
import ContactListItem from "~/components/DashboardComponents/Messaging/ContactListItem";
import Button from "~/components/Global/Button/Button";
import SearchBar from "~/components/Global/SearchBar/SearchBar";
import { classNames } from "~/utilities/classNames";

const DashboardMessagingPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [inputHeight, setInputHeight] = useState(48); // Initial height
  const maxInputHeight = 160;

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
  };

  return (
    <div>
      <div className="flex justify-between gap-2 items-center mb-4">
        <h2 className="text-2xl font-bold text-primary">Messaging</h2>
        <Button>
          <span>{icons.pencil}</span>
          New
        </Button>
      </div>

      <section className="flex gap-10 h-[calc(100vh-190px)]">
        <div className="w-1/4 border-r p-1">
          <SearchBar className="mx-2 mb-4" />
          <ContactListItem name="Admin" />
          <div className="mt-4 h-[calc(100%-160px)] overflow-y-auto">
            <h4 className="text-sm font-semibold mb-1 sticky top-0 pb-1 bg-background">Messages</h4>
            <div className="flex flex-col gap-1">
              {[...Array(10)].map((_, i) => (
                <ContactListItem key={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Chatbox */}
        <div className="w-3/4 flex flex-col">
          <div className="bg-white rounded-t-xl">
            <ContactListItem />
          </div>
          <div className="flex-1 bg-onPrimary"></div>
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
      </section>
    </div>
  );
};

export default DashboardMessagingPage;
