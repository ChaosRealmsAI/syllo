import type { Editor } from '@tiptap/core'

export interface FindElementOptions {
  x: number
  y: number
  editor: Editor
  bandHeight?: number
}

export const findElementNearMouse = (options: FindElementOptions) => {
  const { x, y, editor, bandHeight = 20 } = options

  // 创建检测区域 - 扩大热区包含句柄位置
  const rect = {
    top: y - bandHeight,
    bottom: y + bandHeight,
    left: 0, // 从最左边开始，包含句柄区域
    right: x + 100, // 检测鼠标右侧100px内的元素
  }

  const root = editor.view.dom as HTMLElement

  // 获取所有可能的候选元素
  const candidates = [...root.querySelectorAll<HTMLElement>('*')]
    .filter(candidate => {
      // 排除拖拽句柄元素本身和其子元素
      if (candidate.closest('.drag-handle-ui')) {
        return false
      }
      // 过滤出是 ProseMirror 节点的元素
      try {
        const pos = editor.view.posAtDOM(candidate, 0)
        return pos >= 0
      } catch {
        return false
      }
    })
    .filter(candidate => {
      // 过滤出在检测区域内的元素
      const candidateRect = candidate.getBoundingClientRect()
      return !(
        candidateRect.bottom < rect.top ||
        candidateRect.top > rect.bottom ||
        candidateRect.right < rect.left ||
        candidateRect.left > rect.right
      )
    })

  if (!candidates || candidates.length === 0) {
    return null
  }

  // 返回最接近的元素
  return candidates[0]
}