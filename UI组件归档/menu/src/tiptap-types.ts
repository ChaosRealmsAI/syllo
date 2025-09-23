import { ReactNode } from 'react';

// Tiptap 专用类型定义
export interface TiptapMenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  command: () => void;      // 执行 Tiptap 命令
  isAvailable?: boolean;    // 是否可用（基于编辑器状态）
  description?: string;     // 描述文本
  shortcut?: string;        // 快捷键提示
}

export interface TiptapMenuSection {
  id: string;
  title: string;
  items: TiptapMenuItem[];
}

// 转换函数：将 Tiptap 菜单转换为通用菜单格式
export function tiptapToMenuItems(tiptapItems: TiptapMenuItem[]) {
  return tiptapItems.map(item => ({
    id: item.id,
    name: item.id,
    label: item.label,
    icon: item.icon,
    type: 'item' as const,
    data: {
      command: item.command,
      isAvailable: item.isAvailable,
      description: item.description,
      shortcut: item.shortcut
    }
  }));
}

export function tiptapToMenuSections(tiptapSections: TiptapMenuSection[]) {
  return tiptapSections.map(section => ({
    id: section.id,
    title: section.title,
    type: 'section' as const,
    items: tiptapToMenuItems(section.items)
  }));
}