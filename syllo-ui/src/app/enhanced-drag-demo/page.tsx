"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { DragProvider } from "@/components/block-editor/drag/DragContext";
import { DraggableColumnContainer } from "@/components/block-editor/drag/DraggableColumnContainer";
import { Block } from "@/components/block-editor/drag/types";
import { generateId } from "@/components/block-editor/drag/utils/dragHelpers";
import { FeishuNav } from "@/components/feishu-nav";

// 初始数据
const initialData = {
  columns: {
    column1: {
      id: "column1",
      title: "纵向列 1",
      orientation: "vertical" as const,
      blocks: [
        { id: generateId(), type: "heading2" as const, content: "标题块 1" },
        { id: generateId(), type: "paragraph" as const, content: "这是一个可以纵向拖拽的段落块。" },
        { id: generateId(), type: "quote" as const, content: "引用块：可以上下拖动排序" },
      ],
    },
    column2: {
      id: "column2",
      title: "横向列",
      orientation: "horizontal" as const,
      blocks: [
        { id: generateId(), type: "paragraph" as const, content: "横向块 1" },
        { id: generateId(), type: "paragraph" as const, content: "横向块 2" },
        { id: generateId(), type: "paragraph" as const, content: "横向块 3" },
      ],
    },
    column3: {
      id: "column3",
      title: "纵向列 2",
      orientation: "vertical" as const,
      blocks: [
        { id: generateId(), type: "heading3" as const, content: "另一个标题" },
        { id: generateId(), type: "unorderedList" as const, content: ["列表项 1", "列表项 2", "列表项 3"] },
      ],
    },
  },
};

export default function EnhancedDragDemo() {
  const [data, setData] = useState(initialData);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // 如果是跨容器拖拽
    if (activeData?.containerId !== overData?.containerId) {
      setData((prev) => {
        const activeContainer = prev.columns[activeData.containerId];
        const overContainer = prev.columns[overData.containerId];

        if (!activeContainer || !overContainer) return prev;

        const activeIndex = activeContainer.blocks.findIndex(
          (b) => b.id === active.id
        );
        const overIndex = overContainer.blocks.findIndex((b) => b.id === over.id);

        if (activeIndex === -1) return prev;

        const [movedBlock] = activeContainer.blocks.splice(activeIndex, 1);
        overContainer.blocks.splice(overIndex >= 0 ? overIndex : 0, 0, movedBlock);

        return { ...prev };
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;
    const containerId = activeData?.containerId;

    if (!containerId) return;

    setData((prev) => {
      const container = prev.columns[containerId];
      if (!container) return prev;

      const oldIndex = container.blocks.findIndex((b) => b.id === active.id);
      const newIndex = container.blocks.findIndex((b) => b.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        container.blocks = arrayMove(container.blocks, oldIndex, newIndex);
      }

      return { ...prev };
    });
  };

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case "heading2":
        return <h2 className="text-2xl font-bold">{block.content}</h2>;
      case "heading3":
        return <h3 className="text-xl font-semibold">{block.content}</h3>;
      case "paragraph":
        return <p className="text-gray-700 dark:text-gray-300">{block.content}</p>;
      case "quote":
        return (
          <blockquote className="border-l-4 border-blue-500 pl-4 italic">
            {block.content}
          </blockquote>
        );
      case "unorderedList":
        return (
          <ul className="list-disc list-inside">
            {(block.content as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      default:
        return <div>{block.content}</div>;
    }
  };

  return (
    <DragProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <FeishuNav
          breadcrumbs={[
            { id: "1", label: "演示" },
            { id: "2", label: "增强拖拽" },
          ]}
          title="多向拖拽演示"
          isPinned={false}
          lastModified="最近修改: 刚刚"
          onShareClick={() => alert("分享功能")}
          onEditModeChange={() => {}}
          editMode="edit"
          notificationCount={0}
          userName="用户"
        />

        <div className="p-8 pt-20">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">增强版块拖拽系统</h1>

            <div className="mb-8">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                这个演示展示了增强的拖拽功能：
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                <li>🔄 纵向拖拽：在列内上下重新排序</li>
                <li>↔️ 横向拖拽：在横向布局中左右排序</li>
                <li>🔀 跨容器拖拽：将块从一列移动到另一列</li>
                <li>🎯 智能放置指示器：显示块将被放置的位置</li>
                <li>🖱️ 优雅的拖拽手柄：悬停时显示</li>
              </ul>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.values(data.columns).map((column) => (
                  <div
                    key={column.id}
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4"
                  >
                    <DraggableColumnContainer
                      id={column.id}
                      title={column.title}
                      blocks={column.blocks}
                      orientation={column.orientation}
                      renderBlock={renderBlock}
                    />
                  </div>
                ))}
              </div>
            </DndContext>

            {/* 使用说明 */}
            <div className="mt-12 bg-white dark:bg-gray-900 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">使用说明</h2>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h3 className="font-medium mb-2">🖱️ 鼠标操作</h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• 悬停在块上显示拖拽手柄</li>
                    <li>• 点击并拖动手柄移动块</li>
                    <li>• 拖到其他列实现跨容器移动</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">⌨️ 键盘操作</h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Tab 聚焦到块</li>
                    <li>• 空格键激活拖拽</li>
                    <li>• 方向键移动位置</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DragProvider>
  );
}