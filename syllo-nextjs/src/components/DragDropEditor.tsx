'use client'

import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'

// 自定义扩展
import { ColumnLayout } from '../extensions/column-layout'
import { Column } from '../extensions/column'
import { DragHandleConfig } from '../extensions/drag-handle-config'
import { DragDropPlugin } from '../extensions/drag-drop-plugin'

// 样式
import '../styles/drag-drop.css'

const lowlight = createLowlight(common)

export default function DragDropEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        dropcursor: false,  // 禁用默认的dropcursor，使用自定义的
      }),
      Image.configure({
        draggable: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      // 列布局扩展
      ColumnLayout,
      Column,
      // 拖拽句柄
      DragHandleConfig,
    ],
    content: `
      <h1>拖拽编辑器示例</h1>
      <p>这是一个支持拖拽的编辑器。你可以：</p>
      <ul>
        <li>拖动段落、标题等块级元素上下移动</li>
        <li>拖动到块的边缘创建列布局</li>
        <li>最多支持5列</li>
      </ul>
      <h2>测试内容</h2>
      <p>这是第一段内容，你可以尝试拖动它。</p>
      <p>这是第二段内容，试试拖到第一段的左边或右边。</p>
      <blockquote>这是一个引用块，也可以拖动。</blockquote>
      <p>更多测试内容...</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none',
      },
      handleDrop: false, // 禁用默认的drop处理，使用自定义的
    },
    immediatelyRender: false,
  })

  // 设置全局编辑器引用（供拖拽句柄使用）
  useEffect(() => {
    if (editor) {
      (window as any).tiptapEditor = editor
    }

    return () => {
      delete (window as any).tiptapEditor
    }
  }, [editor])

  // 添加自定义拖拽插件
  useEffect(() => {
    if (!editor || !editor.view) return

    // 获取当前状态并添加插件
    const { state } = editor.view
    const plugins = [...state.plugins, DragDropPlugin]

    // 创建新状态
    const newState = state.reconfigure({ plugins })

    // 更新视图
    editor.view.updateState(newState)

    return () => {
      // 清理：移除插件
      if (editor && editor.view) {
        const { state } = editor.view
        const plugins = state.plugins.filter(p => p !== DragDropPlugin)
        const newState = state.reconfigure({ plugins })
        editor.view.updateState(newState)
      }
    }
  }, [editor])

  // 添加工具栏
  const addColumnLayout = () => {
    if (!editor) return
    editor.chain().focus().setColumnLayout(2).run()
  }

  const toggleBold = () => {
    if (!editor) return
    editor.chain().focus().toggleBold().run()
  }

  const toggleItalic = () => {
    if (!editor) return
    editor.chain().focus().toggleItalic().run()
  }

  const toggleHeading = (level: 1 | 2 | 3) => {
    if (!editor) return
    editor.chain().focus().toggleHeading({ level }).run()
  }

  const toggleBulletList = () => {
    if (!editor) return
    editor.chain().focus().toggleBulletList().run()
  }

  const toggleOrderedList = () => {
    if (!editor) return
    editor.chain().focus().toggleOrderedList().run()
  }

  const toggleBlockquote = () => {
    if (!editor) return
    editor.chain().focus().toggleBlockquote().run()
  }

  const toggleCodeBlock = () => {
    if (!editor) return
    editor.chain().focus().toggleCodeBlock().run()
  }

  if (!editor) {
    return <div>加载中...</div>
  }

  return (
    <div className="editor-container">
      {/* 工具栏 */}
      <div className="toolbar" style={{
        display: 'flex',
        gap: '8px',
        padding: '12px',
        borderBottom: '1px solid #e0e0e0',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={toggleBold}
          className={editor.isActive('bold') ? 'active' : ''}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            background: editor.isActive('bold') ? '#e0e0e0' : '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          B
        </button>
        <button
          onClick={toggleItalic}
          className={editor.isActive('italic') ? 'active' : ''}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            background: editor.isActive('italic') ? '#e0e0e0' : '#fff',
            cursor: 'pointer',
            fontStyle: 'italic',
          }}
        >
          I
        </button>

        <div style={{ width: '1px', background: '#ddd', margin: '0 4px' }} />

        <button
          onClick={() => toggleHeading(1)}
          className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            background: editor.isActive('heading', { level: 1 }) ? '#e0e0e0' : '#fff',
            cursor: 'pointer',
          }}
        >
          H1
        </button>
        <button
          onClick={() => toggleHeading(2)}
          className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            background: editor.isActive('heading', { level: 2 }) ? '#e0e0e0' : '#fff',
            cursor: 'pointer',
          }}
        >
          H2
        </button>
        <button
          onClick={() => toggleHeading(3)}
          className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            background: editor.isActive('heading', { level: 3 }) ? '#e0e0e0' : '#fff',
            cursor: 'pointer',
          }}
        >
          H3
        </button>

        <div style={{ width: '1px', background: '#ddd', margin: '0 4px' }} />

        <button
          onClick={toggleBulletList}
          className={editor.isActive('bulletList') ? 'active' : ''}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            background: editor.isActive('bulletList') ? '#e0e0e0' : '#fff',
            cursor: 'pointer',
          }}
        >
          • 列表
        </button>
        <button
          onClick={toggleOrderedList}
          className={editor.isActive('orderedList') ? 'active' : ''}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            background: editor.isActive('orderedList') ? '#e0e0e0' : '#fff',
            cursor: 'pointer',
          }}
        >
          1. 列表
        </button>

        <div style={{ width: '1px', background: '#ddd', margin: '0 4px' }} />

        <button
          onClick={toggleBlockquote}
          className={editor.isActive('blockquote') ? 'active' : ''}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            background: editor.isActive('blockquote') ? '#e0e0e0' : '#fff',
            cursor: 'pointer',
          }}
        >
          " 引用
        </button>
        <button
          onClick={toggleCodeBlock}
          className={editor.isActive('codeBlock') ? 'active' : ''}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            background: editor.isActive('codeBlock') ? '#e0e0e0' : '#fff',
            cursor: 'pointer',
          }}
        >
          {'<>'} 代码
        </button>

        <div style={{ width: '1px', background: '#ddd', margin: '0 4px' }} />

        <button
          onClick={addColumnLayout}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #3b82f6',
            background: '#3b82f6',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          ⊞ 创建列布局
        </button>
      </div>

      {/* 编辑器内容 */}
      <div
        className="editor-content"
        style={{
          border: '1px solid #e0e0e0',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          minHeight: '400px',
          position: 'relative',
        }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* 提示信息 */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#f0f8ff',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666',
      }}>
        <strong>使用提示：</strong>
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>将鼠标悬停在段落上会显示拖拽句柄（⋮⋮）</li>
          <li>拖动句柄可以移动整个块</li>
          <li>拖到其他块的边缘（出现蓝色竖线）可以创建列布局</li>
          <li>拖到其他位置（出现蓝色横线）可以调整顺序</li>
          <li>最多支持5列并排</li>
        </ul>
      </div>
    </div>
  )
}