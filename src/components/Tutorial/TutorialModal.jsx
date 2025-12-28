import { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import ProgressIndicator from "./ProgressIndicator";
import AnimatedPointer from "./AnimatedPointer";
import { MOBILE_BREAKPOINT } from "~/constants/tutorial";

/**
 * Custom hook to detect reduced motion preference
 * Requirements: 8.5 - Respect user's reduced-motion preferences
 */
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
};

/**
 * Custom hook for focus trap within modal
 * Implements Tab key cycling within modal elements
 * Requirements: 8.1, 8.4 - Keyboard navigation and focus trap
 */
const useFocusTrap = (modalRef, isVisible) => {
  useEffect(() => {
    if (!isVisible || !modalRef.current) return;

    const modal = modalRef.current;

    // Get all focusable elements within the modal
    const getFocusableElements = () => {
      return modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      );
    };

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab: move focus backward
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: move focus forward
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Add event listener for Tab key
    modal.addEventListener("keydown", handleKeyDown);

    return () => {
      modal.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalRef, isVisible]);
};

/**
 * TutorialModal Component
 * Professional modal dialog for tutorial steps
 * Supports both desktop positioned modals and mobile bottom sheet variant
 * Requirements: 3.1, 3.2, 4.1, 4.2, 4.3, 4.4, 7.1
 */
