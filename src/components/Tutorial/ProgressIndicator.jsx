import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Custom hook to detect reduced motion preference
 * Requirements: 8.5 - Respect user's reduced-motion preferences
 */
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

/**
 * ProgressIndicator Component
 * Shows tutorial progress with step dots
 * Requirements: 5.1, 5.2, 5.3, 5.4, 8.2 (ARIA accessibility)
 */
const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <nav 
      className="flex items-center justify-center gap-2"
      role="navigation"
      aria-label={`Tutorial progress: Step ${currentStep + 1} of ${totalSteps}`}
    >
      {/* Screen reader only text for progress */}
      <span className="sr-only">
        {`Progress: ${Math.round(((currentStep + 1) / totalSteps) * 100)}% complete`}
      </span>
      
      {/* Visual progress dots */}
      <div 
        className="flex items-center justify-center gap-2"
        role="list"
        aria-label="Tutorial steps"
      >
        {Array.from({ length: totalSteps }, (_, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          // Determine the status for screen readers
          let stepStatus = 'upcoming';
          if (isCompleted) stepStatus = 'completed';
          if (isCurrent) stepStatus = 'current';

          return (
            <div
              key={index}
              role="listitem"
              className={`
                w-2 h-2 rounded-full
                ${isCurrent ? 'bg-blue-600 scale-125' : ''}
                ${isCompleted ? 'bg-blue-600' : ''}
                ${isUpcoming ? 'bg-gray-300 border border-gray-400' : ''}
              `}
              style={{
                // Ensure consistent sizing
                minWidth: '8px',
                minHeight: '8px',
                // Requirements: 5.4 - Animate transition smoothly
                // Requirements: 8.5 - Respect reduced-motion preference
                transition: prefersReducedMotion 
                  ? 'none' 
                  : 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.25s ease-in-out, border-color 0.25s ease-in-out'
              }}
              aria-label={`Step ${index + 1}: ${stepStatus}`}
              aria-current={isCurrent ? 'step' : undefined}
            />
          );
        })}
      </div>
    </nav>
  );
};

ProgressIndicator.propTypes = {
  /** Current step index (0-based) */
  currentStep: PropTypes.number.isRequired,
  /** Total number of steps */
  totalSteps: PropTypes.number.isRequired
};

export default ProgressIndicator;
