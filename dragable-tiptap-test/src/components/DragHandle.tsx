'use client'

import { useEffect, useRef } from 'react'
import type { Editor } from '@tiptap/react'
import { DragHandleExtension } from '@/extensions/drag-handle/DragHandleExtension'

interface DragHandleProps {
  editor: Editor | null
}

export const DragHandle = ({ editor }: DragHandleProps) => {
  const handleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editor || !handleRef.current) return

    // 创建拖拽句柄扩展
    const extension = DragHandleExtension.configure({
      element: handleRef.current,
      onNodeHover: (element) => {
        if (element) {
          // 当悬停在节点上时，可以在这里添加额外的逻辑
          console.log('Hovering node:', element)
        }
      },
    })

    // 注册扩展
    editor.extensionManager.extensions.push(extension)

    // 重新配置编辑器以应用新扩展
    const state = editor.state
    const plugins = [...state.plugins]

    extension.addProseMirrorPlugins().forEach(plugin => {
      plugins.push(plugin)
    })

    editor.view.updateState(
      state.reconfigure({
        plugins
      })
    )

    return () => {
      // 清理：移除插件
      const newPlugins = editor.state.plugins.filter(
        p => p.key !== 'dragHandle'
      )

      editor.view.updateState(
        editor.state.reconfigure({
          plugins: newPlugins
        })
      )
    }
  }, [editor])

  return (
    <div
      ref={handleRef}
      className="drag-handle-ui"
      style={{
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f0f0',
        borderRadius: '4px',
        cursor: 'grab',
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#e0e0e0'
        // 阻止事件冒泡到编辑器
        e.stopPropagation()
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#f0f0f0'
        // 阻止事件冒泡到编辑器
        e.stopPropagation()
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
  )
}