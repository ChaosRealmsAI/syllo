import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { SlashMenuPopover } from '@/components/menu';

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('slashCommand'),

        view(editorView) {
          let menuWrapper: HTMLElement | null = null;
          let root: any = null;
          let isMenuVisible = false;

          // 创建菜单容器
          menuWrapper = document.createElement('div');
          menuWrapper.style.cssText = `
            position: absolute;
            z-index: 1000;
            display: none;
          `;

          editorView.dom.parentElement?.appendChild(menuWrapper);

          // 渲染菜单组件
          root = createRoot(menuWrapper);

          const handleMenuItemClick = (item: any) => {
            // 隐藏菜单
            menuWrapper!.style.display = 'none';
            isMenuVisible = false;

            // 删除 / 字符
            const { state } = editorView;
            const { from } = state.selection;
            const tr = state.tr.delete(from - 1, from);
            editorView.dispatch(tr);

            // 根据菜单项类型插入对应的内容
            const { state: newState } = editorView;
            const { from: newFrom, to } = newState.selection;

            switch(item.id) {
              case 'heading1':
                editorView.dispatch(
                  newState.tr.setBlockType(newFrom, to, newState.schema.nodes.heading, { level: 1 })
                );
                break;
              case 'heading2':
                editorView.dispatch(
                  newState.tr.setBlockType(newFrom, to, newState.schema.nodes.heading, { level: 2 })
                );
                break;
              case 'heading3':
                editorView.dispatch(
                  newState.tr.setBlockType(newFrom, to, newState.schema.nodes.heading, { level: 3 })
                );
                break;
              case 'paragraph':
                editorView.dispatch(
                  newState.tr.setBlockType(newFrom, to, newState.schema.nodes.paragraph)
                );
                break;
              case 'bulletList':
                editorView.dispatch(
                  newState.tr.replaceSelectionWith(newState.schema.nodes.bulletList.create())
                );
                break;
              case 'orderedList':
                editorView.dispatch(
                  newState.tr.replaceSelectionWith(newState.schema.nodes.orderedList.create())
                );
                break;
              case 'codeBlock':
                editorView.dispatch(
                  newState.tr.setBlockType(newFrom, to, newState.schema.nodes.codeBlock)
                );
                break;
              case 'blockquote':
                editorView.dispatch(
                  newState.tr.setBlockType(newFrom, to, newState.schema.nodes.blockquote)
                );
                break;
              case 'divider':
                editorView.dispatch(
                  newState.tr.replaceSelectionWith(newState.schema.nodes.horizontalRule.create())
                );
                break;
            }

            editorView.focus();
          };

          root.render(
            <SlashMenuPopover
              onMenuItemClick={handleMenuItemClick}
              trigger="click"
            >
              <div />
            </SlashMenuPopover>
          );

          return {
            update(view, prevState) {
              const { state } = view;
              const { from } = state.selection;
              const text = state.doc.textBetween(from - 1, from, null, '\ufffc');

              // 检测 / 字符
              if (text === '/' && !isMenuVisible) {
                // 显示菜单
                const coords = view.coordsAtPos(from);
                if (menuWrapper) {
                  menuWrapper.style.display = 'block';
                  menuWrapper.style.left = `${coords.left}px`;
                  menuWrapper.style.top = `${coords.bottom + 5}px`;
                  isMenuVisible = true;

                  // 触发菜单打开
                  setTimeout(() => {
                    const button = menuWrapper?.querySelector('button');
                    if (button) {
                      button.click();
                    }
                  }, 0);
                }
              } else if (text !== '/' && isMenuVisible) {
                // 隐藏菜单
                menuWrapper!.style.display = 'none';
                isMenuVisible = false;
              }
            },

            destroy() {
              root?.unmount();
              menuWrapper?.remove();
            }
          };
        },
      }),
    ];
  },
});