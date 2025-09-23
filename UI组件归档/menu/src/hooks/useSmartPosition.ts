import { useState, useEffect, useRef, RefObject } from 'react';

type Position = 'top' | 'bottom' | 'left' | 'right';
type Alignment = 'start' | 'center' | 'end';

interface PositionResult {
  side: Position;
  align: Alignment;
  sideOffset: number;
}

interface UseSmartPositionOptions {
  defaultSide?: Position;
  defaultAlign?: Alignment;
  menuWidth?: number;
  menuHeight?: number;
  offset?: number;
  padding?: number; // Minimum distance from viewport edge
}

export function useSmartPosition(
  triggerRef: RefObject<HTMLElement>,
  isOpen: boolean,
  options: UseSmartPositionOptions = {}
): PositionResult {
  const {
    defaultSide = 'bottom',
    defaultAlign = 'start',
    menuWidth = 280,
    menuHeight = 400,
    offset = 5,
    padding = 20
  } = options;

  const [position, setPosition] = useState<PositionResult>({
    side: defaultSide,
    align: defaultAlign,
    sideOffset: offset
  });

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const calculateBestPosition = () => {
      const trigger = triggerRef.current!;
      const rect = trigger.getBoundingClientRect();

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate available space in each direction
      const spaceTop = rect.top - padding;
      const spaceBottom = viewportHeight - rect.bottom - padding;
      const spaceLeft = rect.left - padding;
      const spaceRight = viewportWidth - rect.right - padding;

      // Determine best side based on available space
      let bestSide: Position = defaultSide;
      let bestAlign: Alignment = defaultAlign;

      // For right edge: show menu on left
      if (rect.right > viewportWidth - menuWidth - padding) {
        if (spaceLeft >= menuWidth) {
          bestSide = 'left';
          bestAlign = 'start';
        } else if (spaceBottom >= menuHeight) {
          bestSide = 'bottom';
          bestAlign = 'end';
        } else if (spaceTop >= menuHeight) {
          bestSide = 'top';
          bestAlign = 'end';
        } else {
          // Force left with scroll if needed
          bestSide = 'left';
          bestAlign = 'start';
        }
      }
      // For left edge: show menu on right
      else if (rect.left < menuWidth + padding) {
        if (spaceRight >= menuWidth) {
          bestSide = 'right';
          bestAlign = 'start';
        } else if (spaceBottom >= menuHeight) {
          bestSide = 'bottom';
          bestAlign = 'start';
        } else if (spaceTop >= menuHeight) {
          bestSide = 'top';
          bestAlign = 'start';
        } else {
          // Force right with scroll if needed
          bestSide = 'right';
          bestAlign = 'start';
        }
      }
      // For bottom edge: show menu on top
      else if (rect.bottom > viewportHeight - menuHeight - padding) {
        bestSide = 'top';
        // Check horizontal space
        if (rect.left + menuWidth > viewportWidth - padding) {
          bestAlign = 'end';
        } else {
          bestAlign = 'start';
        }
      }
      // For top edge: show menu on bottom
      else if (rect.top < menuHeight + padding) {
        bestSide = 'bottom';
        // Check horizontal space
        if (rect.left + menuWidth > viewportWidth - padding) {
          bestAlign = 'end';
        } else {
          bestAlign = 'start';
        }
      }
      // Default: try bottom first
      else {
        if (spaceBottom >= menuHeight) {
          bestSide = 'bottom';
          if (rect.left + menuWidth > viewportWidth - padding) {
            bestAlign = 'end';
          } else {
            bestAlign = 'start';
          }
        } else if (spaceTop >= menuHeight) {
          bestSide = 'top';
          if (rect.left + menuWidth > viewportWidth - padding) {
            bestAlign = 'end';
          } else {
            bestAlign = 'start';
          }
        } else if (spaceRight >= menuWidth) {
          bestSide = 'right';
          bestAlign = 'start';
        } else {
          bestSide = 'left';
          bestAlign = 'start';
        }
      }

      setPosition({
        side: bestSide,
        align: bestAlign,
        sideOffset: offset
      });
    };

    // Calculate immediately
    calculateBestPosition();

    // Recalculate on scroll or resize
    const handleRecalculate = () => {
      requestAnimationFrame(calculateBestPosition);
    };

    window.addEventListener('scroll', handleRecalculate, true);
    window.addEventListener('resize', handleRecalculate);

    return () => {
      window.removeEventListener('scroll', handleRecalculate, true);
      window.removeEventListener('resize', handleRecalculate);
    };
  }, [isOpen, triggerRef, defaultSide, defaultAlign, menuWidth, menuHeight, offset, padding]);

  return position;
}