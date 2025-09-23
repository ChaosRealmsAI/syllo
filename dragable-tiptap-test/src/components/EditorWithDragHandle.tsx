'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { useRef, useEffect, useState } from 'react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import type { JSONContent } from '@tiptap/core'
import { DragHandleExtension } from '@/extensions/drag-handle/DragHandleExtension'

import './Editor.css'

const initialContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: '支持拖拽的编辑器' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '将鼠标悬停在段落左侧，会显示拖拽句柄 ' },
        { type: 'text', text: '⋮', marks: [{ type: 'bold' }] }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '功能说明' }]
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '鼠标悬停检测：自动检测鼠标附近的内容块' }]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '智能显示：只在鼠标靠近时显示拖拽句柄' }]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '性能优化：使用 RAF 优化鼠标移动检测' }]
            }
          ]
        }
      ]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '试试将鼠标移动到这个段落的左侧！' }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: '任务列表示例' }]
    },
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: true },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '实现鼠标检测' }]
            }
          ]
        },
        {
          type: 'taskItem',
          attrs: { checked: true },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '显示拖拽句柄' }]
            }
          ]
        },
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '实现拖拽功能' }]
            }
          ]
        }
      ]
    },
    {
      type: 'codeBlock',
      attrs: { language: 'javascript' },
      content: [
        {
          type: 'text',
          text: '// 代码块也支持拖拽句柄\nconst dragHandle = {\n  show: true,\n  position: "left"\n}'
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
              text: '引用块同样支持拖拽句柄显示'
            }
          ]
        }
      ]
    }
  ]
}

const EditorWithDragHandle = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const [handleElement, setHandleElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (handleRef.current && wrapperRef.current) {
      setHandleElement(handleRef.current)
    }
  }, [])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder: '开始输入...',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      ...(handleElement ? [
        DragHandleExtension.configure({
          element: handleElement,
          onNodeHover: (element) => {
            if (element) {
              console.log('Hovering node:', element)
            }
          },
        })
      ] : []),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8',
        style: 'padding-left: 60px;', // 为拖拽句柄留出空间
      },
    },
  }, [handleElement])

  return (
    <div className="editor-container">
      <div className="editor-wrapper" style={{ position: 'relative' }}>
        {/* Wrapper for Drag Handle - doesn't intercept mouse events */}
        <div
          ref={wrapperRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none', // Critical: wrapper doesn't intercept events
            zIndex: 1000,
          }}
        >
          {/* Drag Handle UI */}
          <div
            ref={handleRef}
            className="drag-handle-ui"
            style={{
              position: 'absolute',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f0f0f0',
              borderRadius: '4px',
              cursor: 'grab',
              transition: 'background 0.2s',
              visibility: 'hidden',
              pointerEvents: 'auto', // Handle can be interacted with
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e0e0e0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f0f0f0'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.cursor = 'grabbing'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.cursor = 'grab'
            }}
          >
            <svg
              width="12"
              height="20"
              viewBox="0 0 12 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="3" cy="3" r="2" fill="#666" />
              <circle cx="9" cy="3" r="2" fill="#666" />
              <circle cx="3" cy="10" r="2" fill="#666" />
              <circle cx="9" cy="10" r="2" fill="#666" />
              <circle cx="3" cy="17" r="2" fill="#666" />
              <circle cx="9" cy="17" r="2" fill="#666" />
            </svg>
          </div>
        </div>
        <EditorContent editor={editor} />
      </div>

      {/* 使用说明 */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: '#f5f5f5',
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: '#666'
      }}>
        <strong>💡 使用提示：</strong>
        <ul style={{ marginTop: '0.5rem', marginBottom: 0, paddingLeft: '1.5rem' }}>
          <li>将鼠标移动到任何段落、标题、列表等内容的左侧</li>
          <li>会自动显示拖拽句柄（灰色的六个点）</li>
          <li>拖拽功能将在下一步实现</li>
        </ul>
      </div>
    </div>
  )
}

export default EditorWithDragHandle