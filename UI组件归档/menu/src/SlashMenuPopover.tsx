'use client'

import React, { useState, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import SlashMenu from './SlashMenu';
import { useSmartPosition } from './hooks/useSmartPosition';

interface SlashMenuPopoverProps {
  children: React.ReactNode;
  onMenuItemClick?: (item: any) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: 'hover' | 'click';
}

const SlashMenuPopover: React.FC<SlashMenuPopoverProps> = ({
  children,
  onMenuItemClick,
  open,
  onOpenChange,
  trigger = 'hover'
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const position = useSmartPosition(triggerRef, isOpen, {
    menuWidth: 280,
    menuHeight: 400,
    defaultSide: 'bottom',
    defaultAlign: 'start'
  });

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsOpen(!isOpen);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          ref={triggerRef}
          className="absolute z-[79]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-0"
        align={position.align}
        side={position.side as any}
        sideOffset={position.sideOffset}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SlashMenu onItemClick={onMenuItemClick} />
      </PopoverContent>
    </Popover>
  );
};

export default SlashMenuPopover;