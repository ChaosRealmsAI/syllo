import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export const DragHandlePlugin = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    let dragHandleElement: HTMLElement | null = null;

    return [
      new Plugin({
        key: new PluginKey('dragHandle'),

        view(editorView) {
          // 创建拖拽句柄元素
          dragHandleElement = document.createElement('div');
          dragHandleElement.className = 'drag-handle';
          dragHandleElement.draggable = true;
          dragHandleElement.innerHTML = `
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
              <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
              <circle cx="2" cy="8" r="1.5" fill="currentColor"/>
              <circle cx="2" cy="14" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="2" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="14" r="1.5" fill="currentColor"/>
            </svg>
          `;

          dragHandleElement.style.cssText = `
            position: absolute;
            left: -45px;
            width: 26px;
            height: 26px;
            cursor: grab;
            opacity: 0;
            transition: opacity 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            background: transparent;
            color: #8f959e;
          `;

          dragHandleElement.addEventListener('mouseenter', () => {
            dragHandleElement!.style.background = 'rgba(0, 0, 0, 0.06)';
          });

          dragHandleElement.addEventListener('mouseleave', () => {
            dragHandleElement!.style.background = 'transparent';
          });

          // 添加拖拽事件处理
          let draggedNode: any = null;
          let draggedPos: number = -1;

          dragHandleElement.addEventListener('dragstart', (e) => {
            const pos = Number(dragHandleElement!.dataset.pos);
            const node = editorView.state.doc.nodeAt(pos);

            if (node) {
              draggedNode = node;
              draggedPos = pos;
              dragHandleElement!.style.cursor = 'grabbing';
              e.dataTransfer!.effectAllowed = 'move';
            }
          });

          dragHandleElement.addEventListener('dragend', () => {
            draggedNode = null;
            draggedPos = -1;
            dragHandleElement!.style.cursor = 'grab';
          });

          editorView.dom.parentElement?.appendChild(dragHandleElement);

          // 处理鼠标移动以显示/隐藏句柄
          const handleMouseMove = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            const pos = editorView.posAtCoords({ left: clientX, top: clientY });

            if (!pos) {
              dragHandleElement!.style.opacity = '0';
              return;
            }

            const node = editorView.state.doc.nodeAt(pos.pos);
            if (!node || node.type.name === 'text') {
              dragHandleElement!.style.opacity = '0';
              return;
            }

            // 获取节点的 DOM 元素位置
            const dom = editorView.nodeDOM(pos.pos) as HTMLElement;
            if (dom) {
              const rect = dom.getBoundingClientRect();
              const editorRect = editorView.dom.getBoundingClientRect();

              dragHandleElement!.style.top = `${rect.top - editorRect.top}px`;
              dragHandleElement!.style.opacity = '1';
              dragHandleElement!.dataset.pos = String(pos.pos);
            }
          };

          const handleMouseLeave = () => {
            dragHandleElement!.style.opacity = '0';
          };

          editorView.dom.addEventListener('mousemove', handleMouseMove);
          editorView.dom.addEventListener('mouseleave', handleMouseLeave);

          return {
            destroy() {
              dragHandleElement?.remove();
              editorView.dom.removeEventListener('mousemove', handleMouseMove);
              editorView.dom.removeEventListener('mouseleave', handleMouseLeave);
            }
          };
        },

        props: {
          handleDOMEvents: {
            drop(view, event) {
              event.preventDefault();

              const pos = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });

              if (!pos) return false;

              // 这里实现拖拽后的重排序逻辑
              // 简化版本，实际需要更复杂的处理
              return true;
            },
            dragover(view, event) {
              event.preventDefault();
              return false;
            },
          },
        },
      }),
    ];
  },
});