'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ColumnContentEditor } from './ColumnContentEditor'
import type { Column } from './types'
import '../../styles/column-editor.css'

export default function ColumnEditor() {
  const [columns, setColumns] = useState<Column[]>([
    { width: 33.33, content: '<p>列 1</p>' },
    { width: 33.34, content: '<p>列 2</p>' },
    { width: 33.33, content: '<p>列 3</p>' },
  ])
  const [resizingIndex, setResizingIndex] = useState<number | null>(null)
  const [hoveredGap, setHoveredGap] = useState<number | null>(null)
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef<number>(0)
  const startWidthsRef = useRef<Column[]>([])

  // 处理列间拖拽调整宽度
  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setResizingIndex(index)
    startXRef.current = e.clientX
    startWidthsRef.current = [...columns]
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingIndex === null || !containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const deltaX = e.clientX - startXRef.current
      const deltaPercent = (deltaX / containerWidth) * 100

      const newColumns = [...startWidthsRef.current]
      const leftWidth = newColumns[resizingIndex].width + deltaPercent
      const rightWidth = newColumns[resizingIndex + 1].width - deltaPercent

      // 限制最小宽度为10%
      if (leftWidth >= 10 && rightWidth >= 10 && leftWidth <= 90 && rightWidth <= 90) {
        newColumns[resizingIndex] = { ...newColumns[resizingIndex], width: leftWidth }
        newColumns[resizingIndex + 1] = { ...newColumns[resizingIndex + 1], width: rightWidth }
        setColumns(newColumns)
      }
    }

    const handleMouseUp = () => {
      setResizingIndex(null)
      document.body.classList.remove('column-resizing')
    }

    if (resizingIndex !== null) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.classList.add('column-resizing')

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.classList.remove('column-resizing')
      }
    }
  }, [resizingIndex, columns])

  // 添加新列
  const addColumn = (afterIndex: number) => {
    const newColumns = [...columns]
    const totalWidth = newColumns[afterIndex].width + newColumns[afterIndex + 1].width
    const newWidth = totalWidth / 3

    newColumns[afterIndex] = { ...newColumns[afterIndex], width: newWidth }
    newColumns[afterIndex + 1] = { ...newColumns[afterIndex + 1], width: newWidth }
    newColumns.splice(afterIndex + 1, 0, {
      width: newWidth,
      content: `<p>列 ${newColumns.length + 1}</p>`
    })

    setColumns(newColumns)
  }

  // 移除列
  const removeColumn = (index: number) => {
    if (columns.length <= 2) return

    const newColumns = [...columns]
    newColumns.splice(index, 1)

    // 重新分配宽度
    const totalWidth = 100
    const newWidth = totalWidth / newColumns.length
    setColumns(newColumns.map(col => ({ ...col, width: newWidth })))
  }

  // 添加新列（底部按钮）
  const addNewColumn = () => {
    const newCount = columns.length + 1
    setColumns(Array(newCount).fill(null).map((_, i) => ({
      width: 100 / newCount,
      content: `<p>列 ${i + 1}</p>`
    })))
  }

  return (
    <div className="column-editor-container">
      {/* 列容器 */}
      <div
        ref={containerRef}
        className="grid-block"
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          minHeight: '120px',
        }}
      >
        {columns.map((column, index) => (
          <React.Fragment key={index}>
            {/* 列内容 */}
            <div
              className="column"
              onMouseEnter={() => setHoveredColumn(index)}
              onMouseLeave={() => setHoveredColumn(null)}
              style={{
                width: `${column.width}%`,
                flex: `0 0 ${column.width}%`,
                position: 'relative',
              }}
            >
              {/* TipTap 编辑器内容区 */}
              <div className="column-content" style={{ padding: '16px', minHeight: '100px' }}>
                <ColumnContentEditor initialContent={column.content} index={index} />
              </div>

              {/* 百分比标签 */}
              {resizingIndex !== null && (
                <span
                  className="grid-column-percent"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    color: '#ffffff',
                    fontSize: '11px',
                    lineHeight: '16px',
                    fontFamily: 'SF Mono, Monaco, Consolas, monospace',
                    fontWeight: '500',
                    zIndex: 10,
                  }}
                >
                  {Math.round(column.width)}%
                </span>
              )}

              {/* 删除列按钮 */}
              {hoveredColumn === index && columns.length > 2 && (
                <button
                  onClick={() => removeColumn(index)}
                  className="remove-column-btn"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    color: '#646a73',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20,
                    transition: 'all 0.2s',
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {/* 列间控制区 */}
            {index < columns.length - 1 && (
              <div
                className="column-gap"
                onMouseEnter={() => setHoveredGap(index)}
                onMouseLeave={() => setHoveredGap(null)}
                style={{
                  position: 'absolute',
                  left: `${columns.slice(0, index + 1).reduce((sum, col) => sum + col.width, 0)}%`,
                  top: 0,
                  bottom: 0,
                  width: '20px',
                  marginLeft: '-10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  cursor: 'col-resize',
                }}
              >
                {/* 添加列按钮 */}
                {hoveredGap === index && (
                  <button
                    onClick={() => addColumn(index)}
                    className="add-column-btn"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#3370ff',
                      border: 'none',
                      color: '#fff',
                      fontSize: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 20,
                      boxShadow: '0 2px 8px rgba(51, 112, 255, 0.3)',
                    }}
                  >
                    +
                  </button>
                )}

                {/* 拖拽手柄 */}
                <div
                  className="dragger"
                  onMouseDown={(e) => handleMouseDown(index, e)}
                  style={{
                    width: hoveredGap === index || resizingIndex === index ? '3px' : '0',
                    height: '40px',
                    borderRadius: '3px',
                    backgroundColor: resizingIndex === index ? '#3370ff' : (hoveredGap === index ? '#dee0e3' : 'transparent'),
                    transition: 'all 0.2s',
                    cursor: 'col-resize',
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 底部工具栏 */}
      <div className="toolbar" style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={addNewColumn}
          disabled={columns.length >= 6}
          className="toolbar-btn"
          style={{
            padding: '5px 12px',
            borderRadius: '6px',
            border: 'none',
            background: columns.length >= 6 ? '#f5f6f7' : '#fff',
            color: columns.length >= 6 ? '#bbbfc4' : '#1f2329',
            cursor: columns.length >= 6 ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: '500',
          }}
        >
          + 添加列
        </button>
        <span style={{
          fontSize: '12px',
          color: '#8f959e',
        }}>
          {columns.length} 列 · 拖动分隔线调整宽度
        </span>
      </div>
    </div>
  )
}