const TutorialModal = ({
  step,
  currentIndex,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  onComplete,
  targetSelector,
  isVisible,
}) => {
  const [position, setPosition] = useState({ top: "50%", left: "50%" });
  const [isMobile, setIsMobile] = useState(false);
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(false);
  const [modalRect, setModalRect] = useState(null);
  const [targetRect, setTargetRect] = useState(null);
  const modalRef = useRef(null);

  // Track step transitions for animation direction
  // Requirements: 3.7 - Smooth modal transitions between steps
  const [prevStepIndex, setPrevStepIndex] = useState(currentIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState("forward");

  // Check for reduced motion preference
  // Requirements: 8.5 - Respect reduced-motion preference
  const prefersReducedMotion = useReducedMotion();

  // Check for mobile viewport and very small screens
  // Requirements: 7.1 - Responsive modal positioning
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < MOBILE_BREAKPOINT);
      setIsVerySmallScreen(width < 400); // Very small screens get stacked buttons
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  /**
   * Track step changes for transition animations
   * Requirements: 3.7 - Smooth modal transitions between steps
   */
  useEffect(() => {
    if (currentIndex !== prevStepIndex && isVisible) {
      // Determine transition direction
      const direction = currentIndex > prevStepIndex ? "forward" : "backward";
      setTransitionDirection(direction);
      setIsTransitioning(true);

      // Reset transition state after animation completes
      const timer = setTimeout(
        () => {
          setIsTransitioning(false);
          setPrevStepIndex(currentIndex);
        },
        prefersReducedMotion ? 50 : 350
      ); // Shorter duration for reduced motion

      return () => clearTimeout(timer);
    }
  }, [currentIndex, prevStepIndex, isVisible, prefersReducedMotion]);

  /**
   * Get the effective target selector (mobile-aware)
   * Uses computedTargetSelector from step if available
   */
  const effectiveTargetSelector = step?.computedTargetSelector ?? targetSelector;

  /**
   * Get the effective position (mobile-aware)
   * Uses computedPosition from step if available
   */
  const effectivePosition = step?.computedPosition ?? step?.position ?? "center";

  /**
   * Calculate modal position relative to target element
   * Ensures modal doesn't overlap with the highlighted element
   * On mobile, uses bottom sheet positioning
   * Requirements: Error Handling - Handle invalid getBoundingClientRect (use center positioning)
   */
  const calculatePosition = useCallback(() => {
    // On mobile, always use bottom sheet positioning
    if (isMobile) {
      return {
        top: "auto",
        left: 0,
        right: 0,
        bottom: 0,
        transform: "none",
        position: "bottom-sheet",
      };
    }

    // Center positioning fallback
    const centerPosition = {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      position: "center",
    };

    if (!effectiveTargetSelector || !step) {
      // Center the modal if no target
      return centerPosition;
    }

    try {
      const targetElement = document.querySelector(effectiveTargetSelector);
      if (!targetElement) {
        console.warn(`Tutorial: Target element not found for positioning "${effectiveTargetSelector}", using center`);
        return centerPosition;
      }

      const targetRect = targetElement.getBoundingClientRect();

      // Validate the rect has valid dimensions
      // Requirements: Error Handling - Handle invalid getBoundingClientRect (use center positioning)
      if (!targetRect || targetRect.width === 0 || targetRect.height === 0) {
        console.warn(
          `Tutorial: Target element "${effectiveTargetSelector}" has invalid dimensions, using center positioning`
        );
        return centerPosition;
      }

      // Check for NaN or Infinity values
      if (
        !Number.isFinite(targetRect.top) ||
        !Number.isFinite(targetRect.left) ||
        !Number.isFinite(targetRect.right) ||
        !Number.isFinite(targetRect.bottom)
      ) {
        console.warn(
          `Tutorial: Target element "${effectiveTargetSelector}" has invalid rect values, using center positioning`
        );
        return centerPosition;
      }

      const modalWidth = 360;
      const modalHeight = 220; // Approximate height
      const padding = 20;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Determine best position based on step.position preference
      const preferredPosition = effectivePosition;
      let calculatedPosition = {};

      switch (preferredPosition) {
        case "right":
          calculatedPosition = {
            top: Math.max(padding, Math.min(targetRect.top, viewportHeight - modalHeight - padding)),
            left: Math.min(targetRect.right + padding, viewportWidth - modalWidth - padding),
            transform: "none",
            position: "right",
          };
          break;

        case "left":
          calculatedPosition = {
            top: Math.max(padding, Math.min(targetRect.top, viewportHeight - modalHeight - padding)),
            left: Math.max(padding, targetRect.left - modalWidth - padding),
            transform: "none",
            position: "left",
          };
          break;

        case "bottom":
          calculatedPosition = {
            top: Math.min(targetRect.bottom + padding, viewportHeight - modalHeight - padding),
            left: Math.max(padding, Math.min(targetRect.left, viewportWidth - modalWidth - padding)),
            transform: "none",
            position: "bottom",
          };
          break;

        case "top":
          calculatedPosition = {
            top: Math.max(padding, targetRect.top - modalHeight - padding),
            left: Math.max(padding, Math.min(targetRect.left, viewportWidth - modalWidth - padding)),
            transform: "none",
            position: "top",
          };
          break;

        default: // center
          calculatedPosition = centerPosition;
      }

      // Final validation - ensure calculated values are valid numbers
      if (typeof calculatedPosition.top === "number" && !Number.isFinite(calculatedPosition.top)) {
        console.warn("Tutorial: Calculated invalid top position, using center");
        return centerPosition;
      }
      if (typeof calculatedPosition.left === "number" && !Number.isFinite(calculatedPosition.left)) {
        console.warn("Tutorial: Calculated invalid left position, using center");
        return centerPosition;
      }

      return calculatedPosition;
    } catch (error) {
      console.warn(`Tutorial: Error calculating position for "${effectiveTargetSelector}":`, error.message);
      return centerPosition;
    }
  }, [effectiveTargetSelector, step, isMobile, effectivePosition]);

  // Update position when target or step changes
  useEffect(() => {
    if (isVisible) {
      const newPosition = calculatePosition();
      setPosition(newPosition);

      // Update target rect for AnimatedPointer
      if (effectiveTargetSelector) {
        const targetElement = document.querySelector(effectiveTargetSelector);
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          setTargetRect({
            top: rect.top,
            left: rect.left,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
          });
        } else {
          setTargetRect(null);
        }
      } else {
        setTargetRect(null);
      }

      // Recalculate on scroll/resize
      const handleUpdate = () => {
        const updatedPosition = calculatePosition();
        setPosition(updatedPosition);

        // Update target rect
        if (effectiveTargetSelector) {
          const targetElement = document.querySelector(effectiveTargetSelector);
          if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            setTargetRect({
              top: rect.top,
              left: rect.left,
              right: rect.right,
              bottom: rect.bottom,
              width: rect.width,
              height: rect.height,
            });
          }
        }
      };

      window.addEventListener("scroll", handleUpdate, true);
      window.addEventListener("resize", handleUpdate);

      return () => {
        window.removeEventListener("scroll", handleUpdate, true);
        window.removeEventListener("resize", handleUpdate);
      };
    }
  }, [isVisible, calculatePosition, effectiveTargetSelector]);

  // Update modal rect after render for AnimatedPointer
  useEffect(() => {
    if (isVisible && modalRef.current) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        if (modalRef.current) {
          const rect = modalRef.current.getBoundingClientRect();
          setModalRect({
            top: rect.top,
            left: rect.left,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
          });
        }
      });
    }
  }, [isVisible, position, currentIndex]);

  // Use focus trap hook for Tab key cycling
  // Requirements: 8.1, 8.4 - Implement Tab key cycling within modal (focus trap)
  useFocusTrap(modalRef, isVisible);

  // Store reference to previously focused element to restore focus on close
  const previouslyFocusedElement = useRef(null);

  // Focus management - focus first interactive element when modal opens
  // Requirements: 8.1 - Keyboard navigation support
  useEffect(() => {
    if (isVisible && modalRef.current) {
      // Store the currently focused element to restore later
      previouslyFocusedElement.current = document.activeElement;

      // Focus the first focusable element in the modal
      const focusableElements = modalRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      );

      if (focusableElements.length > 0) {
        // Small delay to ensure modal is fully rendered
        requestAnimationFrame(() => {
          focusableElements[0].focus();
        });
      }
    }

    // Restore focus when modal closes
    return () => {
      if (!isVisible && previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isVisible, currentIndex]);

  // Handle keyboard navigation
  // Requirements: 8.1 - Implement Enter key to activate focused button, Escape key to trigger skip confirmation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isVisible) return;

      switch (e.key) {
        case "Escape":
          // Escape key triggers skip confirmation
          e.preventDefault();
          e.stopPropagation();
          onSkip?.();
          break;
        case "Enter":
          // Enter key activates the focused button (handled natively by buttons)
          // This is here for documentation - buttons handle Enter natively
          break;
        case "ArrowRight":
          // Optional: Arrow right to go to next step
          if (!e.target.matches("input, textarea, select")) {
            e.preventDefault();
            if (currentIndex < totalSteps - 1) {
              onNext?.();
            } else {
              onComplete?.();
            }
          }
          break;
        case "ArrowLeft":
          // Optional: Arrow left to go to previous step
          if (!e.target.matches("input, textarea, select") && currentIndex > 0) {
            e.preventDefault();
            onPrev?.();
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, onSkip, onNext, onPrev, onComplete, currentIndex, totalSteps]);

  if (!isVisible || !step) {
    return null;
  }

  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === totalSteps - 1;

  /**
   * Mobile bottom sheet styles
   * Requirements: 7.1 - Bottom sheet styling with rounded top corners
   */
  const mobileStyles = isMobile
    ? {
        position: "fixed",
        // Position above the bottom nav (64px height)
        bottom: 0,
        left: 0,
        right: 0,
        top: "auto",
        transform: "none",
        borderRadius: "20px 20px 0 0",
        maxHeight: "50vh",
        width: "100%",
        margin: 0,
        overflowY: "auto",
        // Safe area padding for devices with home indicators
        paddingBottom: "env(safe-area-inset-bottom, 16px)",
      }
    : {};

  // Desktop positioned styles
  const desktopStyles = !isMobile
    ? {
        position: "fixed",
        top: typeof position.top === "number" ? `${position.top}px` : position.top,
        left: typeof position.left === "number" ? `${position.left}px` : position.left,
        transform: position.transform || "none",
        maxWidth: "360px",
        width: "100%",
      }
    : {};

  /**
   * Determine pointer direction based on modal position
   * For mobile bottom sheet, pointer should point upward to target
   * Requirements: 7.2 - Adjust pointer direction for mobile
   */
  const pointerDirection = isMobile ? "top" : step?.position || "center";

  return (
    <>
      {/* Animated Pointer - only show on desktop when there's a target */}
      {!isMobile && targetRect && modalRect && pointerDirection !== "center" && (
        <AnimatedPointer fromRect={modalRect} toRect={targetRect} direction={pointerDirection} />
      )}

      {/* 
        Requirements: 8.2 - Add ARIA attributes for screen readers
        - role="dialog" identifies this as a dialog
        - aria-modal="true" indicates it's a modal dialog
        - aria-labelledby points to the title element
        - aria-describedby points to the description
      */}
      {/* 
        Requirements: 3.7 - Smooth modal position transitions between steps
        Requirements: 8.5 - Respect reduced-motion preference
      */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-modal-title"
        aria-describedby="tutorial-modal-description"
        aria-live="polite"
        aria-atomic="true"
        tabIndex={-1}
        className={`
          bg-white shadow-2xl z-[9999]
          ${
            isMobile ? "rounded-t-2xl tutorial-bottom-sheet" : `rounded-xl ${!isTransitioning ? "animate-fade-in" : ""}`
          }
          ${!prefersReducedMotion && !isMobile ? "tutorial-modal-transitioning" : ""}
        `}
        style={{
          ...desktopStyles,
          ...mobileStyles,
          boxShadow: isMobile ? "0 -10px 40px rgba(0, 0, 0, 0.15)" : "0 20px 40px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Visually hidden live region for screen reader announcements */}
        {/* Requirements: 8.2 - Accessibility for screen readers */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {`Tutorial step ${currentIndex + 1} of ${totalSteps}: ${step.title}`}
        </div>

        {/* Mobile drag handle - visual affordance for bottom sheet */}
        {/* Requirements: 7.1 - Add drag handle for visual affordance */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" aria-hidden="true" />
          </div>
        )}

        {/* 
        Header and Body with step transition animations
        Requirements: 3.7 - Animate smoothly when transitioning between steps
      */}
        <div
          key={`step-content-${currentIndex}`}
          className={`
          ${
            isTransitioning && !prefersReducedMotion
              ? transitionDirection === "forward"
                ? "tutorial-step-content-enter"
                : "tutorial-step-content-enter-reverse"
              : ""
          }
        `}
        >
          {/* Header */}
          <div className={`flex items-start justify-between ${isMobile ? "px-5 pt-2 pb-1" : "px-6 pt-5 pb-2"}`}>
            <h2
              id="tutorial-modal-title"
              className={`font-bold text-gray-900 pr-4 ${isMobile ? "text-base" : "text-lg"}`}
            >
              {step.title}
            </h2>
            <button
              onClick={onSkip}
              className={`text-gray-500 hover:text-gray-700 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                       focus:bg-blue-50 rounded px-2 py-1 -mr-2 -mt-1
                       ${isMobile ? "text-xs" : "text-sm"}`}
              aria-label="Skip tutorial"
            >
              Skip
            </button>
          </div>

          {/* Body */}
          <div className={`${isMobile ? "px-5 py-2" : "px-6 py-3"}`}>
            <p
              id="tutorial-modal-description"
              className={`text-gray-600 leading-relaxed ${isMobile ? "text-sm" : "text-sm"}`}
            >
              {step.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`
        ${isMobile ? "px-5 pb-4 pt-2" : "px-6 pb-5 pt-3"}
      `}
        >
          {/* Progress Indicator */}
          <div className={`${isMobile ? "mb-3" : "mb-4"}`}>
            <ProgressIndicator currentStep={currentIndex} totalSteps={totalSteps} />
          </div>

          {/* Navigation Buttons */}
          {/* Requirements: 7.1 - Adjust button layout for mobile (side by side on mobile) */}
          <div className="flex gap-3 flex-row">
            {/* Back Button - only show if not first step */}
            {/* Requirements: 8.1, 8.4 - Add visible focus indicators on all interactive elements */}
            {!isFirstStep ? (
              <button
                onClick={onPrev}
                className={`
                px-4 py-2.5 font-medium text-gray-700 
                bg-white border border-gray-300 rounded-lg
                hover:bg-gray-50 hover:border-gray-400
                active:bg-gray-100
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                focus:border-blue-500 focus:bg-blue-50
                transition-all duration-200
                ${isMobile ? "flex-1 text-sm min-h-[40px]" : "text-sm"}
              `}
                aria-label="Go to previous step"
              >
                Back
              </button>
            ) : (
              // Spacer for alignment when Back button is hidden
              <div className={isMobile ? "flex-1" : ""} />
            )}

            {/* Next/Complete Button */}
            {/* Requirements: 8.1, 8.4 - Add visible focus indicators on all interactive elements */}
            <button
              onClick={isLastStep ? onComplete : onNext}
              className={`
              px-6 py-2.5 font-medium text-white 
              bg-primary rounded-lg
              hover:bg-primary/90
              active:bg-primary/80
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              focus:ring-offset-white
              transition-all duration-200
              ${isMobile ? "flex-1 text-sm min-h-[40px]" : "text-sm"}
            `}
              aria-label={isLastStep ? "Complete tutorial and start using the dashboard" : "Go to next step"}
            >
              {isLastStep ? "Get Started" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

TutorialModal.propTypes = {
  /** Current tutorial step data */
  step: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    targetSelector: PropTypes.string,
    position: PropTypes.oneOf(["top", "bottom", "left", "right", "center"]),
    route: PropTypes.string,
    requiresSidebar: PropTypes.bool,
  }),
  /** Current step index (0-based) */
  currentIndex: PropTypes.number.isRequired,
  /** Total number of steps */
  totalSteps: PropTypes.number.isRequired,
  /** Callback for next button */
  onNext: PropTypes.func.isRequired,
  /** Callback for back button */
  onPrev: PropTypes.func.isRequired,
  /** Callback for skip action */
  onSkip: PropTypes.func.isRequired,
  /** Callback for completing the tutorial */
  onComplete: PropTypes.func.isRequired,
  /** CSS selector for the target element */
  targetSelector: PropTypes.string,
  /** Whether the modal is visible */
  isVisible: PropTypes.bool.isRequired,
};

TutorialModal.defaultProps = {
  step: null,
  targetSelector: null,
};

export default TutorialModal;
