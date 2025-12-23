import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  TUTORIAL_STEPS, 
  TUTORIAL_STORAGE_KEY, 
  TOTAL_TUTORIAL_STEPS,
  MOBILE_BREAKPOINT,
  getTargetSelector,
  requiresSidebarForStep,
  getStepPosition
} from '~/constants/tutorial';

/**
 * Tutorial Context
 * Manages the state and navigation for the dashboard onboarding tutorial
 * Requirements: 1.1, 1.2, 1.3, 7.2, 7.3, 7.4
 */

const TutorialContext = createContext(null);

/**
 * Check if local storage is available
 * Requirements: Error Handling - Handle local storage unavailable
 */
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__tutorial_storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check if session storage is available
 * Requirements: Error Handling - Fall back to session storage
 */
const isSessionStorageAvailable = () => {
  try {
    const testKey = '__tutorial_storage_test__';
    sessionStorage.setItem(testKey, testKey);
    sessionStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Cache storage availability check
let storageType = null;
const getAvailableStorage = () => {
  if (storageType !== null) return storageType;
  
  if (isLocalStorageAvailable()) {
    storageType = 'localStorage';
  } else if (isSessionStorageAvailable()) {
    storageType = 'sessionStorage';
    console.warn('Tutorial: Local storage unavailable, falling back to session storage. Tutorial state will not persist across sessions.');
  } else {
    storageType = 'none';
    console.warn('Tutorial: No storage available. Tutorial state will not persist.');
  }
  return storageType;
};

/**
 * Get tutorial state from storage
 * Falls back to session storage if local storage is unavailable
 * Requirements: Error Handling - Handle local storage unavailable (fall back to session storage)
 */
const getStoredTutorialState = () => {
  const storage = getAvailableStorage();
  
  try {
    if (storage === 'localStorage') {
      const stored = localStorage.getItem(TUTORIAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate the stored state has expected properties
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed;
        }
        console.warn('Tutorial: Invalid stored state format, resetting');
        return null;
      }
    } else if (storage === 'sessionStorage') {
      const stored = sessionStorage.getItem(TUTORIAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed;
        }
        console.warn('Tutorial: Invalid stored state format, resetting');
        return null;
      }
    }
  } catch (error) {
    console.warn('Tutorial: Error reading stored state:', error.message);
  }
  return null;
};

/**
 * Save tutorial state to storage
 * Falls back to session storage if local storage is unavailable
 * Requirements: Error Handling - Handle local storage unavailable (fall back to session storage)
 */
const saveTutorialState = (state) => {
  const storage = getAvailableStorage();
  
  try {
    const stateString = JSON.stringify(state);
    
    if (storage === 'localStorage') {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, stateString);
    } else if (storage === 'sessionStorage') {
      sessionStorage.setItem(TUTORIAL_STORAGE_KEY, stateString);
    } else {
      console.warn('Tutorial: Unable to save state - no storage available');
    }
  } catch (error) {
    console.warn('Tutorial: Error saving state:', error.message);
  }
};

/**
 * Validate if a target element exists and has valid bounds
 * Requirements: Error Handling - Handle target element not found, Handle invalid getBoundingClientRect
 * @param {string} selector - CSS selector for the target element
 * @returns {{ element: Element|null, rect: DOMRect|null, isValid: boolean }}
 */
const validateTargetElement = (selector) => {
  if (!selector) {
    return { element: null, rect: null, isValid: true }; // No target is valid (centered modal)
  }

  try {
    const element = document.querySelector(selector);
    
    if (!element) {
      console.warn(`Tutorial: Target element not found for selector "${selector}"`);
      return { element: null, rect: null, isValid: false };
    }

    const rect = element.getBoundingClientRect();
    
    // Validate the rect has valid dimensions
    if (!rect || rect.width === 0 || rect.height === 0) {
      console.warn(`Tutorial: Target element "${selector}" has invalid dimensions (width: ${rect?.width}, height: ${rect?.height})`);
      return { element, rect: null, isValid: false };
    }

    // Check if element is within viewport bounds (not completely off-screen)
    const isInDocument = (
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 1000 &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth) + 1000
    );

    if (!isInDocument) {
      console.warn(`Tutorial: Target element "${selector}" is outside document bounds`);
      return { element, rect, isValid: false };
    }

    return { element, rect, isValid: true };
  } catch (error) {
    console.warn(`Tutorial: Error validating target element "${selector}":`, error.message);
    return { element: null, rect: null, isValid: false };
  }
};

