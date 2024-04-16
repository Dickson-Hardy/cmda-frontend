import { useEffect, useState } from "react";
import { classNames } from "~/utilities/classNames";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { NAV_LINKS } from "./constants";
import { useIsSmallScreen } from "~/hooks/useIsSmallScreen";
import BottomNav from "./BottomNav";

const DashboardLayout = ({ withOutlet = true, children }) => {
  const isSmallScreen = useIsSmallScreen("750px");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    !isSmallScreen && setSidebarOpen(true);
  }, [isSmallScreen]);

  return (
    <div className="bg-background">
      {/* Header */}
      <Header onToggleSidebar={toggleSidebar} />

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} navLinks={NAV_LINKS} />
        {/* Main content */}
        <div
          className={classNames(
            isSidebarOpen && "md:ml-60",
            "flex-1 flex flex-col overflow-hidden transition-all duration-300"
          )}
        >
          {/* Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 mt-16">
            {withOutlet ? <Outlet /> : children}
          </main>
        </div>
      </div>

      <BottomNav navLinks={NAV_LINKS} />
    </div>
  );
};

export default DashboardLayout;
