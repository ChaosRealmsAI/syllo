'use client';

import { useState } from 'react';
import { SidebarProps, SidebarItemData } from '../contracts/components.types';

export function Sidebar({ items, selectedId, onItemClick }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderItem = (item: SidebarItemData, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isSelected = selectedId === item.id;

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 cursor-pointer ${
            isSelected ? 'bg-blue-50 text-blue-600' : ''
          }`}
          style={{ paddingLeft: `${12 + level * 20}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            }
            onItemClick?.(item.id);
          }}
        >
          {hasChildren && (
            <svg
              className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {item.icon && <span className="text-base">{item.icon}</span>}
          <span className="text-sm truncate flex-1">{item.title}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {item.children!.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-60 bg-gray-50 border-r h-full overflow-y-auto">
      <div className="py-2">
        {items.map(item => renderItem(item))}
      </div>
    </div>
  );
}