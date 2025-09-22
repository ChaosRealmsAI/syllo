'use client'

import React from 'react';
import { FramedDragHandle } from '@/components/drag-toolbar';
import { SlashMenuPopover } from '@/components/menu';
import { FeishuNav } from '@/components/feishu-nav';

export default function DragToolbarDemo() {
  const handleMenuItemClick = (item: any) => {
    console.log('Menu item clicked:', item);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-16">
      <FeishuNav
        breadcrumbs={[
          { id: '1', label: '演示' },
          { id: '2', label: '拖拽工具栏' }
        ]}
        title="拖拽工具栏演示"
        isPinned={false}
        lastModified="最近修改: 刚刚"
        onShareClick={() => alert('分享功能')}
        onEditModeChange={() => {}}
        editMode="view"
        notificationCount={0}
        userName="用户"
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[79]">
        <SlashMenuPopover onMenuItemClick={handleMenuItemClick} trigger="hover">
          <FramedDragHandle darkMode={true} showBorder={true} />
        </SlashMenuPopover>
      </div>
    </div>
  );
}