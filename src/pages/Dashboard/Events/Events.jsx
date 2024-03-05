import { useState } from "react";
import EventCard from "~/components/DashboardComponents/Events/EventCard";
import Tabs from "~/components/Global/Tabs/Tabs";
import { FaRegCalendar } from "react-icons/fa";
import Drawer from "~/components/Global/Drawer/Drawer";
import EventsCalender from "~/components/DashboardComponents/Events/EventsCalender";

const DashboardEventsPage = () => {
  const [activeView, setActiveView] = useState("list");
  const [openMobileCalender, setOpenMobileCalender] = useState(false);

  const AvailableEvents = ({ row }) => {
    return (
      <div className={`flex gap-8  ${row ? "flex-col" : "flex-row flex-wrap"}`}>
        {[...Array(10)].map((_, i) => (
          <EventCard key={i} row={row} width={row ? "auto" : 330} />
        ))}
      </div>
    );
  };

  const eventTabs = [
    { label: "Upcoming events", content: <AvailableEvents row={activeView === "list"} /> },
    { label: "Past events", content: <AvailableEvents row={activeView === "list"} /> },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Events</h2>
        <div
          className="lg:hidden flex items-center justify-center p-4 cursor-pointer bg-gray-light rounded-full shadow-md"
          onClick={() => setOpenMobileCalender(true)}
        >
          <FaRegCalendar />
        </div>
      </div>

      <section className="flex gap-10">
        <div className="w-full lg:w-2/3 ">
          <Tabs tabs={eventTabs} equalTab={false} activeView={activeView} setActiveView={setActiveView} />
        </div>
        <div className="hidden lg:block lg:w-1/3">
          <EventsCalender />
        </div>
      </section>

      {/* mobile calender */}
      <Drawer active={openMobileCalender} setActive={setOpenMobileCalender}>
        <div className="px-4 mt-16 mb-10">
          <EventsCalender />
        </div>
      </Drawer>
    </div>
  );
};

export default DashboardEventsPage;
