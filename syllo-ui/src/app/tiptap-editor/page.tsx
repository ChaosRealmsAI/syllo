"use client";

import { useState } from "react";
import { TiptapDocumentEditor } from "@/components/tiptap-editor/TiptapDocumentEditor";

// 初始内容 - Tiptap JSON 格式
const initialContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "产品文档" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "这是一个基于 Tiptap 的可编辑文档。你可以直接编辑内容，支持拖拽排序，保留了所有飞书风格的样式。"
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "快速开始" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "输入 '/' 可以调出命令菜单，支持以下功能："
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
              content: [{ type: "text", text: "标题 (H1-H5)" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "段落文本" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "有序列表和无序列表" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "代码块" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "引用块" }]
            }
          ]
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "分割线" }]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "代码示例" }]
    },
    {
      type: "codeBlock",
      attrs: { language: "javascript" },
      content: [
        {
          type: "text",
          text: `// Tiptap 编辑器示例代码
const editor = new Editor({
  element: document.querySelector('.editor'),
  extensions: [StarterKit],
  content: '<p>Hello World!</p>',
})`
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "引用示例" }]
    },
    {
      type: "blockquote",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "这是一个引用块。Tiptap 提供了强大的编辑器功能，同时保持了优秀的性能和可扩展性。"
            }
          ]
        }
      ]
    },
    {
      type: "horizontalRule"
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "三级标题示例" }]
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "所有的样式都保留了飞书的视觉风格，编辑体验流畅自然。"
        }
      ]
    }
  ]
};

export default function TiptapEditorPage() {
  const [content, setContent] = useState(initialContent);

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
    console.log('Content updated:', newContent);
  };

  // 设置页面标题
  if (typeof document !== 'undefined') {
    document.title = 'Tiptap 编辑器 - Syllo UI';
  }

  return (
    <TiptapDocumentEditor
      initialContent={content}
      onContentChange={handleContentChange}
      title="Tiptap 可编辑文档"
      breadcrumbs={[
        { id: '1', label: '文档' },
        { id: '2', label: 'Tiptap 编辑器' }
      ]}
      lastModified="最近修改: 刚刚"
      onShareClick={() => alert('分享功能')}
      userName="用户"
    />
  );
}