'use client'

import React from 'react';
import { DragToolbar } from '@/components/drag-toolbar';
import { ThemeToggle } from '@/components/theme-toggle';

export default function DragToolbarDemo() {
  const handleMenuItemClick = (item: any) => {
    console.log('Menu item clicked:', item);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black relative">
      <ThemeToggle />
      <DragToolbar
        className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        onMenuItemClick={handleMenuItemClick}
      />
    </div>
  );
}