/**
 * Find the next valid step index starting from a given index
 * Requirements: Error Handling - Handle target element not found (skip to next valid step)
 * @param {number} startIndex - Index to start searching from
 * @param {boolean} isMobile - Whether we're on mobile
 * @param {number} direction - 1 for forward, -1 for backward
 * @returns {number} - The next valid step index, or -1 if none found
 */
const findNextValidStep = (startIndex, isMobile, direction = 1) => {
  const maxSteps = TUTORIAL_STEPS.length;
  let currentIndex = startIndex;

  while (currentIndex >= 0 && currentIndex < maxSteps) {
    const step = TUTORIAL_STEPS[currentIndex];
    const targetSelector = getTargetSelector(step, isMobile);
    
    // Steps without targets (centered modals) are always valid
    if (!targetSelector) {
      return currentIndex;
    }

    const { isValid } = validateTargetElement(targetSelector);
    if (isValid) {
      return currentIndex;
    }

    console.warn(`Tutorial: Skipping step "${step.id}" - target element not found or invalid`);
    currentIndex += direction;
  }

  return -1; // No valid step found
};

/**
 * TutorialProvider Component
 * Provides tutorial state and methods to child components
 * Requirements: 7.2, 7.3, 7.4 - Mobile navigation handling
 */
export const TutorialProvider = ({ children, isSidebarOpen, onOpenSidebar, onCloseSidebar }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [hasSkipped, setHasSkipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPreparingStep, setIsPreparingStep] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load stored state on mount
  useEffect(() => {
    const storedState = getStoredTutorialState();
    if (storedState) {
      setHasCompleted(storedState.hasCompleted || false);
      setHasSkipped(storedState.hasSkipped || false);
    }
  }, []);

  /**
   * Scroll target element into view if off-screen
   * Requirements: 7.3 - Handle scroll into view for off-screen elements
   */
  const scrollTargetIntoView = useCallback((targetSelector) => {
    if (!targetSelector) return Promise.resolve();

    return new Promise((resolve) => {
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const isInViewport = (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );

        if (!isInViewport) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
          // Wait for scroll animation to complete
          setTimeout(resolve, 400);
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    });
  }, []);

  /**
   * Prepare step for display - handles sidebar opening and scrolling
   * Requirements: 7.4 - For sidebar items on mobile: open sidebar before highlighting
   */
  const prepareStepForDisplay = useCallback(async (stepIndex) => {
    const step = TUTORIAL_STEPS[stepIndex];
    if (!step) return;

    setIsPreparingStep(true);

    // Check if we need to open sidebar on mobile
    const needsSidebar = requiresSidebarForStep(step, isMobile);
    
    if (isMobile && needsSidebar && !isSidebarOpen && onOpenSidebar) {
      // Open sidebar and wait for animation
      onOpenSidebar();
      await new Promise(resolve => setTimeout(resolve, 300));
    } else if (isMobile && !needsSidebar && isSidebarOpen && onCloseSidebar) {
      // Close sidebar if not needed for this step
      onCloseSidebar();
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Get the appropriate target selector
    const targetSelector = getTargetSelector(step, isMobile);
    
    // Scroll target into view
    if (targetSelector) {
      await scrollTargetIntoView(targetSelector);
    }

    setIsPreparingStep(false);
  }, [isMobile, isSidebarOpen, onOpenSidebar, onCloseSidebar, scrollTargetIntoView]);

  // Get current step data with mobile-aware selectors
  const currentStepData = useMemo(() => {
    if (currentStep >= 0 && currentStep < TUTORIAL_STEPS.length) {
      const step = TUTORIAL_STEPS[currentStep];
      // Return step with computed mobile-aware properties
      return {
        ...step,
        // Computed target selector based on screen size
        computedTargetSelector: getTargetSelector(step, isMobile),
        // Computed position based on screen size
        computedPosition: getStepPosition(step, isMobile),
        // Whether sidebar is needed for this step
        computedRequiresSidebar: requiresSidebarForStep(step, isMobile)
      };
    }
    return null;
  }, [currentStep, isMobile]);

  /**
   * Skip the tutorial without completing
   * Persists skip state to prevent auto-trigger
   * Requirements: 1.2, 1.3
   */
  const skipTutorial = useCallback(() => {
    setIsActive(false);
    setHasSkipped(true);
    setCurrentStep(0);
    
    const newState = {
      hasCompleted: false,
      hasSkipped: true,
      skippedAt: new Date().toISOString()
    };
    saveTutorialState(newState);
  }, []);

  /**
   * Complete the tutorial successfully
   * Persists completion state to prevent auto-trigger
   * Requirements: 1.2, 1.3
   */
  const completeTutorial = useCallback(() => {
    setIsActive(false);
    setHasCompleted(true);
    setCurrentStep(0);
    
    const newState = {
      hasCompleted: true,
      hasSkipped: false,
      completedAt: new Date().toISOString()
    };
    saveTutorialState(newState);
  }, []);

  /**
   * Start the tutorial from the beginning
   * Requirements: 1.1
   * Requirements: Error Handling - Handle target element not found (skip to next valid step)
   */
  const startTutorial = useCallback(async () => {
    // Find the first valid step
    const firstValidIndex = findNextValidStep(0, isMobile, 1);
    
    if (firstValidIndex === -1) {
      console.warn('Tutorial: No valid steps found, cannot start tutorial');
      return;
    }

    setCurrentStep(firstValidIndex);
    setIsActive(true);
    // Prepare the first step
    await prepareStepForDisplay(firstValidIndex);
  }, [isMobile, prepareStepForDisplay]);

  /**
   * Advance to the next tutorial step
   * If on the last step, completes the tutorial
   * Requirements: 7.3, 7.4 - Handle mobile navigation
   * Requirements: Error Handling - Handle target element not found (skip to next valid step)
   */
  const nextStep = useCallback(async () => {
    if (currentStep < TOTAL_TUTORIAL_STEPS - 1) {
      // Find the next valid step (skipping steps with missing targets)
      const nextValidIndex = findNextValidStep(currentStep + 1, isMobile, 1);
      
      if (nextValidIndex === -1 || nextValidIndex >= TOTAL_TUTORIAL_STEPS) {
        // No more valid steps, complete the tutorial
        console.warn('Tutorial: No more valid steps found, completing tutorial');
        completeTutorial();
        return;
      }

      // Prepare the next step (sidebar, scroll)
      await prepareStepForDisplay(nextValidIndex);
      setCurrentStep(nextValidIndex);
    } else {
      // On last step, complete the tutorial
      completeTutorial();
    }
  }, [currentStep, isMobile, prepareStepForDisplay, completeTutorial]);

  /**
   * Go back to the previous tutorial step
   * Requirements: 7.3, 7.4 - Handle mobile navigation
   * Requirements: Error Handling - Handle target element not found (skip to next valid step)
   */
  const prevStep = useCallback(async () => {
    if (currentStep > 0) {
      // Find the previous valid step (skipping steps with missing targets)
      const prevValidIndex = findNextValidStep(currentStep - 1, isMobile, -1);
      
      if (prevValidIndex === -1 || prevValidIndex < 0) {
        // No previous valid steps, stay on current step
        console.warn('Tutorial: No previous valid steps found, staying on current step');
        return;
      }

      // Prepare the previous step (sidebar, scroll)
      await prepareStepForDisplay(prevValidIndex);
      setCurrentStep(prevValidIndex);
    }
  }, [currentStep, isMobile, prepareStepForDisplay]);

  /**
   * Restart the tutorial from the beginning
   * Clears completion/skip state
   * Requirements: 6.2, 6.3
   */
  const restartTutorial = useCallback(() => {
    setHasCompleted(false);
    setHasSkipped(false);
    setCurrentStep(0);
    setIsActive(true);
    
    // Clear stored state to allow fresh start
    const newState = {
      hasCompleted: false,
      hasSkipped: false,
      restartedAt: new Date().toISOString()
    };
    saveTutorialState(newState);
  }, []);

  /**
   * Check if tutorial should auto-trigger for first-time users
   * Requirements: 1.1, 1.2
   */
  const shouldAutoTrigger = useMemo(() => {
    return !hasCompleted && !hasSkipped;
  }, [hasCompleted, hasSkipped]);

  // Context value
  const value = useMemo(() => ({
    // State
    isActive,
    currentStep,
    totalSteps: TOTAL_TUTORIAL_STEPS,
    currentStepData,
    hasCompleted,
    hasSkipped,
    shouldAutoTrigger,
    isMobile,
    isPreparingStep,
    isSidebarOpen,
    
    // Methods
    startTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    completeTutorial,
    restartTutorial,
    scrollTargetIntoView,
    prepareStepForDisplay,
    
    // Utilities (for external use)
    validateTargetElement
  }), [
    isActive,
    currentStep,
    currentStepData,
    hasCompleted,
    hasSkipped,
    shouldAutoTrigger,
    isMobile,
    isPreparingStep,
    isSidebarOpen,
    startTutorial,
    nextStep,
    prevStep,
    skipTutorial,
    completeTutorial,
    restartTutorial,
    scrollTargetIntoView,
    prepareStepForDisplay
  ]);

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};

/**
 * Custom hook to access tutorial context
 * @returns {Object} Tutorial context value
 * @throws {Error} If used outside TutorialProvider
 */
export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

export default TutorialContext;
