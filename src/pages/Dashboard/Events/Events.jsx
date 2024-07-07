import { useState } from "react";
import Tabs from "~/components/Global/Tabs/Tabs";
import Drawer from "~/components/Global/Drawer/Drawer";
import EventsCalender from "~/components/DashboardComponents/Events/EventsCalender";
import icons from "~/assets/js/icons";
import { useIsSmallScreen } from "~/hooks/useIsSmallScreen";
import AllEvents from "~/components/DashboardComponents/Events/AllEvents";
import RegisteredEvents from "~/components/DashboardComponents/Events/RegisteredEvents";
import { classNames } from "~/utilities/classNames";

const DashboardEventsPage = () => {
  const [activeView, setActiveView] = useState("list");
  const [openMobileCalender, setOpenMobileCalender] = useState(false);

  const isSmallScreen = useIsSmallScreen("768px");

  const eventTabs = [
    { label: "All Events", content: <AllEvents row={activeView === "list"} isSmallScreen={isSmallScreen} /> },
    {
      label: "Registered events",
      content: <RegisteredEvents row={activeView === "list"} isSmallScreen={isSmallScreen} />,
    },
  ];

  const handleViewClick = (view) => {
    setActiveView(view);
  };

  const AddonElement = () => (
    <div className="hidden lg:flex items-center gap-x-4">
      <div
        className={classNames(activeView === "list" && "p-1 bg-[#f5f5f5] rounded-full", "cursor-pointer")}
        onClick={() => handleViewClick("list")}
      >
        {icons.list}
      </div>
      <div
        className={classNames(activeView === "grid" && "p-1 bg-[#f5f5f5] rounded-full", "cursor-pointer")}
        onClick={() => handleViewClick("grid")}
      >
        {icons.grid}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Events</h2>
        <div
          className="lg:hidden flex items-center justify-center p-4 cursor-pointer bg-gray-light rounded-full shadow-md"
          onClick={() => setOpenMobileCalender(true)}
        >
          {icons.calendar}
        </div>
      </div>

      <section className="flex gap-10">
        <div className="w-full lg:w-[calc(100%-344px)]">
          <Tabs tabs={eventTabs} equalTab={false} addonElement={AddonElement} />
        </div>
        <div className="hidden lg:block w-[300px]">
          <EventsCalender />
        </div>
      </section>

      {/* mobile calender */}
      <Drawer active={openMobileCalender} setActive={setOpenMobileCalender}>
        <div className="px-4 mt-16 mb-10 max-w-md ml-auto">{/* <EventsCalender /> */}</div>
      </Drawer>
    </div>
  );
};

export default DashboardEventsPage;
