'use client'

import React from 'react';
import { DragToolbar } from '@/components/drag-toolbar';
import { ThemeToggle } from '@/components/theme-toggle';

export default function TestPositioning() {
  const handleMenuItemClick = (item: any) => {
    console.log('Menu item clicked:', item);
  };

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
      <DragToolbar
        className="left-4 top-4"
        onMenuItemClick={handleMenuItemClick}
      />

      {/* Top right corner */}
      <DragToolbar
        className="right-4 top-4"
        onMenuItemClick={handleMenuItemClick}
      />

      {/* Bottom left corner */}
      <DragToolbar
        className="left-4 bottom-4"
        onMenuItemClick={handleMenuItemClick}
      />

      {/* Bottom right corner */}
      <DragToolbar
        className="right-4 bottom-4"
        onMenuItemClick={handleMenuItemClick}
      />

      {/* Middle left edge */}
      <DragToolbar
        className="left-4 top-1/2 -translate-y-1/2"
        onMenuItemClick={handleMenuItemClick}
      />

      {/* Middle right edge */}
      <DragToolbar
        className="right-4 top-1/2 -translate-y-1/2"
        onMenuItemClick={handleMenuItemClick}
      />

      {/* Top center */}
      <DragToolbar
        className="left-1/2 top-4 -translate-x-1/2"
        onMenuItemClick={handleMenuItemClick}
      />

      {/* Bottom center */}
      <DragToolbar
        className="left-1/2 bottom-4 -translate-x-1/2"
        onMenuItemClick={handleMenuItemClick}
      />
    </div>
  );
}