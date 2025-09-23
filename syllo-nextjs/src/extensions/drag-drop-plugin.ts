import { Plugin, PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Node as PMNode } from 'prosemirror-model'
import { NodeSelection } from 'prosemirror-state'

export const dragDropPluginKey = new PluginKey('dragDrop')

interface DragState {
  isDragging: boolean
  draggedNode: PMNode | null
  draggedPos: number
  dropIndicator: 'horizontal' | 'vertical' | null
  dropPos: number
}

// 检测拖拽位置类型
function detectDropPosition(event: DragEvent, view: EditorView) {
  const pos = view.posAtCoords({
    left: event.clientX,
    top: event.clientY,
  })

  if (!pos) return null

  const $pos = view.state.doc.resolve(pos.pos)
  const node = $pos.node()

  // 获取DOM元素
  const dom = view.domAtPos(pos.pos).node as HTMLElement
  if (!dom || !dom.getBoundingClientRect) return null

  const rect = dom.getBoundingClientRect()
  const edgeThreshold = 50 // 边缘50px内触发列创建

  // 检测是否在边缘
  const isLeftEdge = event.clientX < rect.left + edgeThreshold
  const isRightEdge = event.clientX > rect.right - edgeThreshold

  // 检查是否已在列布局中
  const inColumnLayout = $pos.parent.type.name === 'columnLayout' ||
                        $pos.parent.type.name === 'column'

  // 如果在列布局中，且已有5列，不允许横向创建
  if (inColumnLayout) {
    const columnLayout = $pos.parent.type.name === 'columnLayout'
      ? $pos.parent
      : $pos.node($pos.depth - 1)

    if (columnLayout && columnLayout.childCount >= 5) {
      // 只允许纵向移动
      return {
        type: 'vertical' as const,
        pos: pos.pos,
        node: $pos.node(),
        parent: $pos.parent,
      }
    }
  }

  if (isLeftEdge || isRightEdge) {
    return {
      type: 'horizontal' as const,
      side: isLeftEdge ? 'left' : 'right',
      pos: pos.pos,
      node: $pos.node(),
      parent: $pos.parent,
    }
  }

  return {
    type: 'vertical' as const,
    pos: pos.pos,
    node: $pos.node(),
    parent: $pos.parent,
  }
}

// 创建视觉提示元素
function createDropIndicator(type: 'horizontal' | 'vertical') {
  const indicator = document.createElement('div')
  indicator.className = type === 'horizontal'
    ? 'drop-indicator-horizontal'
    : 'drop-indicator-vertical'
  indicator.style.position = 'absolute'
  indicator.style.pointerEvents = 'none'
  indicator.style.zIndex = '1000'

  if (type === 'horizontal') {
    indicator.style.height = '2px'
    indicator.style.background = '#3b82f6'
    indicator.style.width = '100%'
  } else {
    indicator.style.width = '2px'
    indicator.style.background = '#3b82f6'
    indicator.style.height = '100%'
  }

  return indicator
}

// 移动节点（纵向）
function moveNodeVertically(
  view: EditorView,
  fromPos: number,
  toPos: number
): boolean {
  const { state, dispatch } = view
  const { tr } = state

  // 获取要移动的节点
  const node = state.doc.nodeAt(fromPos)
  if (!node) return false

  const nodeSize = node.nodeSize

  // 防止移动到自己内部
  if (toPos >= fromPos && toPos <= fromPos + nodeSize) {
    return false
  }

  // 删除原节点
  tr.delete(fromPos, fromPos + nodeSize)

  // 计算新位置（考虑删除后的位置变化）
  const mappedPos = toPos > fromPos ? toPos - nodeSize : toPos

  // 插入节点到新位置
  tr.insert(mappedPos, node)

  dispatch(tr)
  return true
}

// 创建列布局
function createColumnLayout(
  view: EditorView,
  draggedPos: number,
  targetPos: number,
  side: 'left' | 'right'
): boolean {
  const { state, dispatch } = view
  const { tr, schema } = state

  // 获取被拖拽的节点
  const draggedNode = state.doc.nodeAt(draggedPos)
  if (!draggedNode) return false

  // 获取目标位置的节点
  const $target = state.doc.resolve(targetPos)
  const targetNode = $target.node()

  // 检查是否已在列布局中
  if ($target.parent.type.name === 'columnLayout') {
    // 已有列布局，添加新列
    const columnLayout = $target.parent
    const columnCount = columnLayout.childCount

    if (columnCount >= 5) {
      return false // 已达最大列数
    }

    // 创建新列
    const newColumn = schema.nodes.column.create(null, [draggedNode])

    // 找到插入位置
    const layoutStart = $target.before($target.depth)
    const insertPos = side === 'left' ? targetPos : targetPos + targetNode.nodeSize

    // 插入新列
    tr.insert(insertPos, newColumn)

    // 删除原节点
    const mappedDraggedPos = tr.mapping.map(draggedPos)
    tr.delete(mappedDraggedPos, mappedDraggedPos + draggedNode.nodeSize)

  } else {
    // 创建新的列布局
    const targetBlockNode = $target.nodeAfter || $target.nodeBefore
    if (!targetBlockNode) return false

    // 创建两个列
    const column1 = schema.nodes.column.create(null, [
      side === 'left' ? draggedNode : targetBlockNode
    ])
    const column2 = schema.nodes.column.create(null, [
      side === 'left' ? targetBlockNode : draggedNode
    ])

    // 创建列布局
    const columnLayout = schema.nodes.columnLayout.create(
      { columns: 2 },
      [column1, column2]
    )

    // 找到要替换的范围
    const replaceStart = $target.before($target.depth)
    const replaceEnd = replaceStart + targetBlockNode.nodeSize

    // 替换为列布局
    tr.replaceRangeWith(replaceStart, replaceEnd, columnLayout)

    // 删除被拖拽的节点（如果它不是targetBlockNode）
    if (draggedPos !== replaceStart) {
      const mappedDraggedPos = tr.mapping.map(draggedPos)
      const draggedNodeSize = draggedNode.nodeSize
      tr.delete(mappedDraggedPos, mappedDraggedPos + draggedNodeSize)
    }
  }

  dispatch(tr)
  return true
}

export const DragDropPlugin = new Plugin({
  key: dragDropPluginKey,

  state: {
    init(): DragState {
      return {
        isDragging: false,
        draggedNode: null,
        draggedPos: 0,
        dropIndicator: null,
        dropPos: 0,
      }
    },

    apply(tr, value): DragState {
      const meta = tr.getMeta(dragDropPluginKey)
      if (meta) {
        return { ...value, ...meta }
      }
      return value
    },
  },

  props: {
    handleDOMEvents: {
      dragstart(view: EditorView, event: DragEvent) {
        // 从全局获取拖拽位置（由DragHandle设置）
        const draggedPos = (window as any).draggedPos

        if (draggedPos === undefined) {
          // 如果不是从句柄拖拽，尝试获取位置
          const pos = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })

          if (!pos) return false

          const $pos = view.state.doc.resolve(pos.pos)
          const node = $pos.parent

          // 检查节点是否可拖拽
          if (node.type.spec.draggable === false) {
            return false
          }

          // 设置拖拽状态
          const tr = view.state.tr.setMeta(dragDropPluginKey, {
            isDragging: true,
            draggedNode: node,
            draggedPos: $pos.before($pos.depth),
          })

          view.dispatch(tr)
        } else {
          // 从句柄拖拽
          const $pos = view.state.doc.resolve(draggedPos)
          const node = $pos.parent

          // 设置拖拽状态
          const tr = view.state.tr.setMeta(dragDropPluginKey, {
            isDragging: true,
            draggedNode: node,
            draggedPos: draggedPos,
          })

          view.dispatch(tr)
        }

        // 设置拖拽数据
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'move'
          event.dataTransfer.setData('text/html', '')
        }

        return true
      },

      dragover(view: EditorView, event: DragEvent) {
        event.preventDefault()

        if (!event.dataTransfer) return false
        event.dataTransfer.dropEffect = 'move'

        const dropInfo = detectDropPosition(event, view)
        if (!dropInfo) return false

        // 更新视觉提示
        const pluginState = dragDropPluginKey.getState(view.state) as DragState

        if (dropInfo.type !== pluginState.dropIndicator) {
          // 移除旧的提示
          const oldIndicator = document.querySelector('.drop-indicator-horizontal, .drop-indicator-vertical')
          if (oldIndicator) {
            oldIndicator.remove()
          }

          // 添加新的提示
          const indicator = createDropIndicator(dropInfo.type)

          if (dropInfo.type === 'horizontal') {
            indicator.style.top = `${event.clientY}px`
            indicator.style.left = '0'
          } else {
            indicator.style.left = `${event.clientX}px`
            indicator.style.top = '0'
          }

          document.body.appendChild(indicator)
        }

        return false
      },

      drop(view: EditorView, event: DragEvent) {
        event.preventDefault()

        // 清除视觉提示
        const indicators = document.querySelectorAll('.drop-indicator-horizontal, .drop-indicator-vertical')
        indicators.forEach(el => el.remove())

        const pluginState = dragDropPluginKey.getState(view.state) as DragState
        if (!pluginState.isDragging) return false

        const dropInfo = detectDropPosition(event, view)
        if (!dropInfo) return false

        let success = false

        if (dropInfo.type === 'vertical') {
          // 纵向移动
          success = moveNodeVertically(
            view,
            pluginState.draggedPos,
            dropInfo.pos
          )
        } else if (dropInfo.type === 'horizontal') {
          // 创建列布局
          success = createColumnLayout(
            view,
            pluginState.draggedPos,
            dropInfo.pos,
            dropInfo.side as 'left' | 'right'
          )
        }

        // 重置拖拽状态
        const tr = view.state.tr.setMeta(dragDropPluginKey, {
          isDragging: false,
          draggedNode: null,
          draggedPos: 0,
          dropIndicator: null,
          dropPos: 0,
        })
        view.dispatch(tr)

        return success
      },

      dragend(view: EditorView) {
        // 清理
        const indicators = document.querySelectorAll('.drop-indicator-horizontal, .drop-indicator-vertical')
        indicators.forEach(el => el.remove())

        // 重置状态
        const tr = view.state.tr.setMeta(dragDropPluginKey, {
          isDragging: false,
          draggedNode: null,
          draggedPos: 0,
          dropIndicator: null,
          dropPos: 0,
        })
        view.dispatch(tr)

        return false
      },
    },
  },
})