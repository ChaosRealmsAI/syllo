'use client'

import React, { useState, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { TextIcon, DragHandleIcon } from './icons';
import SlashMenu from './SlashMenu';
import { useSmartPosition } from './hooks/useSmartPosition';

interface DragToolbarProps {
  className?: string;
  onMenuItemClick?: (item: any) => void;
}

const DragToolbar: React.FC<DragToolbarProps> = ({ className = '', onMenuItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const position = useSmartPosition(triggerRef, isOpen, {
    menuWidth: 280,
    menuHeight: 500,
    defaultSide: 'bottom',
    defaultAlign: 'start'
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          ref={triggerRef}
          className={`fixed z-[79] ${className}`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <Button
            variant="outline"
            size="sm"
            className="h-[26px] w-[42px] p-0 border border-gray-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center justify-center gap-0">
              <div className="w-6 h-6 flex items-center justify-center">
                <TextIcon />
              </div>
              <div className="w-[14px] h-[14px] text-gray-500">
                <DragHandleIcon />
              </div>
            </div>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-0"
        align={position.align}
        side={position.side as any}
        sideOffset={position.sideOffset}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <SlashMenu onItemClick={onMenuItemClick} />
      </PopoverContent>
    </Popover>
  );
};

export default DragToolbar;