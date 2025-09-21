'use client'

import React from 'react';
import { FlattenGridItem } from './types';
import { cn } from '@/lib/utils';

interface FlattenIconGridProps {
  items: FlattenGridItem[];
  onItemClick?: (item: FlattenGridItem) => void;
}

const FlattenIconGrid: React.FC<FlattenIconGridProps> = ({ items, onItemClick }) => {
  return (
    <div className="grid grid-cols-6 gap-2 px-3 pb-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "group relative flex h-6 w-6 cursor-pointer items-center justify-center rounded transition-colors",
            "hover:bg-gray-100 dark:hover:bg-neutral-800"
          )}
          onClick={() => onItemClick?.(item)}
          title={item.tooltip}
        >
          <div className="text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 [&>svg]:h-[14px] [&>svg]:w-[14px]">
            {item.icon}
          </div>
          {/* Tooltip */}
          <div className="absolute -bottom-7 left-1/2 z-50 hidden -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-800 dark:bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100">
            {item.tooltip}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlattenIconGrid;