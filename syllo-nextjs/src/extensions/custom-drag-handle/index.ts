/**
 * 基于官方 @tiptap/extension-drag-handle 改造
 * 原版本: https://github.com/ueberdosis/tiptap
 *
 * 主要修改：
 * 1. 添加边缘检测（创建列布局）
 * 2. 集成自定义拖放逻辑
 * 3. 支持最多5列限制
 * 4. 优化视觉反馈
 */

import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import {
  computePosition,
  flip,
  offset,
  shift,
  type Placement,
  type Strategy
} from '@floating-ui/dom'

export interface DragHandleOptions {
  /**
   * 拖拽句柄渲染函数
   */
  render?: () => HTMLElement

  /**
   * floating-ui 位置配置
   */
  positionConfig?: {
    placement?: Placement
    strategy?: Strategy
    offset?: number
  }

  /**
   * 是否允许创建列（你的自定义功能）
   */
  enableColumnCreation?: boolean

  /**
   * 最大列数（你的自定义功能）
   */
  maxColumns?: number

  /**
   * 边缘检测阈值（你的自定义功能）
   */
  edgeThreshold?: number

  /**
   * 节点变化回调
   */
  onNodeChange?: (props: {
    node: any | null
    editor: any
    pos: number
  }) => void

  /**
   * 拖拽开始回调（你的自定义功能）
   */
  onDragStart?: (props: {
    node: any
    pos: number
    event: DragEvent
  }) => void

  /**
   * 拖拽结束回调（你的自定义功能）
   */
  onDragEnd?: (event: DragEvent) => void
}

const DragHandlePluginKey = new PluginKey('customDragHandle')

