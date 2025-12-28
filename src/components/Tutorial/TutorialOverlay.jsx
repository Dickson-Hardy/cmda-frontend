import { useEffect, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
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
 * TutorialOverlay Component
 * Creates a full-screen overlay with spotlight effect on the target element
 * Requirements: 2.2, 4.5, 3.6 - Smooth fade-in transition for spotlight
 */
const TutorialOverlay = ({ targetSelector, isVisible, onClickOutside, padding = 8 }) => {
  const [targetRect, setTargetRect] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const overlayRef = useRef(null);
  const prevTargetSelector = useRef(targetSelector);

  // Check for reduced motion preference
  // Requirements: 8.5 - Respect reduced-motion preference
  const prefersReducedMotion = useReducedMotion();

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /**
   * Calculate and update target element position
   * Uses getBoundingClientRect for accurate positioning
   * Requirements: Error Handling - Handle invalid getBoundingClientRect (use center positioning)
   */
  const updateTargetPosition = useCallback(() => {
    if (!targetSelector) {
      setTargetRect(null);
      return;
    }

    try {
      const targetElement = document.querySelector(targetSelector);

      if (!targetElement) {
        console.warn(`Tutorial: Target element not found for selector "${targetSelector}"`);
        setTargetRect(null);
        return;
      }

      const rect = targetElement.getBoundingClientRect();

      // Validate the rect has valid dimensions
      // Requirements: Error Handling - Handle invalid getBoundingClientRect
      if (!rect || rect.width === 0 || rect.height === 0) {
        console.warn(`Tutorial: Target element "${targetSelector}" has invalid dimensions, using center positioning`);
        setTargetRect(null);
        return;
      }

      // Check for NaN or Infinity values
      if (
        !Number.isFinite(rect.top) ||
        !Number.isFinite(rect.left) ||
        !Number.isFinite(rect.width) ||
        !Number.isFinite(rect.height)
      ) {
        console.warn(`Tutorial: Target element "${targetSelector}" has invalid rect values, using center positioning`);
        setTargetRect(null);
        return;
      }

      // Add padding around the spotlight
      setTargetRect({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        // Store original rect for reference
        originalRect: rect,
      });
    } catch (error) {
      console.warn(`Tutorial: Error getting target element bounds for "${targetSelector}":`, error.message);
      setTargetRect(null);
    }
  }, [targetSelector, padding]);

  // Update position on mount and when target changes
  useEffect(() => {
    if (isVisible) {
      updateTargetPosition();

      // Update position on scroll and resize
      window.addEventListener("scroll", updateTargetPosition, true);
      window.addEventListener("resize", updateTargetPosition);

      return () => {
        window.removeEventListener("scroll", updateTargetPosition, true);
        window.removeEventListener("resize", updateTargetPosition);
      };
    }
  }, [isVisible, updateTargetPosition]);

  /**
   * Track target selector changes for spotlight transition animation
   * Requirements: 3.6 - Smooth fade-in transition for spotlight
   */
  useEffect(() => {
    if (targetSelector !== prevTargetSelector.current && isVisible) {
      // Reset transition state after animation completes
      const timer = setTimeout(
        () => {
          prevTargetSelector.current = targetSelector;
        },
        prefersReducedMotion ? 50 : 350
      );

      return () => clearTimeout(timer);
    }
  }, [targetSelector, isVisible, prefersReducedMotion]);

  /**
   * Handle click on overlay (outside the spotlight)
   * Triggers skip confirmation per Requirements 4.5
   */
  const handleOverlayClick = useCallback(
    (e) => {
      // Only trigger if clicking directly on the overlay, not on children
      if (e.target === overlayRef.current && onClickOutside) {
        onClickOutside();
      }
    },
    [onClickOutside]
  );

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  /**
   * Generate clip-path for spotlight cutout effect
   * Creates a polygon that covers the entire screen except the target area
   */
  const generateClipPath = () => {
    if (!targetRect) {
      // No target - full overlay without cutout
      return "none";
    }

    const { top, left, width, height } = targetRect;
    const right = left + width;
    const bottom = top + height;

    // Create a clip-path polygon that excludes the target area
    // This creates a "frame" effect around the spotlight
    return `polygon(
      0% 0%,
      0% 100%,
      ${left}px 100%,
      ${left}px ${top}px,
      ${right}px ${top}px,
      ${right}px ${bottom}px,
      ${left}px ${bottom}px,
      ${left}px 100%,
      100% 100%,
      100% 0%
    )`;
  };

  return (
    <div
      ref={overlayRef}
      className={`tutorial-overlay ${!prefersReducedMotion ? "tutorial-overlay-transitioning" : ""}`}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        // Full screen overlay on all devices
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9998,
        clipPath: generateClipPath(),
        // Requirements: 3.6 - Smooth fade-in transition for spotlight
        // Transition is handled by CSS class for better performance
        opacity: isVisible ? 1 : 0,
        pointerEvents: targetRect ? "auto" : "none",
      }}
      aria-hidden="true"
    />
  );
};

TutorialOverlay.propTypes = {
  /** CSS selector for the target element to highlight */
  targetSelector: PropTypes.string,
  /** Whether the overlay is visible */
  isVisible: PropTypes.bool.isRequired,
  /** Callback when user clicks outside the spotlight */
  onClickOutside: PropTypes.func,
  /** Padding around the spotlight cutout in pixels */
  padding: PropTypes.number,
};

TutorialOverlay.defaultProps = {
  targetSelector: null,
  onClickOutside: null,
  padding: 8,
};

export default TutorialOverlay;
