import React, { useRef, useState, useEffect } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import { Node } from '@tiptap/pm/model'
import { Editor } from '@tiptap/core'

interface ColumnBlockViewProps {
  node: Node
  updateAttributes: (attrs: any) => void
  editor: Editor
  getPos: () => number
}

export function ColumnBlockView({ node, editor, getPos }: ColumnBlockViewProps) {
  const [resizing, setResizing] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef<number>(0)
  const startWidthsRef = useRef<number[]>([])

  // 获取列的宽度数组
  const getColumnWidths = () => {
    const widths: number[] = []
    node.forEach((child) => {
      const width = child.attrs.width
      if (width) {
        widths.push(parseFloat(width))
      } else {
        // 默认平均分配
        widths.push(100 / node.childCount)
      }
    })
    return widths
  }

  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setResizing(index)
    startXRef.current = e.clientX
    startWidthsRef.current = getColumnWidths()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizing === null || !containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const deltaX = e.clientX - startXRef.current
      const deltaPercent = (deltaX / containerWidth) * 100

      const newWidths = [...startWidthsRef.current]

      // 调整相邻两列的宽度
      const leftWidth = newWidths[resizing] + deltaPercent
      const rightWidth = newWidths[resizing + 1] - deltaPercent

      // 限制最小宽度为10%
      if (leftWidth >= 10 && rightWidth >= 10) {
        newWidths[resizing] = leftWidth
        newWidths[resizing + 1] = rightWidth

        // 更新列的宽度属性
        const tr = editor.state.tr
        const pos = getPos()

        node.forEach((child, offset, index) => {
          tr.setNodeMarkup(pos + offset + 1, null, {
            ...child.attrs,
            width: `${newWidths[index]}%`
          })
        })

        editor.view.dispatch(tr)
      }
    }

    const handleMouseUp = () => {
      setResizing(null)
    }

    if (resizing !== null) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
  }, [resizing, editor, getPos, node])

  const widths = getColumnWidths()

  return (
    <NodeViewWrapper className="column-block-wrapper">
      <div
        ref={containerRef}
        className="column-block-resizable"
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
        }}
      >
        {/* 渲染所有列的拖拽手柄 */}
        {Array.from({ length: node.childCount - 1 }).map((_, index) => {
          const leftSum = widths.slice(0, index + 1).reduce((a, b) => a + b, 0)
          return (
            <div
              key={index}
              className="column-resizer"
              onMouseDown={(e) => handleMouseDown(index, e)}
              style={{
                cursor: 'col-resize',
                width: '20px',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${leftSum}%`,
                transform: 'translateX(-50%)',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* 竖线已被移除 */}
            </div>
          )
        })}
      </div>
    </NodeViewWrapper>
  )
}