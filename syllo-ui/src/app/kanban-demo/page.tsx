"use client";

import React, { useState } from 'react';
import { KanbanBoard, KanbanBoardData } from '@/components/block-editor/blocks/task/KanbanBoard';
import { FeishuNav } from '@/components/feishu-nav';

const initialKanbanData: KanbanBoardData = {
  columns: [
    {
      id: 'todo',
      title: '待处理',
      status: 'todo',
      tasks: [
        {
          id: 'task-1',
          title: '设计系统架构',
          description: '创建整体系统架构设计文档',
          status: 'pending',
          completed: false
        },
        {
          id: 'task-2',
          title: '编写技术规范',
          description: '制定开发规范和代码标准',
          status: 'pending',
          completed: false
        },
        {
          id: 'task-3',
          title: '准备开发环境',
          description: '配置开发、测试和生产环境',
          status: 'pending',
          completed: false
        }
      ]
    },
    {
      id: 'in-progress',
      title: '进行中',
      status: 'in-progress',
      tasks: [
        {
          id: 'task-4',
          title: '开发用户认证模块',
          description: '实现登录、注册、密码重置等功能',
          status: 'in-progress',
          completed: false
        },
        {
          id: 'task-5',
          title: '构建API接口',
          description: 'RESTful API设计与实现',
          status: 'in-progress',
          completed: false
        }
      ]
    },
    {
      id: 'done',
      title: '已完成',
      status: 'done',
      tasks: [
        {
          id: 'task-6',
          title: '项目初始化',
          description: '创建项目仓库，配置基础框架',
          status: 'completed',
          completed: true
        },
        {
          id: 'task-7',
          title: '需求分析',
          description: '完成需求文档编写',
          status: 'completed',
          completed: true
        }
      ]
    },
    {
      id: 'archived',
      title: '已归档',
      status: 'archived',
      tasks: [
        {
          id: 'task-8',
          title: '旧版本迁移',
          description: '历史数据迁移完成',
          status: 'completed',
          completed: true
        }
      ]
    }
  ]
};

export default function KanbanDemo() {
  const [kanbanData, setKanbanData] = useState<KanbanBoardData>(initialKanbanData);
  const [editMode, setEditMode] = useState(true);

  const handleKanbanChange = (newData: KanbanBoardData) => {
    console.log('Kanban data changed:', newData);
    setKanbanData(newData);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Navigation */}
      <FeishuNav
        breadcrumbs={[
          { id: '1', label: '演示' },
          { id: '2', label: '看板演示' }
        ]}
        title="多列拖拽看板"
        isPinned={false}
        lastModified="最近修改: 刚刚"
        onShareClick={() => alert('分享功能')}
        onEditModeChange={() => setEditMode(!editMode)}
        editMode={editMode ? "edit" : "view"}
        notificationCount={0}
        userName="用户"
      />

      <div className="p-8 pt-20">
        {/* 说明文字 */}
        <div className="mb-8 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            多列拖拽看板演示
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            这是一个支持多列展示和拖拽的看板组件，你可以：
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 mb-4">
            <li>在不同列之间拖拽任务卡片</li>
            <li>在同一列内重新排序任务</li>
            <li>任务拖拽到不同状态列时会自动更新状态</li>
            <li>支持键盘操作（使用方向键和空格键）</li>
          </ul>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-500">编辑模式：</span>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-3 py-1 rounded ${
                editMode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              {editMode ? '开启' : '关闭'}
            </button>
          </div>
        </div>

        {/* 看板组件 */}
        <div className="max-w-6xl mx-auto">
          <KanbanBoard
            data={kanbanData}
            editable={editMode}
            onChange={handleKanbanChange}
          />
        </div>

        {/* 使用说明 */}
        <div className="mt-12 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              使用说明
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  🖱️ 鼠标操作
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>点击并按住任务卡片开始拖拽</li>
                  <li>拖拽到目标列或目标位置后释放</li>
                  <li>拖拽时会显示半透明的预览效果</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  ⌨️ 键盘操作
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Tab - 聚焦到任务卡片</li>
                  <li>空格 - 开始/结束拖拽</li>
                  <li>方向键 - 移动任务位置</li>
                  <li>Escape - 取消拖拽</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  🎨 状态颜色
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>待处理 - 灰色背景</li>
                  <li>进行中 - 蓝色背景</li>
                  <li>已完成 - 绿色背景</li>
                  <li>已归档 - 深灰色背景</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}