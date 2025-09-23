"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Dropcursor from "@tiptap/extension-dropcursor";
import { ColumnLayout } from "@/extensions/ColumnLayout";
import SimpleDragHandle from "./SimpleDragHandle";
import "@/styles/editor.css";

export default function DragableEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // 确保 ProseMirror 处理拖放
        dropcursor: false, // 我们用自己的 Dropcursor 扩展
      }),
      Placeholder.configure({
        placeholder: "开始输入内容，或拖拽块来创建布局...",
      }),
      Dropcursor.configure({
        color: "#3B82F6",
        width: 2,
        class: "dropcursor",
      }),
      ColumnLayout,
    ],
    content: `
      <h1>拖拽编辑器演示</h1>
      <p>这是一个段落块。将鼠标悬停在块的左侧以显示拖拽句柄。</p>
      <h2>功能特性</h2>
      <ul>
        <li>纵向拖拽：上下调整块的顺序</li>
        <li>横向拖拽：创建列布局（最多5列）</li>
        <li>视觉指示：蓝色横线表示纵向插入，蓝色竖线表示横向创建列</li>
      </ul>
      <blockquote>
        <p>尝试拖动这个引用块到其他位置，或者拖到另一个块的左侧来创建列布局。</p>
      </blockquote>
      <p>列布局规则：列内只能纵向排列内容，不能再创建子列。</p>
    `,
    editorProps: {
      attributes: {
        class: "prose prose-lg focus:outline-none",
      },
      // 让 ProseMirror 使用默认的拖放处理
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="editor-wrapper">
      <SimpleDragHandle editor={editor} />
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}