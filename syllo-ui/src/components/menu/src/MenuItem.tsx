'use client'

import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';
import { MenuItem as MenuItemType, SubMenuItem } from './types';
import { ArrowRightIcon } from './icons';

interface MenuItemProps {
  item: MenuItemType;
  onItemClick?: (item: MenuItemType | SubMenuItem) => void;
  children?: React.ReactNode; // For custom submenu content
}

const MenuItem: React.FC<MenuItemProps> = ({ item, onItemClick, children }) => {
  const hasSubmenu = item.type === 'submenu';

  const itemContent = (
    <div
      className={cn(
        "flex items-center px-3 py-1.5 text-sm cursor-pointer transition-colors min-h-[32px]",
        "hover:bg-gray-50 dark:hover:bg-neutral-800"
      )}
      onClick={() => !hasSubmenu && onItemClick?.(item)}
    >
      <div className="flex flex-1 items-center gap-1">
        <div className="flex h-6 w-6 items-center justify-center text-gray-600 dark:text-gray-400 [&>svg]:h-[18px] [&>svg]:w-[18px]">
          {item.icon}
        </div>
        <span className="flex-1 text-gray-900 dark:text-gray-100">{item.label}</span>
      </div>
      {hasSubmenu && (
        <div className="text-gray-400 dark:text-gray-500 [&>svg]:h-4 [&>svg]:w-4">
          <ArrowRightIcon />
        </div>
      )}
    </div>
  );

  if (!hasSubmenu) {
    return itemContent;
  }

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {itemContent}
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        className="w-auto p-0"
        sideOffset={2}
      >
        {children || (
          <div className="py-1">
            {item.submenu?.map((subItem) => (
              <div
                key={subItem.id}
                className="flex items-center px-3 py-1.5 text-sm cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800 min-h-[32px] whitespace-nowrap"
                onClick={() => onItemClick?.(subItem)}
              >
                {subItem.icon && (
                  <div className="mr-2 text-gray-600 dark:text-gray-400 [&>svg]:h-4 [&>svg]:w-4">
                    {subItem.icon}
                  </div>
                )}
                <span className="text-gray-900 dark:text-gray-100">{subItem.label}</span>
              </div>
            ))}
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default MenuItem;