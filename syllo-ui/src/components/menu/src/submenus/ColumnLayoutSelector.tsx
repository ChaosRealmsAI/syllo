'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface ColumnLayoutOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  data: { columns?: number; layout?: string };
}

const layoutOptions: ColumnLayoutOption[] = [
  {
    id: 'two-columns',
    label: '两栏',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="18" stroke="currentColor" strokeWidth="2" rx="1"/>
        <rect x="13" y="3" width="8" height="18" stroke="currentColor" strokeWidth="2" rx="1"/>
      </svg>
    ),
    data: { columns: 2 }
  },
  {
    id: 'three-columns',
    label: '三栏',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="6" height="18" stroke="currentColor" strokeWidth="2" rx="1"/>
        <rect x="9" y="3" width="6" height="18" stroke="currentColor" strokeWidth="2" rx="1"/>
        <rect x="16" y="3" width="6" height="18" stroke="currentColor" strokeWidth="2" rx="1"/>
      </svg>
    ),
    data: { columns: 3 }
  },
  {
    id: 'divider',
    label: '',
    icon: null,
    data: {}
  },
  {
    id: 'left-sidebar',
    label: '左侧栏',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="6" height="18" stroke="currentColor" strokeWidth="2" rx="1"/>
        <rect x="11" y="3" width="10" height="18" stroke="currentColor" strokeWidth="2" rx="1"/>
      </svg>
    ),
    data: { layout: 'left-right' }
  },
  {
    id: 'right-sidebar',
    label: '右侧栏',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="10" height="18" stroke="currentColor" strokeWidth="2" rx="1"/>
        <rect x="15" y="3" width="6" height="18" stroke="currentColor" strokeWidth="2" rx="1"/>
      </svg>
    ),
    data: { layout: 'right-left' }
  },
];

interface ColumnLayoutSelectorProps {
  onSelect?: (option: ColumnLayoutOption) => void;
}

const ColumnLayoutSelector: React.FC<ColumnLayoutSelectorProps> = ({ onSelect }) => {
  return (
    <div className="py-1">
      {layoutOptions.map((option) => {
        if (option.id === 'divider') {
          return <Separator key={option.id} className="my-1" />;
        }

        return (
          <div
            key={option.id}
            className={cn(
              "flex items-center px-3 py-1.5 text-sm cursor-pointer transition-colors",
              "hover:bg-gray-50 dark:hover:bg-neutral-800 min-h-[32px]"
            )}
            onClick={() => onSelect?.(option)}
          >
            <div className="mr-2 text-gray-600 dark:text-gray-400">{option.icon}</div>
            <span className="text-gray-900 dark:text-gray-100">{option.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ColumnLayoutSelector;