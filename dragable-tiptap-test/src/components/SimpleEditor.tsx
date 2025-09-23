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

import './Editor.css'

const initialContent: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: '富文本编辑器示例' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '这是一个功能丰富的TipTap编辑器，支持多种内容类型和格式。' }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '文本格式化' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: '支持 ' },
        { type: 'text', text: '粗体', marks: [{ type: 'bold' }] },
        { type: 'text', text: '、' },
        { type: 'text', text: '斜体', marks: [{ type: 'italic' }] },
        { type: 'text', text: '、' },
        { type: 'text', text: '下划线', marks: [{ type: 'underline' }] },
        { type: 'text', text: '、' },
        { type: 'text', text: '删除线', marks: [{ type: 'strike' }] },
        { type: 'text', text: ' 和 ' },
        { type: 'text', text: '行内代码', marks: [{ type: 'code' }] },
        { type: 'text', text: '。' }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '列表类型' }]
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: '无序列表' }]
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '项目一' }]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '项目二' }]
            },
            {
              type: 'bulletList',
              content: [
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: '子项目 2.1' }]
                    }
                  ]
                },
                {
                  type: 'listItem',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: '子项目 2.2' }]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '项目三' }]
            }
          ]
        }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: '有序列表' }]
    },
    {
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '第一步' }]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '第二步' }]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '第三步' }]
            }
          ]
        }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: '任务列表' }]
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
              content: [{ type: 'text', text: '已完成任务' }]
            }
          ]
        },
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '待办任务' }]
            }
          ]
        },
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '另一个待办' }]
            }
          ]
        }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '代码块' }]
    },
    {
      type: 'codeBlock',
      attrs: { language: 'javascript' },
      content: [
        {
          type: 'text',
          text: 'function hello(name) {\n  console.log(`Hello, ${name}!`);\n  return true;\n}'
        }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '引用块' }]
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '"设计不是看起来怎样，设计是如何运作。" - Steve Jobs'
            }
          ]
        }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '分割线' }]
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '使用分割线来区分不同的内容章节：' }]
    },
    {
      type: 'horizontalRule'
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '分割线后的新章节。' }]
    }
  ]
}

const SimpleEditor = () => {
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

  return (
    <div className="editor-container">
      <div className="editor-wrapper">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default SimpleEditor