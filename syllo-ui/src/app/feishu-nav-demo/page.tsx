"use client";

import { useState } from 'react';
import { FeishuNav } from '@/components/feishu-nav';

export default function FeishuNavDemo() {
  const [editMode, setEditMode] = useState<'edit' | 'view' | 'ai'>('edit');
  const [isPinned, setIsPinned] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const breadcrumbs = [
    { id: '1', label: '一级目录' },
    { id: '2', label: '二级目录' },
    { id: '3', label: '当前文档' }
  ];

  const handleShareClick = () => {
    alert('分享功能');
  };

  const handleEditModeChange = (mode: 'edit' | 'view' | 'ai') => {
    setEditMode(mode);
    alert(`切换到${mode === 'edit' ? '编辑' : mode === 'view' ? '查看' : 'AI'}模式`);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
    alert(`侧边栏${!sidebarOpen ? '打开' : '关闭'}`);
  };

  const handleHomeClick = () => {
    alert('返回主页');
  };

  const handleSearchClick = () => {
    alert('搜索功能');
  };

  const handleCreateClick = () => {
    alert('创建新文档');
  };

  const handleMoreClick = () => {
    alert('更多选项');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Feishu Navigation Bar */}
      <FeishuNav
        breadcrumbs={breadcrumbs}
        title="飞书导航栏演示"
        isPinned={isPinned}
        lastModified="最近修改: 2 小时前"
        onShareClick={handleShareClick}
        onEditModeChange={handleEditModeChange}
        editMode={editMode}
        notificationCount={notificationCount}
        userName="张三"
        userAvatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
        onSidebarToggle={handleSidebarToggle}
        onHomeClick={handleHomeClick}
        onSearchClick={handleSearchClick}
        onCreateClick={handleCreateClick}
        onMoreClick={handleMoreClick}
      />

      {/* Demo Content */}
      <div className="p-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              飞书风格导航栏组件演示
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              这是一个基于 shadcn/ui 复刻的飞书风格导航栏组件，包含了完整的功能按钮和交互效果。
            </p>

            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  功能特性
                </h2>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li>侧边栏切换按钮</li>
                  <li>面包屑导航</li>
                  <li>文档标题和收藏功能</li>
                  <li>分享按钮</li>
                  <li>编辑模式切换（编辑/查看/AI）</li>
                  <li>通知中心（带计数）</li>
                  <li>搜索和创建功能</li>
                  <li>用户头像</li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  控制面板
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setNotificationCount(prev => prev + 1)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      增加通知
                    </button>
                    <button
                      onClick={() => setNotificationCount(0)}
                      className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      清空通知
                    </button>
                    <span className="text-gray-600 dark:text-gray-400">
                      当前通知数：{notificationCount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPinned(!isPinned)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      {isPinned ? '取消收藏' : '收藏文档'}
                    </button>
                    <span className="text-gray-600 dark:text-gray-400">
                      收藏状态：{isPinned ? '已收藏' : '未收藏'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      当前模式：{editMode === 'edit' ? '编辑' : editMode === 'view' ? '查看' : 'AI'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              组件说明
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400">
                该组件完全基于 React 和 shadcn/ui 组件库构建，使用了以下技术：
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>React Hooks 进行状态管理</li>
                <li>Tailwind CSS 进行样式设计</li>
                <li>Lucide React 图标库</li>
                <li>shadcn/ui 的 Button、Avatar、Badge 等基础组件</li>
                <li>完全响应式设计</li>
                <li>支持暗色模式</li>
              </ul>

              <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
                使用方法
              </h3>
              <pre className="bg-gray-100 dark:bg-neutral-800 p-4 rounded overflow-x-auto">
                <code className="text-sm">
{`import { FeishuNav } from '@/components/feishu-nav';

<FeishuNav
  breadcrumbs={breadcrumbs}
  title="文档标题"
  isPinned={false}
  lastModified="最近修改: 1 小时前"
  onShareClick={handleShare}
  onEditModeChange={handleEditMode}
  editMode="edit"
  notificationCount={3}
  userName="用户名"
  userAvatar="avatar-url"
  onSidebarToggle={handleSidebar}
  onHomeClick={handleHome}
  onSearchClick={handleSearch}
  onCreateClick={handleCreate}
  onMoreClick={handleMore}
/>`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}