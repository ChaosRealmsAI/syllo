'use client';

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { SlashMenuProps, SlashCommand } from '../contracts/slash-commands.types';

export const SlashMenu = forwardRef(({ items, command }: SlashMenuProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const filteredItems = items;

  const selectItem = (index: number) => {
    const item = filteredItems[index];
    if (item) {
      command(item);
    }
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((prev) => 
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
        return true;
      } else if (event.key === 'ArrowDown') {
        setSelectedIndex((prev) => 
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
        return true;
      } else if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    }
  }));

  if (filteredItems.length === 0) {
    return null;
  }

  const groups = filteredItems.reduce((acc, item) => {
    const group = item.group || '其他';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {} as Record<string, SlashCommand[]>);

  let currentIndex = 0;

  return (
    <div 
      ref={menuRef}
      className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-64 max-h-80 overflow-y-auto"
    >
      {Object.entries(groups).map(([groupName, groupItems]) => (
        <div key={groupName}>
          <div className="px-3 py-1 text-xs text-gray-500 font-medium">
            {groupName}
          </div>
          {groupItems.map((item) => {
            const isSelected = currentIndex === selectedIndex;
            const index = currentIndex;
            currentIndex++;
            
            return (
              <button
                key={item.id}
                className={`w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-gray-100 ${
                  isSelected ? 'bg-gray-100' : ''
                }`}
                onClick={() => selectItem(index)}
              >
                <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-mono text-xs">
                  {item.icon}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{item.title}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500">{item.description}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
});

SlashMenu.displayName = 'SlashMenu';