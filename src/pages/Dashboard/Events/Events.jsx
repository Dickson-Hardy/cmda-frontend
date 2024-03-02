import icons from "~/assets/js/icons";
import EventCard from "~/components/DashboardComponents/Events/EventCard";
import Tabs from "~/components/Global/Tabs/Tabs";

const DashboardEventsPage = () => {
  //
  const AvailableEvents = () => {
    return (
      <div className="flex flex-col gap-8">
        {[...Array(10)].map((_, i) => (
          <EventCard key={i} row width="auto" />
        ))}
      </div>
    );
  };

  const eventTabs = [
    { label: "Upcoming events", content: <AvailableEvents /> },
    { label: "Past events", content: <AvailableEvents /> },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Events</h2>

      <section className="flex gap-10">
        <div className="w-2/3">
          <Tabs tabs={eventTabs} equalTab={false} />
        </div>
        <div className="w-1/3">
          <div className="sticky top-0">
            <div className="bg-white rounded-xl p-4 h-80 shadow">Calender</div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Today, 8</h3>
              <ul className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <li key={i} className="bg-white border rounded-xl p-4 space-y-4">
                    <div>
                      <p className="text-gray-dark text-xs mb-2 truncate flex items-center gap-2">
                        <span>{icons.clockCounter}</span> 10:00 AM - 10:30AM
                      </p>
                      <h4 className="text-sm font-bold truncate">Medical Problems in West Africa</h4>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardEventsPage;
