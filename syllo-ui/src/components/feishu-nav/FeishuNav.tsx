"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Home,
  ChevronRight,
  ChevronDown,
  Users,
  Edit,
  Bell,
  MoreHorizontal,
  Search,
  Plus,
  Pin,
  SidebarOpen,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from 'next-themes';

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
}

export interface FeishuNavProps {
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  isPinned?: boolean;
  lastModified?: string;
  onShareClick?: () => void;
  onEditModeChange?: (mode: 'edit' | 'view' | 'ai') => void;
  editMode?: 'edit' | 'view' | 'ai';
  notificationCount?: number;
  userName?: string;
  userAvatar?: string;
  onSidebarToggle?: () => void;
  onHomeClick?: () => void;
  onSearchClick?: () => void;
  onCreateClick?: () => void;
  onMoreClick?: () => void;
  className?: string;
}

export default function FeishuNav({
  breadcrumbs = [{ id: '1', label: '一' }, { id: '2', label: '读书笔记' }],
  title = '读书笔记',
  isPinned = false,
  lastModified = '最近修改: 1 小时前',
  onShareClick,
  onEditModeChange,
  editMode = 'edit',
  notificationCount = 0,
  userName = '用户',
  userAvatar,
  onSidebarToggle,
  onHomeClick,
  onSearchClick,
  onCreateClick,
  onMoreClick,
  className
}: FeishuNavProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-[100]",
      "w-full h-16 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800",
      "flex items-center px-4",
      className
    )}>
      {/* Left Section */}
      <div className="flex items-center">
        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 mr-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onSidebarToggle}
        >
          <SidebarOpen className="h-4 w-4" />
        </Button>

        {/* Home Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onHomeClick}
        >
          <Home className="h-4 w-4" />
        </Button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 dark:bg-neutral-700 mx-3" />
      </div>

      {/* Center Section - Title and Breadcrumbs */}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={item.id}>
              <span className={cn(
                "text-gray-500 dark:text-gray-400",
                index === breadcrumbs.length - 1 && "text-gray-900 dark:text-gray-100"
              )}>
                {item.label}
              </span>
              {index < breadcrumbs.length - 1 && (
                <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />
              )}
            </React.Fragment>
          ))}

          {/* Pin Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => {}}
          >
            <Pin className={cn("h-3 w-3", isPinned && "fill-current")} />
          </Button>
        </div>

        {/* Last Modified */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {lastModified}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Share Button */}
        <Button
          variant="default"
          size="sm"
          className="h-8 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onShareClick}
        >
          <Users className="h-4 w-4 mr-2" />
          分享
        </Button>

        {/* Edit Mode Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 min-w-[96px]",
              "hover:bg-gray-50 dark:hover:bg-neutral-800",
              hoveredButton === 'edit' && "bg-gray-50 dark:bg-neutral-800"
            )}
            onMouseEnter={() => setHoveredButton('edit')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => onEditModeChange?.(editMode === 'edit' ? 'view' : 'edit')}
          >
            <Edit className="h-4 w-4 mr-1" />
            <span className="text-sm">编辑</span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </div>

        {/* Notification */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-700 dark:text-gray-300"
            onClick={() => {}}
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <div className="absolute -top-1 -right-1 h-4 min-w-[14px] px-0.5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] font-medium">
                  {notificationCount}
                </span>
              </div>
            )}
          </Button>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-700 dark:text-gray-300"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* More Menu */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-700 dark:text-gray-300"
          onClick={onMoreClick}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 dark:bg-neutral-700" />

        {/* Search */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-700 dark:text-gray-300"
          onClick={onSearchClick}
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Create */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-700 dark:text-gray-300"
          onClick={onCreateClick}
        >
          <Plus className="h-4 w-4" />
        </Button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 dark:bg-neutral-700" />

        {/* User Avatar */}
        <div className="ml-2">
          <Avatar className="h-8 w-8 cursor-pointer">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="h-8 w-8 rounded-full" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                {userName[0].toUpperCase()}
              </div>
            )}
          </Avatar>
        </div>
      </div>
    </div>
  );
}