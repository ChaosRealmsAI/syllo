import { Node, mergeAttributes } from '@tiptap/core'

export const Column = Node.create({
  name: 'column',
  group: 'column',
  content: 'paragraph+', // 只允许段落，不允许嵌套其他block（包括columnBlock）
  isolating: true,
  selectable: false,

  addAttributes() {
    return {
      width: {
        default: null,
        parseHTML: element => element.style.width || null,
        renderHTML: attributes => {
          if (!attributes.width) return {}
          return {
            style: `width: ${attributes.width}; flex: none;`,
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
    const attrs = mergeAttributes(HTMLAttributes, {
      'data-type': 'column',
      class: 'column',
    })
    return ['div', attrs, 0]
  },
})