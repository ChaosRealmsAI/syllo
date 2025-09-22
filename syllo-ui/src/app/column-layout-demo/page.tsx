"use client";

import React, { useState } from 'react';
import { ColumnLayout, ColumnData } from '@/components/block-editor/layout/ColumnLayout';
import { FeishuNav } from '@/components/feishu-nav';
import styles from '@/components/block-editor/styles/editor.module.css';

export default function ColumnLayoutDemo() {
  const [columns, setColumns] = useState<ColumnData[]>([
    {
      id: 'col-1',
      width: 30,
      content: (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg h-full">
          <h3 className="text-lg font-bold mb-2">第一列</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            这是第一列的内容。你可以拖动右侧的分隔线来调整列宽。
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>✨ 支持拖拽调整宽度</li>
            <li>📏 显示百分比宽度</li>
            <li>➕ 可以添加新列</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'col-2',
      width: 40,
      content: (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg h-full">
          <h3 className="text-lg font-bold mb-2">第二列</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            这是第二列的内容，宽度为 40%。
          </p>
          <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded">
            <code className="text-xs">
              {`const column = {
  id: 'col-2',
  width: 40,
  content: <YourContent />
}`}
            </code>
          </div>
        </div>
      ),
    },
    {
      id: 'col-3',
      width: 30,
      content: (
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg h-full">
          <h3 className="text-lg font-bold mb-2">第三列</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            这是第三列的内容。点击分隔线上的 + 按钮可以在列之间添加新列。
          </p>
          <div className="mt-4">
            <div className="h-20 bg-purple-100 dark:bg-purple-800 rounded flex items-center justify-center">
              <span className="text-sm">可放置任何内容</span>
            </div>
          </div>
        </div>
      ),
    },
  ]);

  const handleColumnsChange = (newColumns: ColumnData[]) => {
    setColumns(newColumns);
    console.log('Columns updated:', newColumns);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Navigation */}
      <FeishuNav
        breadcrumbs={[
          { id: '1', label: '演示' },
          { id: '2', label: '多列布局' }
        ]}
        title="多列布局演示"
        isPinned={false}
        lastModified="最近修改: 刚刚"
        onShareClick={() => alert('分享功能')}
        onEditModeChange={() => {}}
        editMode="edit"
        notificationCount={0}
        userName="用户"
      />

      <div className="p-8 pt-20">
        {/* 说明文字 */}
        <div className="mb-8 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            多列布局组件演示
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            这是一个支持动态调整列宽和添加新列的多列布局组件：
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
            <li>🖱️ 拖动列之间的分隔线来调整列宽</li>
            <li>➕ 点击分隔线上的加号按钮添加新列</li>
            <li>📊 每列顶部显示当前宽度百分比</li>
            <li>🎨 拖动时有视觉反馈效果</li>
            <li>📱 最小宽度限制（10%）保证可用性</li>
          </ul>
        </div>

        {/* 多列布局组件 */}
        <div className="max-w-6xl mx-auto bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">拖动下方分隔线试试：</h2>
          <div className="min-h-[400px]">
            <ColumnLayout
              columns={columns}
              onColumnsChange={handleColumnsChange}
              className={styles.demoContainer}
            />
          </div>
        </div>

        {/* 当前状态展示 */}
        <div className="mt-8 max-w-6xl mx-auto bg-white dark:bg-neutral-900 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">当前列配置：</h2>
          <div className="space-y-2">
            {columns.map((col, index) => (
              <div key={col.id} className="flex items-center space-x-4 text-sm">
                <span className="font-medium">列 {index + 1}:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  ID: {col.id}
                </span>
                <span className="text-blue-600 dark:text-blue-400">
                  宽度: {Math.round(col.width)}%
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            总列数: {columns.length}
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 max-w-6xl mx-auto bg-white dark:bg-neutral-900 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            使用方法
          </h2>
          <pre className="bg-gray-950 p-4 rounded-md overflow-x-auto text-sm">
            <code className="text-gray-300">{`import { ColumnLayout, ColumnData } from '@/components/block-editor/layout/ColumnLayout';

const columns: ColumnData[] = [
  {
    id: 'col-1',
    width: 33,
    content: <div>第一列内容</div>
  },
  {
    id: 'col-2',
    width: 33,
    content: <div>第二列内容</div>
  },
  {
    id: 'col-3',
    width: 34,
    content: <div>第三列内容</div>
  }
];

function MyComponent() {
  const handleColumnsChange = (newColumns: ColumnData[]) => {
    console.log('列更新:', newColumns);
  };

  return (
    <ColumnLayout
      columns={columns}
      onColumnsChange={handleColumnsChange}
    />
  );
}`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}