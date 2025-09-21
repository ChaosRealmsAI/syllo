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
    padding = 10
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

      // Priority: bottom > top > right > left
      if (defaultSide === 'bottom' || defaultSide === 'top') {
        // Vertical positioning
        if (spaceBottom >= menuHeight || spaceBottom > spaceTop) {
          bestSide = 'bottom';
        } else {
          bestSide = 'top';
        }

        // Check horizontal alignment
        if (rect.left + menuWidth > viewportWidth - padding) {
          // Not enough space on the right
          if (rect.right - menuWidth > padding) {
            bestAlign = 'end';
          } else {
            bestAlign = 'center';
          }
        } else {
          bestAlign = 'start';
        }
      } else {
        // Horizontal positioning
        if (spaceRight >= menuWidth || spaceRight > spaceLeft) {
          bestSide = 'right';
        } else {
          bestSide = 'left';
        }

        // Check vertical alignment
        if (rect.top + menuHeight > viewportHeight - padding) {
          // Not enough space on the bottom
          if (rect.bottom - menuHeight > padding) {
            bestAlign = 'end';
          } else {
            bestAlign = 'center';
          }
        } else {
          bestAlign = 'start';
        }
      }

      // If still doesn't fit, try opposite axis
      if (bestSide === 'bottom' && spaceBottom < menuHeight / 2) {
        if (spaceRight >= menuWidth) {
          bestSide = 'right';
          bestAlign = 'start';
        } else if (spaceLeft >= menuWidth) {
          bestSide = 'left';
          bestAlign = 'start';
        }
      } else if (bestSide === 'top' && spaceTop < menuHeight / 2) {
        if (spaceRight >= menuWidth) {
          bestSide = 'right';
          bestAlign = 'start';
        } else if (spaceLeft >= menuWidth) {
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