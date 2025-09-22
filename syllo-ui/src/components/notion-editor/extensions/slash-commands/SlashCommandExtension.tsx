import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { SlashCommandMenuWrapper } from './SlashCommandMenuWrapper';

export const SlashCommandExtension = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        startOfLine: false,

        command: ({ editor, range, props }: any) => {
          // props.command已经在SlashCommandMenuWrapper中处理了
          // 这里只是关闭菜单
        },

        items: ({ query }: { query: string }) => {
          // 返回一个简单的项目列表，让 suggestion 系统知道有内容
          // 实际渲染在SlashCommandMenuWrapper中处理
          return [{ title: 'menu' }];
        },

        render: () => {
          let component: ReactRenderer;
          let popup: any;

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(SlashCommandMenuWrapper, {
                props: {
                  ...props,
                  editor: props.editor,
                  range: props.range,
                },
                editor: props.editor,
              });

              if (!props.clientRect) {
                return;
              }

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
              });
            },

            onUpdate(props: any) {
              component.updateProps(props);

              if (!props.clientRect) {
                return;
              }

              popup[0].setProps({
                getReferenceClientRect: props.clientRect,
              });
            },

            onKeyDown(props: any) {
              if (props.event.key === 'Escape') {
                popup[0].hide();
                return true;
              }

              return (component.ref as any)?.onKeyDown?.(props) || false;
            },

            onExit() {
              popup[0].destroy();
              component.destroy();
            },
          };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});