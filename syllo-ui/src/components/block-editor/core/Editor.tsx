"use client";

import React, { useState } from "react";
import styles from "../styles/editor.module.css";
import { Toolbar } from "../toolbar/Toolbar";
import { DocumentTitle } from "../toolbar/DocumentTitle";
import { DocumentMeta } from "../toolbar/DocumentMeta";
import { EditorContent, EditorBlock } from "./EditorContent";
import { ColumnData } from "../layout/ColumnLayout";
import { OrderedList } from "../blocks/list/OrderedList";
import { Paragraph } from "../blocks/text/Paragraph";
import { UnorderedList } from "../blocks/list/UnorderedList";
import { CodeBlock } from "../blocks/misc/CodeBlock";
import { Blockquote } from "../blocks/text/Blockquote";

// Initial blocks data
const initialBlocks: EditorBlock[] = [
  { id: "block-1", type: "heading1", content: "一级标题示例" },
  {
    id: "block-2",
    type: "paragraph",
    content: "这是一个为Tiptap集成准备的纯UI版本。所有样式都已经提取为CSS变量，方便后续与Tiptap编辑器集成。",
  },
  { id: "block-3", type: "heading2", content: "二级标题示例" },
  {
    id: "block-4",
    type: "unorderedList",
    content: ["CSS变量系统已完善", "预留了Tiptap样式覆盖", "保持飞书视觉风格"],
  },
  {
    id: "block-5",
    type: "code",
    content: `// Tiptap集成示例代码
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

const editor = new Editor({
  element: document.querySelector('.tiptap-editor-container'),
  extensions: [StarterKit],
  content: '<p>Hello World!</p>',
})`,
  },
  {
    id: "block-6",
    type: "quote",
    content: "这个纯UI版本可以直接作为Tiptap的样式基础，无需重构。",
  },
  { id: "block-7", type: "divider", content: null },
  { id: "block-8", type: "heading3", content: "三级标题示例" },
  {
    id: "block-9",
    type: "paragraph",
    content: "所有交互效果都通过CSS实现，不依赖JavaScript编辑逻辑，便于后续集成。",
  },
  { id: "block-10", type: "divider", content: null },
  { id: "block-11", type: "heading2", content: "多列内容展示" },
  {
    id: "block-12",
    type: "columns",
    content: [
      {
        id: "col-1",
        width: 26,
        content: (
          <OrderedList
            items={[
              {
                id: "list-1",
                content: "第一项内容",
                children: [
                  {
                    id: "list-1-a",
                    content: "子项内容",
                    children: [{ id: "list-1-a-i", content: "三级内容" }],
                  },
                  { id: "list-1-b", content: "第二个子项" },
                ],
              },
            ]}
          />
        ),
      },
      {
        id: "col-2",
        width: 41,
        content: (
          <>
            <OrderedList items={[{ id: "list-2", content: "中间列的内容" }]} />
            <Paragraph>
              这一列占据了41%的宽度，是三列中最宽的一列。可以放置更多的内容。
            </Paragraph>
          </>
        ),
      },
      {
        id: "col-3",
        width: 33,
        content: (
          <>
            <div className={styles.heading + " " + styles.headingH3}>
              <h3>列标题</h3>
            </div>
            <Paragraph>
              第三列的内容。支持各种内容块，包括标题、段落、列表等。
            </Paragraph>
            <UnorderedList items={["项目一", "项目二", "项目三"]} />
          </>
        ),
      },
    ] as ColumnData[],
  },
  { id: "block-13", type: "divider", content: null },
  { id: "block-14", type: "heading2", content: "现代化编辑器组件" },
  {
    id: "block-15",
    type: "table",
    content: {
      headers: ["功能", "状态", "优先级", "负责人"],
      rows: [
        ["表格组件", "✅ 完成", "高", "开发团队"],
        ["任务卡片", "🚧 进行中", "中", "UI 团队"],
        ["高亮块", "✅ 完成", "高", "设计团队"],
      ],
      alignments: ["left", "center", "center", "left"],
    },
  },
  {
    id: "block-16",
    type: "checkboxList",
    content: [
      {
        id: "task-1",
        text: "设计编辑器组件架构",
        checked: true,
        children: [
          { id: "task-1-1", text: "分析需求", checked: true },
          { id: "task-1-2", text: "设计接口", checked: true },
          { id: "task-1-3", text: "制定规范", checked: false },
        ],
      },
      {
        id: "task-2",
        text: "实现核心功能",
        checked: false,
        children: [
          { id: "task-2-1", text: "表格组件", checked: true },
          { id: "task-2-2", text: "任务管理", checked: false },
          { id: "task-2-3", text: "高亮块", checked: true },
        ],
      },
      {
        id: "task-3",
        text: "测试和优化",
        checked: false,
      },
    ],
  },
  {
    id: "block-17",
    type: "linkPreview",
    content: {
      url: "https://ui.shadcn.com",
      title: "shadcn/ui - Beautifully designed components",
      description: "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
      siteName: "shadcn/ui",
      type: "website",
      favicon: "⚡",
      publishedTime: "2024-01-15",
      author: "shadcn",
    },
  },
  {
    id: "block-18",
    type: "taskCard",
    content: {
      id: "task-main",
      title: "实现编辑器拖拽功能",
      description: "基于 @dnd-kit 实现编辑器块的拖拽排序功能，支持纵向和横向布局。",
      status: "in-progress",
      priority: "high",
      assignee: {
        id: "user-1",
        name: "张三",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      },
      dueDate: "2024-02-01",
      estimatedTime: 8,
      tags: ["前端", "拖拽", "UI"],
      comments: 3,
      attachments: 2,
      createdAt: "2024-01-20",
      updatedAt: "2024-01-22",
    },
  },
  {
    id: "block-19",
    type: "highlightBlock",
    content: {
      type: "info",
      title: "提示信息",
      content: "这是一个信息提示块，用于展示重要的提示信息。所有新组件都已经成功集成到编辑器中！",
    },
  },
  {
    id: "block-20",
    type: "highlightBlock",
    content: {
      type: "success",
      title: "成功",
      content: "现代化编辑器组件已经完全集成，支持表格、复选框列表、链接预览、任务卡片和高亮块。",
    },
  },
  { id: "block-21", type: "divider", content: null },
  { id: "block-22", type: "heading2", content: "可拖拽任务看板" },
  {
    id: "block-23",
    type: "kanbanBoard",
    content: {
      columns: [
        {
          id: "todo",
          title: "待办事项",
          status: "todo",
          tasks: [
            {
              id: "task-todo-1",
              title: "设计用户界面",
              description: "完成主要页面的UI设计稿",
              status: "todo",
              priority: "high",
              assignee: {
                id: "user-1",
                name: "设计师小王",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=32&h=32&fit=crop&crop=face",
              },
              dueDate: "2024-02-15",
              estimatedTime: 16,
              tags: ["UI设计", "Figma"],
              comments: 2,
              attachments: 3,
              createdAt: "2024-01-25",
              updatedAt: "2024-01-25",
            },
            {
              id: "task-todo-2",
              title: "编写API文档",
              description: "为后端API编写详细的文档",
              status: "todo",
              priority: "medium",
              assignee: {
                id: "user-2",
                name: "后端开发者",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
              },
              dueDate: "2024-02-10",
              estimatedTime: 8,
              tags: ["API", "文档"],
              comments: 0,
              attachments: 1,
              createdAt: "2024-01-26",
              updatedAt: "2024-01-26",
            },
            {
              id: "task-todo-3",
              title: "准备项目演示",
              description: "为下周的项目演示准备PPT和演示数据",
              status: "todo",
              priority: "low",
              assignee: {
                id: "user-3",
                name: "产品经理",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
              },
              dueDate: "2024-02-05",
              estimatedTime: 4,
              tags: ["演示", "PPT"],
              comments: 1,
              attachments: 0,
              createdAt: "2024-01-27",
              updatedAt: "2024-01-27",
            },
          ],
        },
        {
          id: "in-progress",
          title: "进行中",
          status: "in-progress",
          tasks: [
            {
              id: "task-progress-1",
              title: "实现拖拽功能",
              description: "基于 @dnd-kit 实现看板拖拽功能",
              status: "in-progress",
              priority: "high",
              assignee: {
                id: "user-4",
                name: "前端开发者",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
              },
              dueDate: "2024-02-01",
              estimatedTime: 12,
              tags: ["React", "@dnd-kit", "拖拽"],
              comments: 5,
              attachments: 2,
              createdAt: "2024-01-20",
              updatedAt: "2024-01-28",
            },
            {
              id: "task-progress-2",
              title: "数据库优化",
              description: "优化查询性能，添加索引",
              status: "in-progress",
              priority: "medium",
              assignee: {
                id: "user-5",
                name: "数据库管理员",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
              },
              dueDate: "2024-02-03",
              estimatedTime: 6,
              tags: ["数据库", "优化", "索引"],
              comments: 3,
              attachments: 1,
              createdAt: "2024-01-22",
              updatedAt: "2024-01-28",
            },
          ],
        },
        {
          id: "done",
          title: "已完成",
          status: "done",
          tasks: [
            {
              id: "task-done-1",
              title: "项目初始化",
              description: "创建项目结构，配置开发环境",
              status: "done",
              priority: "high",
              assignee: {
                id: "user-6",
                name: "技术负责人",
                avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=32&h=32&fit=crop&crop=face",
              },
              dueDate: "2024-01-15",
              estimatedTime: 8,
              tags: ["初始化", "配置"],
              comments: 4,
              attachments: 2,
              createdAt: "2024-01-10",
              updatedAt: "2024-01-15",
            },
            {
              id: "task-done-2",
              title: "需求分析",
              description: "完成详细的需求分析和功能规格说明",
              status: "done",
              priority: "high",
              assignee: {
                id: "user-7",
                name: "业务分析师",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face",
              },
              dueDate: "2024-01-12",
              estimatedTime: 16,
              tags: ["需求", "分析", "文档"],
              comments: 8,
              attachments: 5,
              createdAt: "2024-01-08",
              updatedAt: "2024-01-12",
            },
            {
              id: "task-done-3",
              title: "技术选型",
              description: "确定项目技术栈和架构设计",
              status: "done",
              priority: "medium",
              assignee: {
                id: "user-8",
                name: "架构师",
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=32&h=32&fit=crop&crop=face",
              },
              dueDate: "2024-01-18",
              estimatedTime: 12,
              tags: ["架构", "技术栈"],
              comments: 6,
              attachments: 3,
              createdAt: "2024-01-15",
              updatedAt: "2024-01-18",
            },
          ],
        },
      ],
    },
  },
];

export const Editor: React.FC = () => {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  return (
    <div className={styles.editorWrapper}>
      <Toolbar />
      <DocumentTitle defaultTitle="飞书编辑器纯UI版" />
      <DocumentMeta author="用户" lastModified="今天修改" />
      <EditorContent
        blocks={blocks}
        activeBlockId={activeBlockId}
        setActiveBlockId={setActiveBlockId}
      />
    </div>
  );
};