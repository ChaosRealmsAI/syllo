import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import type { ComputePositionConfig, computePosition } from '@floating-ui/dom'
import { findElementNearMouse } from './helpers/findElementNearMouse'

export interface DragHandleOptions {
  element: HTMLElement
  computePositionConfig?: ComputePositionConfig
  onNodeHover?: (element: HTMLElement | null) => void
}

export const dragHandlePluginKey = new PluginKey('dragHandle')

export const DragHandleExtension = Extension.create<DragHandleOptions>({
  name: 'dragHandle',

  addOptions() {
    return {
      element: document.createElement('div'),
      computePositionConfig: {
        placement: 'left-start',
        strategy: 'absolute',
        offset: 8,
      } as any,
      onNodeHover: () => {},
    }
  },

  addProseMirrorPlugins() {
    const { element, onNodeHover } = this.options
    const editor = this.editor

    let currentElement: HTMLElement | null = null
    let rafId: number | null = null
    let pendingMouseCoords: { x: number; y: number } | null = null
    let isMouseOverHandle = false

    // 隐藏句柄
    const hideHandle = () => {
      if (element) {
        element.style.visibility = 'hidden'
        element.style.pointerEvents = 'none'
      }
    }

    // 显示句柄
    const showHandle = () => {
      if (element) {
        element.style.visibility = 'visible'
        // 句柄始终可以接收鼠标事件
        element.style.pointerEvents = 'auto'
      }
    }

    // 定位句柄
    const positionHandle = async (targetElement: HTMLElement) => {
      const { computePosition } = await import('@floating-ui/dom')

      const virtualElement = {
        getBoundingClientRect: () => targetElement.getBoundingClientRect(),
      }

      const position = await computePosition(
        virtualElement,
        element,
        this.options.computePositionConfig
      )

      Object.assign(element.style, {
        position: position.strategy,
        left: `${position.x}px`,
        top: `${position.y}px`,
      })
    }

    return [
      new Plugin({
        key: dragHandlePluginKey,

        view: (view: EditorView) => {
          // 初始化元素样式
          element.style.position = 'absolute'
          element.style.visibility = 'hidden'
          element.style.pointerEvents = 'none'
          element.style.zIndex = '1000'

          // 添加句柄的鼠标事件监听
          element.addEventListener('mouseenter', () => {
            isMouseOverHandle = true
          })

          element.addEventListener('mouseleave', () => {
            isMouseOverHandle = false
            // 延迟检查，避免快速移动时的闪烁
            setTimeout(() => {
              if (!isMouseOverHandle && !pendingMouseCoords) {
                hideHandle()
                currentElement = null
                onNodeHover?.(null)
              }
            }, 100)
          })

          // 添加到编辑器容器
          if (view.dom.parentElement) {
            view.dom.parentElement.appendChild(element)
          }

          return {
            destroy() {
              if (rafId) {
                cancelAnimationFrame(rafId)
                rafId = null
              }
              if (element && element.parentNode) {
                element.parentNode.removeChild(element)
              }
            }
          }
        },

        props: {
          handleDOMEvents: {
            mousemove(view, event) {
              // 如果鼠标在句柄上，保持当前状态
              const target = event.target as HTMLElement
              if (target.closest('.drag-handle-ui')) {
                isMouseOverHandle = true
                return false
              }

              // 存储鼠标坐标并使用 RAF 优化性能
              pendingMouseCoords = { x: event.clientX, y: event.clientY }

              if (rafId) {
                return false
              }

              rafId = requestAnimationFrame(() => {
                rafId = null

                if (!pendingMouseCoords) {
                  return
                }

                const { x, y } = pendingMouseCoords
                pendingMouseCoords = null

                // 查找鼠标附近的元素
                const nearElement = findElementNearMouse({
                  x,
                  y,
                  editor,
                })

                // 只在元素变化时更新句柄
                if (nearElement !== currentElement) {
                  if (nearElement) {
                    currentElement = nearElement

                    // 定位并显示句柄
                    positionHandle(nearElement)
                    showHandle()

                    // 通知外部组件
                    onNodeHover?.(nearElement)
                  } else if (!isMouseOverHandle) {
                    // 鼠标离开所有元素，且不在句柄上
                    currentElement = null
                    hideHandle()
                    onNodeHover?.(null)
                  }
                }
              })

              return false
            },

            mouseleave(view, event) {
              // 如果鼠标移动到句柄上，不要隐藏
              const relatedTarget = event.relatedTarget as HTMLElement
              if (relatedTarget && relatedTarget.closest('.drag-handle-ui')) {
                return false
              }

              // 鼠标离开编辑器
              hideHandle()
              currentElement = null
              onNodeHover?.(null)
              return false
            }
          }
        }
      })
    ]
  },
})