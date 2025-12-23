/**
 * Tutorial Steps Configuration
 * Defines all steps for the dashboard onboarding tutorial
 * Steps are ordered with payments prioritized first per requirements
 * 
 * Mobile Navigation Handling (Requirements 7.2, 7.3, 7.4):
 * - First 4 nav items (Home, Events, Resources, Payments) are in BottomNav
 * - Other items require opening sidebar on mobile
 * - mobileTargetSelector: alternative selector for mobile BottomNav items
 * - requiresSidebar: true means sidebar must be opened on mobile
 */

export const TUTORIAL_STEPS = [
  // Welcome
  {
    id: 'welcome',
    title: 'Welcome to CMDA!',
    description: 'Let us show you around the dashboard. This quick tour will help you get started with managing your membership.',
    targetSelector: null,
    mobileTargetSelector: null,
    position: 'center',
    mobilePosition: 'center'
  },
  // Home Overview
  {
    id: 'home-overview',
    title: 'Your Dashboard Home',
    description: 'This is your home base. Here you can see daily devotionals, upcoming events, resources, and connect with other members.',
    targetSelector: '[data-tutorial="home-section"]',
    mobileTargetSelector: '[data-tutorial="home-section"]',
    position: 'bottom',
    mobilePosition: 'top'
  },
  // Payments - Priority (Requirements 2.1)
  // On mobile, Payments is in BottomNav (4th item)
  {
    id: 'payments-nav',
    title: 'Manage Your Payments',
    description: 'Access all your payment options here - subscriptions, donations, and payment history.',
    targetSelector: '[data-tutorial="nav-payments"]',
    mobileTargetSelector: '[data-tutorial="bottomnav-payments"]',
    route: '/dashboard',
    position: 'right',
    mobilePosition: 'top',
    requiresSidebar: true,
    mobileRequiresSidebar: false // Available in BottomNav
  },
  {
    id: 'subscription',
    title: 'Your Subscription',
    description: 'View and manage your CMDA membership subscription. Keep your membership active to access all premium features.',
    targetSelector: '[data-tutorial="subscription-section"]',
    mobileTargetSelector: '[data-tutorial="subscription-section"]',
    route: '/dashboard/payments',
    position: 'bottom',
    mobilePosition: 'top'
  },
  {
    id: 'donation',
    title: 'Make a Donation',
    description: "Support CMDA's mission by making donations. You can give one-time or set up recurring donations.",
    targetSelector: '[data-tutorial="donation-section"]',
    mobileTargetSelector: '[data-tutorial="donation-section"]',
    route: '/dashboard/payments',
    position: 'bottom',
    mobilePosition: 'top'
  },
  // Events - On mobile, Events is in BottomNav (2nd item)
  {
    id: 'events',
    title: 'Events & Training',
    description: 'Discover upcoming conferences, training sessions, and fellowship events. Register and stay connected.',
    targetSelector: '[data-tutorial="nav-events"]',
    mobileTargetSelector: '[data-tutorial="bottomnav-events"]',
    position: 'right',
    mobilePosition: 'top',
    requiresSidebar: true,
    mobileRequiresSidebar: false // Available in BottomNav
  },
  // Resources - On mobile, Resources is in BottomNav (3rd item)
  {
    id: 'resources',
    title: 'Resource Library',
    description: 'Access devotionals, articles, videos, and other resources to support your faith and professional journey.',
    targetSelector: '[data-tutorial="nav-resources"]',
    mobileTargetSelector: '[data-tutorial="bottomnav-resources"]',
    position: 'right',
    mobilePosition: 'top',
    requiresSidebar: true,
    mobileRequiresSidebar: false // Available in BottomNav
  },
  // Members - Requires sidebar on mobile
  {
    id: 'members',
    title: 'Connect with Others',
    description: 'Find and connect with fellow CMDA members. Build relationships within the community.',
    targetSelector: '[data-tutorial="nav-members"]',
    mobileTargetSelector: '[data-tutorial="nav-members"]',
    position: 'right',
    mobilePosition: 'left',
    requiresSidebar: true,
    mobileRequiresSidebar: true
  },
  // Faith Entry - Requires sidebar on mobile
  {
    id: 'faith-entry',
    title: 'Faith Entry',
    description: 'Share testimonies, prayer requests, and comments with the community. Support and encourage one another.',
    targetSelector: '[data-tutorial="nav-faith"]',
    mobileTargetSelector: '[data-tutorial="nav-faith"]',
    position: 'right',
    mobilePosition: 'left',
    requiresSidebar: true,
    mobileRequiresSidebar: true
  },
  // Messaging - Requires sidebar on mobile
  {
    id: 'messaging',
    title: 'Messaging',
    description: 'Send private messages to other members. Stay in touch and build meaningful connections.',
    targetSelector: '[data-tutorial="nav-messaging"]',
    mobileTargetSelector: '[data-tutorial="nav-messaging"]',
    position: 'right',
    mobilePosition: 'left',
    requiresSidebar: true,
    mobileRequiresSidebar: true
  },
  // Store - Requires sidebar on mobile
  {
    id: 'store',
    title: 'CMDA Store',
    description: 'Browse and purchase CMDA merchandise, books, and other items.',
    targetSelector: '[data-tutorial="nav-store"]',
    mobileTargetSelector: '[data-tutorial="nav-store"]',
    position: 'right',
    mobilePosition: 'left',
    requiresSidebar: true,
    mobileRequiresSidebar: true
  },
  // Profile - Requires sidebar on mobile
  {
    id: 'profile',
    title: 'Your Profile',
    description: 'Update your personal information, preferences, and account settings. You can also restart this tutorial from here.',
    targetSelector: '[data-tutorial="nav-profile"]',
    mobileTargetSelector: '[data-tutorial="nav-profile"]',
    position: 'right',
    mobilePosition: 'left',
    requiresSidebar: true,
    mobileRequiresSidebar: true
  },
  // Completion
  {
    id: 'complete',
    title: "You're All Set!",
    description: 'You now know your way around CMDA. If you ever need this tour again, you can restart it from your Profile settings.',
    targetSelector: null,
    mobileTargetSelector: null,
    position: 'center',
    mobilePosition: 'center'
  }
];

/**
 * Helper function to get the appropriate target selector based on screen size
 * Requirements: 7.2 - Detect when step targets BottomNav vs Sidebar items
 */
export const getTargetSelector = (step, isMobile) => {
  if (!step) return null;
  if (isMobile && step.mobileTargetSelector !== undefined) {
    return step.mobileTargetSelector;
  }
  return step.targetSelector;
};

/**
 * Helper function to check if sidebar is required for a step
 * Requirements: 7.4 - Handle sidebar navigation items on mobile
 */
export const requiresSidebarForStep = (step, isMobile) => {
  if (!step) return false;
  if (isMobile && step.mobileRequiresSidebar !== undefined) {
    return step.mobileRequiresSidebar;
  }
  return step.requiresSidebar || false;
};

/**
 * Helper function to get the appropriate position based on screen size
 */
export const getStepPosition = (step, isMobile) => {
  if (!step) return 'center';
  if (isMobile && step.mobilePosition !== undefined) {
    return step.mobilePosition;
  }
  return step.position || 'center';
};

// Local storage key for tutorial state persistence
export const TUTORIAL_STORAGE_KEY = 'cmda_tutorial_state';

// Mobile breakpoint (matches existing useIsSmallScreen hook)
export const MOBILE_BREAKPOINT = 750;

// Total number of tutorial steps
export const TOTAL_TUTORIAL_STEPS = TUTORIAL_STEPS.length;
