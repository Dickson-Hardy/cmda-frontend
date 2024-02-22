import { useState } from "react";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="w-full mx-auto">
      {/* Tab Buttons */}
      <div className="flex border-b border-gray w-full">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabClick(index)}
            className={`${
              index === activeTab
                ? "border-b-2 border-primary text-primary"
                : "border-b border-transparent text-gray-dark/80"
            } px-4 py-2 focus:outline-none flex-1 text-base font-semibold`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 px-0.5">{tabs[activeTab].content}</div>
    </div>
  );
};

export default Tabs;
