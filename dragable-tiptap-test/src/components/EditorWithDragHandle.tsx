'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import type { JSONContent } from '@tiptap/core'
import { DragHandleReact as DragHandle } from '../extension/extension-drag-handle/src/react/DragHandleReact'

import './Editor.css'
import './DragHandle.css'

const initialContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: '拖拽功能测试' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '将鼠标悬停在段落左侧，即可看到拖拽句柄。' }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '功能测试' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '这是第一个段落。鼠标悬停在左侧会显示拖拽句柄 ⋮' }
      ]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '这是第二个段落。每个块级元素都可以拖拽。' }
      ]
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '列表项也可以拖拽' }]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '任何块级元素都支持' }]
            }
          ]
        }
      ]
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '引用块也可以拖拽重排'
            }
          ]
        }
      ]
    },
    {
      type: 'codeBlock',
      content: [
        {
          type: 'text',
          text: '// 代码块同样支持拖拽\nconst dragHandle = "⋮"'
        }
      ]
    }
  ]
}

const EditorWithDragHandle = () => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'code-block',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'blockquote',
          },
        },
      }),
      Placeholder.configure({
        placeholder: '开始输入...',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Underline,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h1>TipTap 富文本编辑器 - 拖拽功能测试</h1>
        <p>将鼠标悬停在任何段落左侧即可看到拖拽句柄（⋮⋮⋮）</p>
      </div>
      <DragHandle editor={editor}>
        <div className="drag-handle-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
            <circle cx="6" cy="5" r="1"></circle>
            <circle cx="6" cy="12" r="1"></circle>
            <circle cx="6" cy="19" r="1"></circle>
            <circle cx="18" cy="5" r="1"></circle>
            <circle cx="18" cy="12" r="1"></circle>
            <circle cx="18" cy="19" r="1"></circle>
          </svg>
        </div>
      </DragHandle>
      <EditorContent editor={editor} />
    </div>
  )
}

export default EditorWithDragHandle