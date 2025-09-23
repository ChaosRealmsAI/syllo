'use client'

import { Editor } from '@tiptap/react'

interface EditorToolbarProps {
  editor: Editor
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  return (
    <div className="border-b border-gray-200 bg-white p-4">
      <div className="flex gap-2 flex-wrap">
        {/* 基础格式化按钮 */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('bold') ? 'bg-gray-800 text-white' : 'bg-white border'
          }`}
        >
          Bold
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('italic') ? 'bg-gray-800 text-white' : 'bg-white border'
          }`}
        >
          Italic
        </button>

        <div className="w-px bg-gray-300 mx-2" />

        {/* 标题按钮 */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-800 text-white' : 'bg-white border'
          }`}
        >
          H2
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-800 text-white' : 'bg-white border'
          }`}
        >
          H3
        </button>

        <div className="w-px bg-gray-300 mx-2" />

        {/* 列布局按钮 */}
        <button
          onClick={() => editor.chain().focus().setColumns(2).run()}
          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          2列
        </button>

        <button
          onClick={() => editor.chain().focus().setColumns(3).run()}
          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          3列
        </button>

        <button
          onClick={() => editor.chain().focus().setColumns(4).run()}
          className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          4列
        </button>

        <button
          onClick={() => editor.chain().focus().unsetColumns().run()}
          className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
        >
          移除列
        </button>
      </div>
    </div>
  )
}