export const CustomDragHandle = Extension.create<DragHandleOptions>({
  name: 'customDragHandle',

  addOptions() {
    return {
      render: () => {
        const element = document.createElement('div')
        element.className = 'drag-handle'
        element.draggable = true
        element.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="5" y="3" width="2" height="2" rx="0.5" fill="currentColor"/>
            <rect x="5" y="7" width="2" height="2" rx="0.5" fill="currentColor"/>
            <rect x="5" y="11" width="2" height="2" rx="0.5" fill="currentColor"/>
            <rect x="9" y="3" width="2" height="2" rx="0.5" fill="currentColor"/>
            <rect x="9" y="7" width="2" height="2" rx="0.5" fill="currentColor"/>
            <rect x="9" y="11" width="2" height="2" rx="0.5" fill="currentColor"/>
          </svg>
        `
        return element
      },
      positionConfig: {
        placement: 'left-start',
        strategy: 'absolute',
        offset: 8,
      },
      enableColumnCreation: true,
      maxColumns: 5,
      edgeThreshold: 50,
      onNodeChange: undefined,
      onDragStart: undefined,
      onDragEnd: undefined,
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: DragHandlePluginKey,
        view: (editorView) => new DragHandleView(editorView, this.options),
      }),
    ]
  },
})

/**
 * 拖拽句柄视图类
 * 基于官方实现，添加了自定义功能
 */
class DragHandleView {
  private view: EditorView
  private options: DragHandleOptions
  private dragHandle: HTMLElement | null = null
  private currentNode: any | null = null
  private currentPos: number | null = null
  private locked: boolean = false

  constructor(view: EditorView, options: DragHandleOptions) {
    this.view = view
    this.options = options
    this.init()
  }

  private init() {
    // 创建拖拽句柄
    this.dragHandle = this.options.render?.() || this.createDefaultHandle()
    this.setupDragHandle()
    this.attachToEditor()

    // 监听编辑器事件
    this.view.dom.addEventListener('mousemove', this.handleMouseMove)
    this.view.dom.addEventListener('mouseleave', this.handleMouseLeave)
    this.view.dom.addEventListener('dragover', this.handleDragOver)
  }

  private createDefaultHandle(): HTMLElement {
    const element = document.createElement('div')
    element.className = 'drag-handle'
    element.draggable = true
    element.innerHTML = '⋮⋮'
    return element
  }

  private setupDragHandle() {
    if (!this.dragHandle) return

    // 设置样式
    this.dragHandle.style.position = 'absolute'
    this.dragHandle.style.zIndex = '1000'
    this.dragHandle.style.cursor = 'grab'
    this.dragHandle.style.opacity = '0'
    this.dragHandle.style.transition = 'opacity 0.2s'

    // 添加拖拽事件
    this.dragHandle.addEventListener('dragstart', this.handleDragStart)
    this.dragHandle.addEventListener('dragend', this.handleDragEnd)

    // Hover效果
    this.dragHandle.addEventListener('mouseenter', () => {
      if (!this.locked) {
        this.dragHandle!.style.opacity = '1'
      }
    })

    this.dragHandle.addEventListener('mouseleave', () => {
      if (!this.locked) {
        this.dragHandle!.style.opacity = '0.5'
      }
    })
  }

  private attachToEditor() {
    const container = this.view.dom.parentElement
    if (container && this.dragHandle) {
      container.style.position = 'relative'
      container.appendChild(this.dragHandle)
    }
  }

  private handleMouseMove = async (event: MouseEvent) => {
    if (this.locked) return

    const pos = this.view.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    })

    if (!pos) {
      this.hideHandle()
      return
    }

    const $pos = this.view.state.doc.resolve(pos.pos)
    let node = $pos.parent
    let nodePos = $pos.before($pos.depth)

    // 查找最近的块节点
    for (let depth = $pos.depth; depth > 0; depth--) {
      const parent = $pos.node(depth)
      if (parent.type.spec.group?.includes('block')) {
        node = parent
        nodePos = $pos.before(depth)
        break
      }
    }

    // 检查是否可拖拽
    if (!this.canDrag(node)) {
      this.hideHandle()
      return
    }

    // 获取节点DOM
    const dom = this.view.domAtPos(nodePos)
    if (!dom.node || !(dom.node instanceof HTMLElement)) {
      this.hideHandle()
      return
    }

    // 更新句柄位置
    await this.updateHandlePosition(dom.node as HTMLElement, nodePos, node)
  }

  private handleMouseLeave = () => {
    if (!this.locked) {
      this.hideHandle()
    }
  }

  private handleDragStart = (event: DragEvent) => {
    if (!this.currentNode || this.currentPos === null) return

    // 设置拖拽样式
    this.dragHandle!.style.cursor = 'grabbing'
    this.dragHandle!.style.opacity = '1'

    // 设置拖拽数据
    event.dataTransfer!.effectAllowed = 'move'
    event.dataTransfer!.setData('text/plain', String(this.currentPos))

    // 保存拖拽信息到全局（供DragDropPlugin使用）
    ;(window as any).dragHandleData = {
      node: this.currentNode,
      pos: this.currentPos,
      enableColumnCreation: this.options.enableColumnCreation,
      maxColumns: this.options.maxColumns,
      edgeThreshold: this.options.edgeThreshold,
    }

    // 触发回调
    this.options.onDragStart?.({
      node: this.currentNode,
      pos: this.currentPos,
      event,
    })
  }

  private handleDragEnd = (event: DragEvent) => {
    // 重置样式
    this.dragHandle!.style.cursor = 'grab'
    this.dragHandle!.style.opacity = '0'

    // 清除全局数据
    delete (window as any).dragHandleData

    // 触发回调
    this.options.onDragEnd?.(event)
  }

  private handleDragOver = (event: DragEvent) => {
    if (!this.options.enableColumnCreation) return

    // 边缘检测（你的自定义功能）
    const rect = this.view.dom.getBoundingClientRect()
    const x = event.clientX - rect.left
    const threshold = this.options.edgeThreshold || 50

    if (x < threshold || x > rect.width - threshold) {
      // 显示垂直线（创建列的视觉提示）
      this.showDropIndicator('vertical', event.clientX, event.clientY)
    } else {
      // 显示水平线（移动的视觉提示）
      this.showDropIndicator('horizontal', event.clientX, event.clientY)
    }
  }

  private showDropIndicator(type: 'horizontal' | 'vertical', x: number, y: number) {
    // 移除旧的指示器
    const oldIndicator = document.querySelector('.drop-indicator')
    if (oldIndicator) {
      oldIndicator.remove()
    }

    // 创建新的指示器
    const indicator = document.createElement('div')
    indicator.className = `drop-indicator drop-indicator-${type}`
    indicator.style.position = 'fixed'
    indicator.style.pointerEvents = 'none'
    indicator.style.zIndex = '9999'

    if (type === 'horizontal') {
      indicator.style.height = '2px'
      indicator.style.width = '100%'
      indicator.style.background = '#3b82f6'
      indicator.style.left = '0'
      indicator.style.top = `${y}px`
    } else {
      indicator.style.width = '2px'
      indicator.style.height = '100%'
      indicator.style.background = '#3b82f6'
      indicator.style.left = `${x}px`
      indicator.style.top = '0'
    }

    document.body.appendChild(indicator)

    // 自动移除
    setTimeout(() => {
      indicator.remove()
    }, 300)
  }

  private canDrag(node: any): boolean {
    // 检查节点是否可拖拽
    if (!node) return false
    if (node.type.spec.draggable === false) return false
    if (!node.type.spec.group?.includes('block')) return false

    // 排除特定节点（如列容器本身）
    if (node.type.name === 'columnLayout') return false
    if (node.type.name === 'column') return false

    return true
  }

  private async updateHandlePosition(
    dom: HTMLElement,
    pos: number,
    node: any
  ) {
    if (!this.dragHandle) return

    // 使用 floating-ui 计算位置
    const { x, y } = await computePosition(dom, this.dragHandle, {
      placement: this.options.positionConfig?.placement || 'left-start',
      strategy: this.options.positionConfig?.strategy || 'absolute',
      middleware: [
        offset(this.options.positionConfig?.offset || 8),
        flip(),
        shift({ padding: 5 }),
      ],
    })

    // 更新位置
    this.dragHandle.style.left = `${x}px`
    this.dragHandle.style.top = `${y}px`
    this.dragHandle.style.opacity = '0.5'

    // 保存当前节点信息
    this.currentNode = node
    this.currentPos = pos

    // 触发回调
    this.options.onNodeChange?.({
      node,
      editor: this.view,
      pos,
    })
  }

  private hideHandle() {
    if (!this.dragHandle || this.locked) return

    this.dragHandle.style.opacity = '0'
    this.currentNode = null
    this.currentPos = null

    // 触发回调
    this.options.onNodeChange?.({
      node: null,
      editor: this.view,
      pos: -1,
    })
  }

  public lock() {
    this.locked = true
    if (this.dragHandle) {
      this.dragHandle.style.opacity = '1'
    }
  }

  public unlock() {
    this.locked = false
    this.hideHandle()
  }

  update(view: EditorView) {
    this.view = view
  }

  destroy() {
    // 清理事件监听
    this.view.dom.removeEventListener('mousemove', this.handleMouseMove)
    this.view.dom.removeEventListener('mouseleave', this.handleMouseLeave)
    this.view.dom.removeEventListener('dragover', this.handleDragOver)

    // 移除拖拽句柄
    if (this.dragHandle) {
      this.dragHandle.removeEventListener('dragstart', this.handleDragStart)
      this.dragHandle.removeEventListener('dragend', this.handleDragEnd)

      if (this.dragHandle.parentElement) {
        this.dragHandle.parentElement.removeChild(this.dragHandle)
      }
    }
  }
}

export default CustomDragHandle