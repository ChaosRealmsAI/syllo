import { Extension } from '@tiptap/core'
import { Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

export const DragHandleConfig = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        view(editorView) {
          return new DragHandleView(editorView)
        },
      }),
    ]
  },
})

class DragHandleView {
  private editorView: EditorView
  private dragHandle: HTMLElement | null = null
  private currentPos: number | null = null

  constructor(editorView: EditorView) {
    this.editorView = editorView
    this.createDragHandle()
    this.update(editorView)

    // 监听编辑器事件
    this.editorView.dom.addEventListener('mousemove', this.handleMouseMove)
    this.editorView.dom.addEventListener('mouseleave', this.handleMouseLeave)
  }

  createDragHandle() {
    // 创建拖拽句柄元素
    this.dragHandle = document.createElement('div')
    this.dragHandle.className = 'drag-handle'
    this.dragHandle.contentEditable = 'false'
    this.dragHandle.draggable = true
    this.dragHandle.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="3" width="2" height="2" rx="0.5" fill="currentColor"/>
        <rect x="5" y="7" width="2" height="2" rx="0.5" fill="currentColor"/>
        <rect x="5" y="11" width="2" height="2" rx="0.5" fill="currentColor"/>
        <rect x="9" y="3" width="2" height="2" rx="0.5" fill="currentColor"/>
        <rect x="9" y="7" width="2" height="2" rx="0.5" fill="currentColor"/>
        <rect x="9" y="11" width="2" height="2" rx="0.5" fill="currentColor"/>
      </svg>
    `

    // 设置初始样式
    this.dragHandle.style.position = 'absolute'
    this.dragHandle.style.left = '-28px'
    this.dragHandle.style.top = '0'
    this.dragHandle.style.width = '24px'
    this.dragHandle.style.height = '24px'
    this.dragHandle.style.cursor = 'grab'
    this.dragHandle.style.opacity = '0'
    this.dragHandle.style.transition = 'opacity 0.2s'
    this.dragHandle.style.display = 'flex'
    this.dragHandle.style.alignItems = 'center'
    this.dragHandle.style.justifyContent = 'center'
    this.dragHandle.style.color = '#8b8b8b'
    this.dragHandle.style.borderRadius = '4px'
    this.dragHandle.style.zIndex = '10'

    // 添加拖拽事件
    this.dragHandle.addEventListener('dragstart', this.handleDragStart)
    this.dragHandle.addEventListener('dragend', this.handleDragEnd)

    // 添加到编辑器容器
    const container = this.editorView.dom.parentElement
    if (container) {
      container.style.position = 'relative'
      container.appendChild(this.dragHandle)
    }
  }

  handleMouseMove = (event: MouseEvent) => {
    const pos = this.editorView.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    })

    if (!pos) {
      this.hideDragHandle()
      return
    }

    const $pos = this.editorView.state.doc.resolve(pos.pos)
    const node = $pos.parent

    // 检查是否是可拖拽的块节点
    if (node && node.type.spec.group?.includes('block') && node.type.spec.draggable !== false) {
      // 获取节点的DOM元素
      const dom = this.editorView.domAtPos($pos.before($pos.depth))
      if (dom.node && dom.node instanceof HTMLElement) {
        this.showDragHandle(dom.node, $pos.before($pos.depth))
      }
    } else {
      this.hideDragHandle()
    }
  }

  handleMouseLeave = () => {
    this.hideDragHandle()
  }

  handleDragStart = (event: DragEvent) => {
    if (!this.currentPos) return

    // 设置拖拽数据
    event.dataTransfer!.effectAllowed = 'move'
    event.dataTransfer!.setData('text/plain', String(this.currentPos))

    // 添加拖拽样式
    this.dragHandle!.style.cursor = 'grabbing'
    this.dragHandle!.classList.add('dragging')

    // 存储拖拽位置到全局（供拖拽插件使用）
    (window as any).draggedPos = this.currentPos
  }

  handleDragEnd = () => {
    // 重置样式
    this.dragHandle!.style.cursor = 'grab'
    this.dragHandle!.classList.remove('dragging')

    // 清除全局数据
    delete (window as any).draggedPos
  }

  showDragHandle(dom: HTMLElement, pos: number) {
    if (!this.dragHandle) return

    const rect = dom.getBoundingClientRect()
    const containerRect = this.editorView.dom.parentElement!.getBoundingClientRect()

    // 更新位置
    this.dragHandle.style.top = `${rect.top - containerRect.top}px`
    this.dragHandle.style.opacity = '1'

    // 存储当前位置
    this.currentPos = pos
  }

  hideDragHandle() {
    if (!this.dragHandle) return
    this.dragHandle.style.opacity = '0'
    this.currentPos = null
  }

  update(view: EditorView) {
    this.editorView = view
  }

  destroy() {
    // 清理事件监听
    this.editorView.dom.removeEventListener('mousemove', this.handleMouseMove)
    this.editorView.dom.removeEventListener('mouseleave', this.handleMouseLeave)

    // 移除拖拽句柄
    if (this.dragHandle && this.dragHandle.parentElement) {
      this.dragHandle.removeEventListener('dragstart', this.handleDragStart)
      this.dragHandle.removeEventListener('dragend', this.handleDragEnd)
      this.dragHandle.parentElement.removeChild(this.dragHandle)
    }
  }
}