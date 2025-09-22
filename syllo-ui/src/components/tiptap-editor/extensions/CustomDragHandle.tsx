import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { BlockDragToolbar } from '@/components/editor-essentials/toolbar/BlockDragToolbar';

export const CustomDragHandle = Extension.create({
  name: 'customDragHandle',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('customDragHandle'),

        view(editorView) {
          let currentBlockPos: number | null = null;
          let dragHandleWrapper: HTMLElement | null = null;
          let root: any = null;

          // 创建拖拽句柄容器
          dragHandleWrapper = document.createElement('div');
          dragHandleWrapper.style.cssText = `
            position: absolute;
            left: -45px;
            top: 0;
            z-index: 10;
            opacity: 0;
            transition: opacity 0.2s;
          `;

          editorView.dom.parentElement?.style.position = 'relative';
          editorView.dom.parentElement?.appendChild(dragHandleWrapper);

          // 使用 React 渲染你的拖拽组件
          root = createRoot(dragHandleWrapper);

          const handleDragStart = (e: React.DragEvent) => {
            if (currentBlockPos !== null) {
              const node = editorView.state.doc.nodeAt(currentBlockPos);
              if (node) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', currentBlockPos.toString());
              }
            }
          };

          const handleMenuItemClick = (item: any) => {
            // 处理菜单项点击
            console.log('Menu item clicked:', item);

            // 使用 ProseMirror 命令直接操作
            const { state } = editorView;
            const { from, to } = state.selection;

            switch(item.id) {
              case 'heading1':
                editorView.dispatch(
                  state.tr.setBlockType(from, to, state.schema.nodes.heading, { level: 1 })
                );
                break;
              case 'heading2':
                editorView.dispatch(
                  state.tr.setBlockType(from, to, state.schema.nodes.heading, { level: 2 })
                );
                break;
              case 'paragraph':
                editorView.dispatch(
                  state.tr.setBlockType(from, to, state.schema.nodes.paragraph)
                );
                break;
              case 'bulletList':
                editorView.dispatch(
                  state.tr.replaceSelectionWith(state.schema.nodes.bulletList.create())
                );
                break;
              case 'orderedList':
                editorView.dispatch(
                  state.tr.replaceSelectionWith(state.schema.nodes.orderedList.create())
                );
                break;
              case 'codeBlock':
                editorView.dispatch(
                  state.tr.setBlockType(from, to, state.schema.nodes.codeBlock)
                );
                break;
              case 'blockquote':
                editorView.dispatch(
                  state.tr.setBlockType(from, to, state.schema.nodes.blockquote)
                );
                break;
            }
          };

          root.render(
            <BlockDragToolbar
              onMenuItemClick={handleMenuItemClick}
              onDragStart={handleDragStart}
              onDragEnd={() => {}}
            />
          );

          // 处理鼠标移动以显示/隐藏句柄
          const handleMouseMove = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            const pos = editorView.posAtCoords({ left: clientX, top: clientY });

            if (!pos) {
              dragHandleWrapper!.style.opacity = '0';
              return;
            }

            const node = editorView.state.doc.nodeAt(pos.pos);
            if (!node || node.type.name === 'text') {
              dragHandleWrapper!.style.opacity = '0';
              return;
            }

            // 获取节点的 DOM 元素位置
            const dom = editorView.nodeDOM(pos.pos) as HTMLElement;
            if (dom && dragHandleWrapper) {
              const rect = dom.getBoundingClientRect();
              const editorRect = editorView.dom.getBoundingClientRect();

              dragHandleWrapper.style.top = `${rect.top - editorRect.top}px`;
              dragHandleWrapper.style.opacity = '1';
              currentBlockPos = pos.pos;
            }
          };

          const handleMouseLeave = () => {
            if (dragHandleWrapper) {
              dragHandleWrapper.style.opacity = '0';
            }
          };

          // 添加事件监听器
          editorView.dom.addEventListener('mousemove', handleMouseMove);
          editorView.dom.addEventListener('mouseleave', handleMouseLeave);

          return {
            destroy() {
              root?.unmount();
              dragHandleWrapper?.remove();
              editorView.dom.removeEventListener('mousemove', handleMouseMove);
              editorView.dom.removeEventListener('mouseleave', handleMouseLeave);
            }
          };
        },

        props: {
          handleDOMEvents: {
            drop(view, event) {
              event.preventDefault();

              const draggedPos = event.dataTransfer?.getData('text/plain');
              if (!draggedPos) return false;

              const pos = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });

              if (!pos) return false;

              // 实现节点重排序逻辑
              const fromPos = parseInt(draggedPos);
              const toPos = pos.pos;

              if (fromPos !== toPos) {
                const { state } = view;
                const $from = state.doc.resolve(fromPos);
                const $to = state.doc.resolve(toPos);

                const node = state.doc.nodeAt(fromPos);
                if (node) {
                  const tr = state.tr;
                  tr.delete(fromPos, fromPos + node.nodeSize);
                  tr.insert(toPos > fromPos ? toPos - node.nodeSize : toPos, node);
                  view.dispatch(tr);
                }
              }

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