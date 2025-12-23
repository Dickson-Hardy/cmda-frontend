import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * AnimatedPointer Component
 * SVG-based curved arrow that points from the modal to the highlighted element
 * Requirements: 3.4, 3.5, 8.5
 */
const AnimatedPointer = ({ 
  fromRect, 
  toRect, 
  direction,
  color = '#2563EB' // Primary blue color
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference (Requirements 8.5)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  /**
   * Calculate the SVG path and positioning for the curved arrow
   * Based on the direction and positions of modal and target
   */
  const pointerConfig = useMemo(() => {
    if (!fromRect || !toRect) {
      return null;
    }

    // Calculate center points
    const fromCenterX = fromRect.left + fromRect.width / 2;
    const fromCenterY = fromRect.top + fromRect.height / 2;
    const toCenterX = toRect.left + toRect.width / 2;
    const toCenterY = toRect.top + toRect.height / 2;

    // Determine start and end points based on direction
    let startX, startY, endX, endY;
    let controlX, controlY; // Control point for the curve

    switch (direction) {
      case 'right':
        // Modal is to the right of target, arrow points left
        startX = fromRect.left;
        startY = fromCenterY;
        endX = toRect.right + 8;
        endY = toCenterY;
        controlX = (startX + endX) / 2;
        controlY = startY + (endY - startY) * 0.3;
        break;

      case 'left':
        // Modal is to the left of target, arrow points right
        startX = fromRect.right;
        startY = fromCenterY;
        endX = toRect.left - 8;
        endY = toCenterY;
        controlX = (startX + endX) / 2;
        controlY = startY + (endY - startY) * 0.3;
        break;

      case 'bottom':
        // Modal is below target, arrow points up
        startX = fromCenterX;
        startY = fromRect.top;
        endX = toCenterX;
        endY = toRect.bottom + 8;
        controlX = startX + (endX - startX) * 0.3;
        controlY = (startY + endY) / 2;
        break;

      case 'top':
        // Modal is above target, arrow points down
        startX = fromCenterX;
        startY = fromRect.bottom;
        endX = toCenterX;
        endY = toRect.top - 8;
        controlX = startX + (endX - startX) * 0.3;
        controlY = (startY + endY) / 2;
        break;

      default:
        // Center - no pointer needed
        return null;
    }

    // Calculate SVG viewBox dimensions
    const minX = Math.min(startX, endX, controlX) - 20;
    const minY = Math.min(startY, endY, controlY) - 20;
    const maxX = Math.max(startX, endX, controlX) + 20;
    const maxY = Math.max(startY, endY, controlY) + 20;
    const width = maxX - minX;
    const height = maxY - minY;

    // Normalize coordinates to SVG viewBox
    const normStartX = startX - minX;
    const normStartY = startY - minY;
    const normEndX = endX - minX;
    const normEndY = endY - minY;
    const normControlX = controlX - minX;
    const normControlY = controlY - minY;

    // Calculate arrowhead rotation angle
    const angle = Math.atan2(normEndY - normControlY, normEndX - normControlX) * (180 / Math.PI);

    return {
      viewBox: `0 0 ${width} ${height}`,
      width,
      height,
      left: minX,
      top: minY,
      path: `M ${normStartX} ${normStartY} Q ${normControlX} ${normControlY} ${normEndX} ${normEndY}`,
      arrowX: normEndX,
      arrowY: normEndY,
      arrowRotation: angle
    };
  }, [fromRect, toRect, direction]);

  // Don't render if no valid configuration or center position
  if (!pointerConfig || direction === 'center') {
    return null;
  }

  const { viewBox, width, height, left, top, path, arrowX, arrowY, arrowRotation } = pointerConfig;

  return (
    <svg
      className={`animated-pointer ${prefersReducedMotion ? '' : 'animate-pulse-pointer'}`}
      style={{
        position: 'fixed',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'visible'
      }}
      viewBox={viewBox}
      aria-hidden="true"
    >
      {/* Define the pulsing animation */}
      <defs>
        <style>
          {`
            @keyframes pulsePointer {
              0%, 100% {
                transform: scale(1);
                opacity: 0.7;
              }
              50% {
                transform: scale(1.1);
                opacity: 1;
              }
            }
            
            .animate-pulse-pointer {
              animation: pulsePointer 1.5s ease-in-out infinite;
              transform-origin: center;
            }
            
            @media (prefers-reduced-motion: reduce) {
              .animate-pulse-pointer {
                animation: none;
                opacity: 1;
                transform: scale(1);
              }
            }
          `}
        </style>
      </defs>

      {/* Curved path */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="none"
      />

      {/* Arrowhead */}
      <polygon
        points="0,-6 12,0 0,6"
        fill={color}
        transform={`translate(${arrowX}, ${arrowY}) rotate(${arrowRotation})`}
      />
    </svg>
  );
};

AnimatedPointer.propTypes = {
  /** Bounding rectangle of the modal (source) */
  fromRect: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
  /** Bounding rectangle of the target element (destination) */
  toRect: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
  /** Direction the pointer should point */
  direction: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'center']),
  /** Color of the pointer (default: primary blue) */
  color: PropTypes.string
};

AnimatedPointer.defaultProps = {
  fromRect: null,
  toRect: null,
  direction: 'right',
  color: '#2563EB'
};

export default AnimatedPointer;
