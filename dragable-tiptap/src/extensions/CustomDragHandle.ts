import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';
import { Node } from '@tiptap/pm/model';
import { getSelectionRanges, NodeRangeSelection } from '@tiptap/extension-node-range';

export interface CustomDragHandleOptions {
  onDragStart?: (event: DragEvent, node: Node, pos: number) => void;
  onDragEnd?: (event: DragEvent) => void;
  onDirectionDetected?: (direction: 'horizontal' | 'vertical') => void;
}

const dragHandleKey = new PluginKey('customDragHandle');

// 自定义拖拽处理器
function customDragHandler(event: DragEvent, view: EditorView, options: CustomDragHandleOptions) {
  if (!event.dataTransfer) return;

  // 获取拖拽的节点
  const coords = { left: event.clientX, top: event.clientY };
  const pos = view.posAtCoords(coords);
  if (!pos) return;

  const $pos = view.state.doc.resolve(pos.pos);
  const node = $pos.parent;
  const depth = $pos.depth;

  // 获取节点的实际位置
  let nodePos = pos.pos;
  if (depth > 0) {
    nodePos = $pos.before(depth);
  }

  // 创建节点选择
  const from = nodePos;
  const to = nodePos + node.nodeSize;
  const selection = NodeRangeSelection.create(view.state.doc, from, to);

  // 设置拖拽数据
  const slice = selection.content();
  view.dragging = { slice, move: true };

  // 更新选择
  const tr = view.state.tr.setSelection(selection);
  view.dispatch(tr);

  // 触发回调
  if (options.onDragStart) {
    options.onDragStart(event, node, nodePos);
  }

  // 存储初始拖拽位置用于方向检测
  const startX = event.clientX;
  const startY = event.clientY;
  let direction: 'horizontal' | 'vertical' | null = null;

  // 监听拖拽移动来检测方向
  const handleDragOver = (e: DragEvent) => {
    const deltaX = Math.abs(e.clientX - startX);
    const deltaY = Math.abs(e.clientY - startY);
    const threshold = 30;

    if (deltaX > threshold || deltaY > threshold) {
      const newDirection = deltaX > deltaY ? 'horizontal' : 'vertical';
      if (newDirection !== direction) {
        direction = newDirection;
        if (options.onDirectionDetected) {
          options.onDirectionDetected(direction);
        }
      }
    }
  };

  document.addEventListener('dragover', handleDragOver);

  // 清理
  document.addEventListener('dragend', () => {
    document.removeEventListener('dragover', handleDragOver);
    if (options.onDragEnd) {
      options.onDragEnd(event);
    }
  }, { once: true });
}

export const CustomDragHandle = Extension.create<CustomDragHandleOptions>({
  name: 'customDragHandle',

  addOptions() {
    return {
      onDragStart: undefined,
      onDragEnd: undefined,
      onDirectionDetected: undefined,
    };
  },

  addProseMirrorPlugins() {
    const options = this.options;
    const editor = this.editor;

    return [
      new Plugin({
        key: dragHandleKey,
        props: {
          handleDOMEvents: {
            dragstart(view: EditorView, event: DragEvent) {
              // 检查是否是拖拽句柄触发的
              const target = event.target as HTMLElement;
              if (target.classList.contains('drag-handle') || target.closest('.drag-handle')) {
                customDragHandler(event, view, options);
                return true;
              }
              return false;
            },
          },

          // 处理拖放
          handleDrop(view: EditorView, event: DragEvent, slice, moved) {
            if (!moved) return false;

            const coords = { left: event.clientX, top: event.clientY };
            const pos = view.posAtCoords(coords);
            if (!pos) return false;

            // 这里可以根据方向执行不同的操作
            // 纵向：移动节点
            // 横向：创建列布局

            // 默认使用 ProseMirror 的原生拖放行为
            return false; // 返回 false 让 ProseMirror 处理
          },
        },
      }),
    ];
  },
});