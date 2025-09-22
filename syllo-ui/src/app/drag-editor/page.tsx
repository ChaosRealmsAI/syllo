"use client";

import React from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { DragProvider, useDragContext } from "@/components/block-editor/drag/DragContext";
import { DraggableBlock } from "@/components/block-editor/drag/DraggableBlock";
import { Block } from "@/components/block-editor/drag/types";
import { generateId } from "@/components/block-editor/drag/utils/dragHelpers";
import { ThemeToggle } from "@/components/theme-toggle";

// 导入块组件
import { Heading } from "@/components/block-editor/blocks/text/Heading";
import { Paragraph } from "@/components/block-editor/blocks/text/Paragraph";
import { OrderedList } from "@/components/block-editor/blocks/list/OrderedList";
import { UnorderedList } from "@/components/block-editor/blocks/list/UnorderedList";
import { CodeBlock } from "@/components/block-editor/blocks/misc/CodeBlock";
import { Blockquote } from "@/components/block-editor/blocks/text/Blockquote";
import { Divider } from "@/components/block-editor/blocks/misc/Divider";

import styles from "@/components/block-editor/styles/editor.module.css";
import dragStyles from "@/components/block-editor/styles/drag.module.css";

// 初始块数据
const initialBlocks: Block[] = [
  {
    id: generateId(),
    type: "heading1",
    content: "可拖拽编辑器演示"
  },
  {
    id: generateId(),
    type: "paragraph",
    content: "拖拽下方的句柄来重新排列内容块。这是第一阶段实现，支持纵向拖拽排序。"
  },
  {
    id: generateId(),
    type: "heading2",
    content: "功能特性"
  },
  {
    id: generateId(),
    type: "unorderedList",
    content: [
      "拖拽手柄显示在悬停时",
      "蓝色指示线显示放置位置",
      "平滑的拖拽动画",
      "支持键盘操作"
    ]
  },
  {
    id: generateId(),
    type: "divider",
    content: null
  },
  {
    id: generateId(),
    type: "heading3",
    content: "代码示例"
  },
  {
    id: generateId(),
    type: "code",
    content: `// 拖拽功能实现
const handleDragEnd = (event) => {
  const {active, over} = event;
  if (active.id !== over.id) {
    moveBlock(active.id, over.id);
  }
};`
  },
  {
    id: generateId(),
    type: "quote",
    content: "拖拽交互让编辑器更加灵活和直观。"
  },
];

// 编辑器内容组件
const DragEditorContent: React.FC = () => {
  const { blocks, setBlocks, setDropIndicator } = useDragContext();
  const [activeId, setActiveId] = React.useState<string | null>(null);

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      setDropIndicator(null);
      return;
    }

    if (active.id !== over.id) {
      setDropIndicator({
        targetId: String(over.id),
        position: "bottom",
        indent: 0,
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setDropIndicator(null);
      return;
    }

    if (active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
    setDropIndicator(null);
  };

  // 渲染块内容
  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case "heading1":
        return <Heading level={1}>{block.content}</Heading>;
      case "heading2":
        return <Heading level={2}>{block.content}</Heading>;
      case "heading3":
        return <Heading level={3}>{block.content}</Heading>;
      case "paragraph":
        return <Paragraph>{block.content}</Paragraph>;
      case "unorderedList":
        return <UnorderedList items={block.content} />;
      case "orderedList":
        return <OrderedList items={block.content} />;
      case "code":
        return <CodeBlock code={block.content} language="javascript" />;
      case "quote":
        return <Blockquote>{block.content}</Blockquote>;
      case "divider":
        return <Divider />;
      default:
        return null;
    }
  };

  const activeBlock = blocks.find(block => block.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={blocks.map(b => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={dragStyles.dragContainer}>
          {blocks.length === 0 ? (
            <div className={dragStyles.emptyState}>
              拖拽块到这里开始编辑
            </div>
          ) : (
            blocks.map((block, index) => (
              <DraggableBlock
                key={block.id}
                block={block}
                index={index}
              >
                {renderBlockContent(block)}
              </DraggableBlock>
            ))
          )}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId && activeBlock ? (
          <div className={dragStyles.dragOverlay}>
            {renderBlockContent(activeBlock)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

// 主页面组件
export default function DragEditorPage() {
  return (
    <DragProvider initialBlocks={initialBlocks}>
      <ThemeToggle />
      <div className={styles.editorWrapper}>
        {/* 顶部工具栏 */}
        <div className={styles.editorToolbar}>
          <h1 className={styles.docTitle}>拖拽编辑器 - 第一阶段</h1>
        </div>

        {/* 编辑器内容 */}
        <div className={styles.editorContent}>
          <DragEditorContent />
        </div>

        {/* 调试面板 */}
        <div className="fixed bottom-5 right-5 bg-card border border-border rounded-lg p-4 max-w-xs shadow-lg">
          <h3 className="text-sm font-medium text-card-foreground mb-2">拖拽提示</h3>
          <ul className="text-xs text-muted-foreground pl-5 space-y-1">
            <li>悬停显示拖拽手柄</li>
            <li>拖拽手柄重新排序</li>
            <li>蓝线指示放置位置</li>
            <li>支持键盘操作</li>
          </ul>
        </div>
      </div>
    </DragProvider>
  );
}