import { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * SkipConfirmationDialog Component
 * Confirmation modal for skip/exit actions during the tutorial
 * Shows when user clicks outside, presses Escape, or clicks Skip
 * Provides "Continue Tutorial" and "Skip Tutorial" options
 * Requirements: 4.5
 */
const SkipConfirmationDialog = ({
  isVisible,
  onContinue,
  onSkip,
  title = 'Skip Tutorial?',
  description = "Are you sure you want to skip the tutorial? You can restart it anytime from your Profile settings."
}) => {
  const dialogRef = useRef(null);
  const continueButtonRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  /**
   * Focus trap implementation
   * Cycles focus within the dialog when Tab is pressed
   * Requirements: 8.1, 8.4 - Keyboard navigation and focus trap
   */
  const handleKeyDown = useCallback((e) => {
    if (!isVisible) return;

    if (e.key === 'Escape') {
      // Escape key continues the tutorial (closes confirmation)
      e.preventDefault();
      e.stopPropagation();
      onContinue?.();
      return;
    }

    if (e.key === 'Tab' && dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: move focus backward
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
    }
  }, [isVisible, onContinue]);

  // Add keyboard event listener
  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, handleKeyDown]);

  // Focus management - focus Continue button when dialog opens
  useEffect(() => {
    if (isVisible) {
      // Store the currently focused element to restore later
      previouslyFocusedElement.current = document.activeElement;

      // Focus the Continue button (safer option) after a brief delay
      requestAnimationFrame(() => {
        continueButtonRef.current?.focus();
      });
    } else {
      // Restore focus when dialog closes
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
        previouslyFocusedElement.current = null;
      }
    }
  }, [isVisible]);

  /**
   * Handle backdrop click - clicking outside the dialog continues the tutorial
   */
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onContinue?.();
    }
  }, [onContinue]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={handleBackdropClick}
      role="presentation"
    >
      {/* 
        Requirements: 8.2 - ARIA attributes for screen readers
        - role="alertdialog" for important confirmation dialogs
        - aria-modal="true" indicates it's a modal dialog
        - aria-labelledby points to the title element
        - aria-describedby points to the description
      */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="skip-confirmation-title"
        aria-describedby="skip-confirmation-description"
        className="bg-white rounded-xl shadow-2xl p-6 mx-4 max-w-sm w-full animate-scale-in"
        style={{
          animation: 'scaleIn 0.2s ease-out'
        }}
      >
        {/* Title */}
        <h3
          id="skip-confirmation-title"
          className="text-lg font-bold text-gray-900 mb-2"
        >
          {title}
        </h3>

        {/* Description */}
        <p
          id="skip-confirmation-description"
          className="text-sm text-gray-600 mb-6 leading-relaxed"
        >
          {description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Continue Tutorial Button - Primary action (safer choice) */}
          <button
            ref={continueButtonRef}
            onClick={onContinue}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 
                     bg-white border border-gray-300 rounded-lg
                     hover:bg-gray-50 hover:border-gray-400
                     active:bg-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     focus:border-blue-500 focus:bg-blue-50
                     transition-all duration-200"
            aria-label="Continue with the tutorial"
          >
            Continue Tutorial
          </button>

          {/* Skip Tutorial Button - Destructive action */}
          <button
            onClick={onSkip}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white 
                     bg-blue-600 rounded-lg
                     hover:bg-blue-700
                     active:bg-blue-800
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     transition-all duration-200"
            aria-label="Skip the tutorial and close it"
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};

SkipConfirmationDialog.propTypes = {
  /** Whether the dialog is visible */
  isVisible: PropTypes.bool.isRequired,
  /** Callback when user chooses to continue the tutorial */
  onContinue: PropTypes.func.isRequired,
  /** Callback when user confirms skipping the tutorial */
  onSkip: PropTypes.func.isRequired,
  /** Dialog title */
  title: PropTypes.string,
  /** Dialog description */
  description: PropTypes.string
};

export default SkipConfirmationDialog;
