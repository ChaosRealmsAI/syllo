import { Node, mergeAttributes } from '@tiptap/core'

export interface ColumnLayoutOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columnLayout: {
      /**
       * Set a column layout node
       */
      setColumnLayout: (columns?: number) => ReturnType
      /**
       * Toggle a column layout node
       */
      toggleColumnLayout: (columns?: number) => ReturnType
    }
  }
}

export const ColumnLayout = Node.create<ColumnLayoutOptions>({
  name: 'columnLayout',

  group: 'block',

  content: 'column{2,5}',  // 2-5列

  draggable: false,  // 容器本身不可拖拽

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      columns: {
        default: 2,
        parseHTML: element => {
          const columns = element.getAttribute('data-columns')
          return columns ? parseInt(columns, 10) : 2
        },
        renderHTML: attributes => {
          return {
            'data-columns': attributes.columns,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="column-layout"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      'data-type': 'column-layout',
      class: 'column-layout',
    }), 0]
  },

  addCommands() {
    return {
      setColumnLayout: (columns = 2) => ({ commands, state, chain }) => {
        const { selection } = state
        const { $from, $to } = selection

        // 获取选中的内容
        const range = $from.blockRange($to)
        if (!range) return false

        // 创建列节点
        const columnNodes = []
        for (let i = 0; i < columns; i++) {
          const column = state.schema.nodes.column.createAndFill()
          if (column) columnNodes.push(column)
        }

        // 创建列布局节点
        const columnLayout = state.schema.nodes.columnLayout.create(
          { columns },
          columnNodes
        )

        return chain()
          .insertContentAt(range, columnLayout)
          .run()
      },

      toggleColumnLayout: (columns = 2) => ({ commands, state }) => {
        const { selection } = state
        const { $from } = selection

        // 检查当前是否在列布局中
        const isInColumnLayout = $from.parent.type.name === 'column' ||
                                $from.parent.type.name === 'columnLayout'

        if (isInColumnLayout) {
          // 退出列布局
          return commands.lift('columnLayout')
        } else {
          // 创建列布局
          return commands.setColumnLayout(columns)
        }
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => this.editor.commands.toggleColumnLayout(2),
    }
  },
})