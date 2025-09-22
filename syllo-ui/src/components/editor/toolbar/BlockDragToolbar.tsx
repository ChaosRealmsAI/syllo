"use client";

import React, { useState, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { TextIcon, DragHandleIcon } from '@/components/drag-toolbar/icons';
import SlashMenu from '@/components/drag-toolbar/SlashMenu';

interface BlockDragToolbarProps {
  onMenuItemClick?: (item: any) => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

export const BlockDragToolbar: React.FC<BlockDragToolbarProps> = ({
  onMenuItemClick,
  onDragStart,
  onDragEnd
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          ref={triggerRef}
          className="absolute z-[79]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Button
            variant="outline"
            size="sm"
            className="h-[26px] w-[42px] p-0 border border-gray-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-grab active:cursor-grabbing"
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
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
        align="start"
        side="bottom"
        sideOffset={5}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SlashMenu onItemClick={onMenuItemClick} />
      </PopoverContent>
    </Popover>
  );
};