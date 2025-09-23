import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ColumnsView } from './ColumnsView';

export interface ColumnsOptions {
  HTMLAttributes: Record<string, any>;
  resizable?: boolean;
  defaultColumns?: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      setColumns: (columns?: number) => ReturnType;
      addColumn: () => ReturnType;
      deleteColumn: (index: number) => ReturnType;
    };
  }
}

export const Columns = Node.create<ColumnsOptions>({
  name: 'columns',

  group: 'block',

  content: 'column+',

  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      resizable: true,
      defaultColumns: 2,
    };
  },

  addAttributes() {
    return {
      columns: {
        default: 2,
        parseHTML: element => parseInt(element.getAttribute('data-columns') || '2'),
        renderHTML: attributes => ({
          'data-columns': attributes.columns,
        }),
      },
      layout: {
        default: 'equal',
        parseHTML: element => element.getAttribute('data-layout') || 'equal',
        renderHTML: attributes => ({
          'data-layout': attributes.layout,
        }),
      },
    };
  },

  parseHTML() {
    return [{
      tag: 'div[data-type="columns"]',
    }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(
      this.options.HTMLAttributes,
      HTMLAttributes,
      { 'data-type': 'columns', class: 'columns-container' }
    ), 0];
  },

  addCommands() {
    return {
      setColumns: (columns = 2) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: { columns },
          content: Array.from({ length: columns }, () => ({
            type: 'column',
            content: [{
              type: 'paragraph',
            }],
          })),
        });
      },

      addColumn: () => ({ tr, state }) => {
        const { selection } = state;
        const node = selection.$anchor.node(selection.$anchor.depth - 1);

        if (node && node.type.name === this.name) {
          const pos = selection.$anchor.before(selection.$anchor.depth - 1);
          const column = state.schema.nodes.column.create({}, [
            state.schema.nodes.paragraph.create(),
          ]);

          tr.insert(pos + node.nodeSize - 1, column);
          return true;
        }

        return false;
      },

      deleteColumn: (index: number) => ({ tr, state }) => {
        const { selection } = state;
        const node = selection.$anchor.node(selection.$anchor.depth - 1);

        if (node && node.type.name === this.name && node.childCount > 1) {
          let currentPos = selection.$anchor.before(selection.$anchor.depth - 1) + 1;

          for (let i = 0; i < node.childCount; i++) {
            const child = node.child(i);
            if (i === index) {
              tr.delete(currentPos, currentPos + child.nodeSize);
              return true;
            }
            currentPos += child.nodeSize;
          }
        }

        return false;
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnsView);
  },
});