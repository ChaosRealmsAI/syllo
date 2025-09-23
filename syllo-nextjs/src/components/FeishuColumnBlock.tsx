'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Editor } from '@tiptap/core'
import '../styles/feishu-columns.css'

interface FeishuColumnBlockProps {
  editor?: Editor  // Made optional for future use
}

export default function FeishuColumnBlock({ editor: _editor }: FeishuColumnBlockProps) {
  const [columns, setColumns] = useState<number[]>([33.33, 33.34, 33.33])
  const [resizingIndex, setResizingIndex] = useState<number | null>(null)
  const [hoveredGap, setHoveredGap] = useState<number | null>(null)
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef<number>(0)
  const startWidthsRef = useRef<number[]>([])

  // 处理列间拖拽
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

      const newWidths = [...startWidthsRef.current]
      const leftWidth = newWidths[resizingIndex] + deltaPercent
      const rightWidth = newWidths[resizingIndex + 1] - deltaPercent

      // 限制最小宽度为10%
      if (leftWidth >= 10 && rightWidth >= 10 && leftWidth <= 90 && rightWidth <= 90) {
        newWidths[resizingIndex] = leftWidth
        newWidths[resizingIndex + 1] = rightWidth
        setColumns(newWidths)
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
    const totalWidth = newColumns[afterIndex] + newColumns[afterIndex + 1]
    const newWidth = totalWidth / 3

    newColumns[afterIndex] = newWidth
    newColumns[afterIndex + 1] = newWidth
    newColumns.splice(afterIndex + 1, 0, newWidth)

    setColumns(newColumns)
  }

  // 移除列
  const removeColumn = (index: number) => {
    if (columns.length <= 2) return

    const newColumns = [...columns]
    const removedWidth = newColumns[index]
    newColumns.splice(index, 1)

    // 重新分配宽度
    const totalWidth = newColumns.reduce((sum, w) => sum + w, 0)
    const scale = 100 / totalWidth
    setColumns(newColumns.map(w => w * scale))
  }

  return (
    <div className="feishu-column-block">
      {/* 列容器 */}
      <div
        ref={containerRef}
        className="grid-block"
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          minHeight: '120px',
          backgroundColor: '#ffffff',
        }}
      >
        {columns.map((width, index) => (
          <React.Fragment key={index}>
            {/* 列内容 */}
            <div
              className="column"
              onMouseEnter={() => setHoveredColumn(index)}
              onMouseLeave={() => setHoveredColumn(null)}
              style={{
                width: `${width}%`,
                flex: `0 0 ${width}%`,
                position: 'relative',
                backgroundColor: hoveredColumn === index ? '#f7f7f7' : '#ffffff',
                transition: 'background-color 0.2s',
                border: 'none',
                borderRadius: '0',
              }}
            >
              {/* 可编辑内容区 */}
              <div
                className="column-content"
                contentEditable
                suppressContentEditableWarning
                style={{
                  padding: '16px',
                  minHeight: '100px',
                  outline: 'none',
                }}
              >
                <p style={{ margin: 0, color: '#1f2329', fontSize: '14px', lineHeight: '22px' }}>列 {index + 1}</p>
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
                  {Math.round(width)}%
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.color = '#ff4d4f';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.color = '#646a73';
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
                  left: `${columns.slice(0, index + 1).reduce((sum, w) => sum + w, 0)}%`,
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
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
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
      <div className="toolbar" style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-start' }}>
        <button
          onClick={() => {
            const newCount = columns.length + 1
            setColumns(Array(newCount).fill(100 / newCount))
          }}
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
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (columns.length < 6) {
              e.currentTarget.style.backgroundColor = '#f5f6f7';
            }
          }}
          onMouseLeave={(e) => {
            if (columns.length < 6) {
              e.currentTarget.style.backgroundColor = '#fff';
            }
          }}
        >
          + 添加列
        </button>
        <span style={{
          fontSize: '12px',
          color: '#8f959e',
          display: 'flex',
          alignItems: 'center',
        }}>
          {columns.length} 列 · 拖动分隔线调整宽度
        </span>
      </div>
    </div>
  )
}