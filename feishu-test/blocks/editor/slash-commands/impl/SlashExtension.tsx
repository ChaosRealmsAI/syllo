import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { Editor, Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { SlashMenu } from './SlashMenu';
import { slashCommands } from './commands';
import { SlashCommand } from '../contracts/slash-commands.types';

export const SlashCommands = Extension.create({
  name: 'slashCommands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: { editor: Editor; range: any; props: SlashCommand }) => {
          // 先删除斜杠字符和查询内容
          editor.chain().focus().deleteRange(range).run();
          // 然后执行命令
          props.command(editor);
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          return slashCommands.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            (item.description?.toLowerCase().includes(query.toLowerCase()) ?? false)
          );
        },
        render: () => {
          let component: ReactRenderer | null = null;
          let popup: any = null;

          return {
            onStart: (props: any) => {
              component = new ReactRenderer(SlashMenu, {
                props,
                editor: props.editor,
              });

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
              component?.updateProps(props);

              if (popup) {
                popup[0].setProps({
                  getReferenceClientRect: props.clientRect,
                });
              }
            },

            onKeyDown(props: any) {
              if (props.event.key === 'Escape') {
                popup?.[0].hide();
                return true;
              }
              return component?.ref?.onKeyDown?.(props) ?? false;
            },

            onExit() {
              popup?.[0].destroy();
              component?.destroy();
            },
          };
        },
      }),
    ];
  },
});