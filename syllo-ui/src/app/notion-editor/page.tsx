"use client";

import { useState } from 'react';
import { NotionDocumentEditor } from '@/components/notion-editor/NotionDocumentEditor';

// 初始内容示例
const initialContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Welcome to Notion-style Editor" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "这是一个基于 TipTap 的 Notion 风格编辑器。支持原生的编辑功能。"
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "核心功能" }]
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "块级编辑 - 每个内容块都是独立的" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "富文本支持 - 标题、段落、列表等" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Notion风格样式 - 简洁清爽的界面设计" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "使用方式" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "输入 \"/\" 打开命令菜单。使用标准的键盘快捷键："
        }
      ]
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "**Ctrl/Cmd + B** - 粗体" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "*Ctrl/Cmd + I* - 斜体" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "`Ctrl/Cmd + E` - 代码" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "代码示例" }]
    },
    {
      type: "codeBlock",
      attrs: { language: "javascript" },
      content: [
        {
          type: "text",
          text: "// Notion 风格编辑器\nconst editor = new NotionEditor({\n  content: initialContent,\n  onUpdate: (content) => {\n    console.log('Content updated', content);\n  }\n});"
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "试试编辑这个文档，体验Notion风格的编辑器！"
        }
      ]
    }
  ]
};

export default function NotionEditorPage() {
  const [content, setContent] = useState(initialContent);

  const handleContentUpdate = (newContent: any) => {
    setContent(newContent);
    console.log('Content updated:', newContent);
  };

  return (
    <NotionDocumentEditor
      title="Notion 风格文档"
      initialContent={content}
      onContentChange={handleContentUpdate}
      breadcrumbs={[
        { id: '1', label: '工作空间' },
        { id: '2', label: 'Notion 文档' }
      ]}
      userName="用户"
      lastModified="最近修改: 刚刚"
      editMode="edit"
      isPinned={false}
      notificationCount={0}
      initialSidebarCollapsed={false}
    />
  );
}