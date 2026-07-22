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
 * 
 * MOBILE SIMPLIFIED FLOW:
 * - Fewer steps (6 vs 12) for better mobile UX
 * - No sidebar-requiring steps (taught via "More" button)
 * - Larger touch targets, clearer descriptions
 */

// Desktop tutorial steps (full experience)
const DESKTOP_STEPS = [
  // Welcome
  {
    id: 'welcome',
    title: 'Welcome to CMDA!',
    description: 'Let us show you around the dashboard. This quick tour will help you get started with managing your membership.',
    targetSelector: null,
    position: 'center'
  },
  // Home Overview
  {
    id: 'home-overview',
    title: 'Your Dashboard Home',
    description: 'This is your home base. Here you can see daily devotionals, upcoming events, resources, and connect with other members.',
    targetSelector: '[data-tutorial="home-section"]',
    position: 'bottom'
  },
  // Payments - Priority (Requirements 2.1)
  {
    id: 'payments-nav',
    title: 'Manage Your Payments',
    description: 'Access all your payment options here - subscriptions, donations, and payment history.',
    targetSelector: '[data-tutorial="nav-payments"]',
    route: '/dashboard',
    position: 'right',
    requiresSidebar: true
  },
  {
    id: 'subscription',
    title: 'Your Subscription',
    description: 'View and manage your CMDA membership subscription. Keep your membership active to access all premium features.',
    targetSelector: '[data-tutorial="subscription-section"]',
    route: '/dashboard/payments',
    position: 'bottom'
  },
  {
    id: 'donation',
    title: 'Make a Donation',
    description: "Support CMDA's mission by making donations. You can give one-time or set up recurring donations.",
    targetSelector: '[data-tutorial="donation-section"]',
    route: '/dashboard/payments',
    position: 'bottom'
  },
  // Events
  {
    id: 'events',
    title: 'Events & Training',
    description: 'Discover upcoming conferences, training sessions, and fellowship events. Register and stay connected.',
    targetSelector: '[data-tutorial="nav-events"]',
    position: 'right',
    requiresSidebar: true
  },
  // Resources
  {
    id: 'resources',
    title: 'Resource Library',
    description: 'Access devotionals, articles, videos, and other resources to support your faith and professional journey.',
    targetSelector: '[data-tutorial="nav-resources"]',
    position: 'right',
    requiresSidebar: true
  },
  // Members
  {
    id: 'members',
    title: 'Connect with Others',
    description: 'Find and connect with fellow CMDA members. Build relationships within the community.',
    targetSelector: '[data-tutorial="nav-members"]',
    position: 'right',
    requiresSidebar: true
  },
  // Faith Entry
  {
    id: 'faith-entry',
    title: 'Faith Entry',
    description: 'Share testimonies, prayer requests, and comments with the community. Support and encourage one another.',
    targetSelector: '[data-tutorial="nav-faith"]',
    position: 'right',
    requiresSidebar: true
  },
  // Messaging
  {
    id: 'messaging',
    title: 'Messaging',
    description: 'Send private messages to other members. Stay in touch and build meaningful connections.',
    targetSelector: '[data-tutorial="nav-messaging"]',
    position: 'right',
    requiresSidebar: true
  },
  // Store
  {
    id: 'store',
    title: 'CMDA Store',
    description: 'Browse and purchase CMDA merchandise, books, and other items.',
    targetSelector: '[data-tutorial="nav-store"]',
    position: 'right',
    requiresSidebar: true
  },
  // Profile
  {
    id: 'profile',
    title: 'Your Profile',
    description: 'Update your personal information, preferences, and account settings. You can also restart this tutorial from here.',
    targetSelector: '[data-tutorial="nav-profile"]',
    position: 'right',
    requiresSidebar: true
  },
  // Completion
  {
    id: 'complete',
    title: "You're All Set!",
    description: 'You now know your way around CMDA. If you ever need this tour again, you can restart it from your Profile settings.',
    targetSelector: null,
    position: 'center'
  }
];

// Mobile tutorial steps (simplified, no sidebar steps, with icons)
const MOBILE_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to CMDA!',
    description: 'Let us show you around! This quick tour covers the essentials.',
    targetSelector: null,
    mobileTargetSelector: null,
    position: 'center',
    mobilePosition: 'center',
    icon: '👋'
  },
  {
    id: 'home-overview',
    title: 'Your Dashboard',
    description: 'See daily devotionals, events, and connect with members right here.',
    targetSelector: '[data-tutorial="home-section"]',
    mobileTargetSelector: '[data-tutorial="home-section"]',
    position: 'bottom',
    mobilePosition: 'top',
    icon: '🏠'
  },
  {
    id: 'events',
    title: 'Events',
    description: 'Find conferences, training, and fellowship events. Tap to explore!',
    targetSelector: '[data-tutorial="nav-events"]',
    mobileTargetSelector: '[data-tutorial="bottomnav-events"]',
    position: 'right',
    mobilePosition: 'top',
    mobileRequiresSidebar: false,
    icon: '📅'
  },
  {
    id: 'resources',
    title: 'Resources',
    description: 'Access devotionals, articles, and videos for your faith journey.',
    targetSelector: '[data-tutorial="nav-resources"]',
    mobileTargetSelector: '[data-tutorial="bottomnav-resources"]',
    position: 'right',
    mobilePosition: 'top',
    mobileRequiresSidebar: false,
    icon: '📚'
  },
  {
    id: 'payments',
    title: 'Payments',
    description: 'Manage subscriptions, donations, and payment history here.',
    targetSelector: '[data-tutorial="nav-payments"]',
    mobileTargetSelector: '[data-tutorial="bottomnav-payments"]',
    position: 'right',
    mobilePosition: 'top',
    mobileRequiresSidebar: false,
    icon: '💳'
  },
  {
    id: 'more-menu',
    title: 'More Options',
    description: 'Tap "More" to access Members, Messaging, Store, and Profile settings.',
    targetSelector: null,
    mobileTargetSelector: '[data-tutorial="bottomnav-more"]',
    position: 'right',
    mobilePosition: 'top',
    mobileRequiresSidebar: false,
    icon: '☰'
  },
  {
    id: 'complete',
    title: "You're All Set!",
    description: 'Need this tour again? Find it in your Profile settings.',
    targetSelector: null,
    mobileTargetSelector: null,
    position: 'center',
    mobilePosition: 'center',
    icon: '🎉'
  }
];

export const TUTORIAL_STEPS = DESKTOP_STEPS;
export const MOBILE_TUTORIAL_STEPS = MOBILE_STEPS;

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

/**
 * Get the appropriate step list based on screen size
 * Mobile uses simplified steps (7 vs 12)
 */
export const getTutorialSteps = (isMobile) => {
  return isMobile ? MOBILE_TUTORIAL_STEPS : TUTORIAL_STEPS;
};

// Local storage key for tutorial state persistence
export const TUTORIAL_STORAGE_KEY = 'cmda_tutorial_state';

// Mobile breakpoint (matches existing useIsSmallScreen hook)
export const MOBILE_BREAKPOINT = 750;

// Total number of tutorial steps (desktop)
export const TOTAL_TUTORIAL_STEPS = TUTORIAL_STEPS.length;

// Total number of mobile tutorial steps
export const TOTAL_MOBILE_TUTORIAL_STEPS = MOBILE_TUTORIAL_STEPS.length;
