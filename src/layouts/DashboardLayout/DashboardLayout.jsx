import { useEffect, useState, useCallback } from "react";
import { classNames } from "~/utilities/classNames";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { NAV_LINKS } from "../../constants/navigation";
import { useIsSmallScreen } from "~/hooks/useIsSmallScreen";
import BottomNav from "./BottomNav";
import { useGetNotificationStatsQuery } from "~/redux/api/notification/notificationApi";
import { TutorialProvider, useTutorial } from "~/components/Tutorial/TutorialContext";
import TutorialOverlay from "~/components/Tutorial/TutorialOverlay";
import TutorialModal from "~/components/Tutorial/TutorialModal";
import SkipConfirmationDialog from "~/components/Tutorial/SkipConfirmationDialog";

/**
 * Tutorial Integration Component
 * Handles the tutorial overlay and modal display
 * Requirements: 1.1, 1.4 - Auto-trigger logic for first-time users
 */
const TutorialIntegration = () => {
  const {
    isActive,
    currentStep,
    totalSteps,
    currentStepData,
    shouldAutoTrigger,
    startTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    completeTutorial,
    isSidebarOpen
  } = useTutorial();

  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);
  const [hasAutoTriggered, setHasAutoTriggered] = useState(false);

  // Auto-trigger tutorial for first-time users
  // Requirements: 1.1 - WHEN a user logs in for the first time, THE Tutorial_System SHALL automatically display the tutorial welcome modal
  useEffect(() => {
    if (shouldAutoTrigger && !hasAutoTriggered && !isActive) {
      // Small delay to ensure dashboard is fully loaded
      const timer = setTimeout(() => {
        startTutorial();
        setHasAutoTriggered(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldAutoTrigger, hasAutoTriggered, isActive, startTutorial]);

  // Handle click outside modal - show skip confirmation
  // Requirements: 4.5 - WHEN the user clicks outside the modal or presses Escape, THE Tutorial_System SHALL prompt for confirmation before exiting
  const handleClickOutside = useCallback(() => {
    setShowSkipConfirmation(true);
  }, []);

  // Handle skip with confirmation
  const handleSkipConfirm = useCallback(() => {
    setShowSkipConfirmation(false);
    skipTutorial();
  }, [skipTutorial]);

  // Handle continue (cancel skip)
  const handleContinue = useCallback(() => {
    setShowSkipConfirmation(false);
  }, []);

  // Handle skip from modal (direct skip without confirmation for Skip link)
  const handleSkip = useCallback(() => {
    setShowSkipConfirmation(true);
  }, []);

  if (!isActive) {
    return null;
  }

  const targetSelector = currentStepData?.computedTargetSelector || currentStepData?.targetSelector;

  return (
    <>
      {/* Tutorial Overlay with spotlight effect */}
      <TutorialOverlay
        targetSelector={targetSelector}
        isVisible={isActive && !showSkipConfirmation}
        onClickOutside={handleClickOutside}
      />

      {/* Tutorial Modal */}
      <TutorialModal
        step={currentStepData}
        currentIndex={currentStep}
        totalSteps={totalSteps}
        onNext={nextStep}
        onPrev={prevStep}
        onSkip={handleSkip}
        onComplete={completeTutorial}
        targetSelector={targetSelector}
        isVisible={isActive && !showSkipConfirmation}
      />

      {/* Skip Confirmation Dialog */}
      {/* Requirements: 4.5 - Provide "Continue Tutorial" and "Skip Tutorial" options */}
      <SkipConfirmationDialog
        isVisible={showSkipConfirmation}
        onContinue={handleContinue}
        onSkip={handleSkipConfirm}
      />
    </>
  );
};

const DashboardLayout = ({ withOutlet = true, children }) => {
  const isSmallScreen = useIsSmallScreen("750px");
  const [isSidebarOpen, setSidebarOpen] = useState(!isSmallScreen);

  const toggleSidebar = () => {
    if (isSmallScreen) {
      setSidebarOpen(!isSidebarOpen);
    }
  };

  // Callback to open sidebar (for tutorial mobile navigation)
  const openSidebar = useCallback(() => {
    if (isSmallScreen) {
      setSidebarOpen(true);
    }
  }, [isSmallScreen]);

  // Callback to close sidebar (for tutorial mobile navigation)
  const closeSidebar = useCallback(() => {
    if (isSmallScreen) {
      setSidebarOpen(false);
    }
  }, [isSmallScreen]);

  useEffect(() => {
    if (!isSmallScreen) {
      setSidebarOpen(true); // Keep sidebar open on large screens
    } else {
      setSidebarOpen(false); // Default to closed on small screens
    }
  }, [isSmallScreen]);

  const { data: { unreadMessagesCount, unreadNotificationCount } = {} } = useGetNotificationStatsQuery(null, {
    pollingInterval: 900000,
  });

  return (
    <TutorialProvider
      isSidebarOpen={isSidebarOpen}
      onOpenSidebar={openSidebar}
      onCloseSidebar={closeSidebar}
    >
      <div className="bg-background">
        <Header unreadMessagesCount={unreadMessagesCount} unreadNotificationCount={unreadNotificationCount} />

        <div className="flex h-screen overflow-hidden">
          <Sidebar
            isOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
            navLinks={NAV_LINKS}
            unreadMessagesCount={unreadMessagesCount}
          />
          <div
            className={classNames(
              isSidebarOpen && "md:ml-60",
              "flex-1 flex flex-col overflow-hidden transition-all duration-300"
            )}
          >
            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 mt-16">
              {withOutlet ? <Outlet /> : children}
            </main>
          </div>
        </div>

        <BottomNav navLinks={NAV_LINKS} toggleSidebar={toggleSidebar} />

        {/* Tutorial Integration - Overlay and Modal */}
        <TutorialIntegration />
      </div>
    </TutorialProvider>
  );
};

export default DashboardLayout;
