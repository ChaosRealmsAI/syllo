'use client'

import React from 'react';
import { DragHandle } from '@/components/drag-toolbar';
import { SlashMenuPopover } from '@/components/menu/src';
import { ThemeToggle } from '@/components/theme-toggle';

export default function TestPositioning() {
  const handleMenuItemClick = (item: any) => {
    console.log('Menu item clicked:', item);
  };

  const PositionedDragToolbar = ({ className }: { className: string }) => (
    <div className={`fixed z-[79] ${className}`}>
      <SlashMenuPopover onMenuItemClick={handleMenuItemClick} trigger="hover">
        <DragHandle />
      </SlashMenuPopover>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black relative">
      <ThemeToggle />

      {/* Center info */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          智能定位测试
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          将鼠标悬停在不同位置的工具栏上，菜单会自动选择最佳显示位置
        </p>
      </div>

      {/* Top left corner */}
      <PositionedDragToolbar className="left-4 top-4" />

      {/* Top right corner */}
      <PositionedDragToolbar className="right-4 top-4" />

      {/* Bottom left corner */}
      <PositionedDragToolbar className="left-4 bottom-4" />

      {/* Bottom right corner */}
      <PositionedDragToolbar className="right-4 bottom-4" />

      {/* Middle left edge */}
      <PositionedDragToolbar className="left-4 top-1/2 -translate-y-1/2" />

      {/* Middle right edge */}
      <PositionedDragToolbar className="right-4 top-1/2 -translate-y-1/2" />

      {/* Top center */}
      <PositionedDragToolbar className="left-1/2 top-4 -translate-x-1/2" />

      {/* Bottom center */}
      <PositionedDragToolbar className="left-1/2 bottom-4 -translate-x-1/2" />
    </div>
  );
}