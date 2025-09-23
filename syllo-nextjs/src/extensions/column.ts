import { Node, mergeAttributes } from '@tiptap/core'

export interface ColumnOptions {
  HTMLAttributes: Record<string, any>
}

export const Column = Node.create<ColumnOptions>({
  name: 'column',

  content: 'block+',  // 列内可包含多个块

  draggable: false,  // 列不可拖拽

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      width: {
        default: null,
        parseHTML: element => {
          const width = element.style.width || element.getAttribute('data-width')
          return width ? parseFloat(width) : null
        },
        renderHTML: attributes => {
          if (!attributes.width) {
            return {}
          }
          return {
            'data-width': attributes.width,
            style: `width: ${attributes.width}%`,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="column"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      'data-type': 'column',
      class: 'column',
    }), 0]
  },
})