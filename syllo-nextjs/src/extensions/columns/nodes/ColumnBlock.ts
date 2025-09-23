import { Node, mergeAttributes } from '@tiptap/core'
import type { CommandProps } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'
import { buildColumnBlock, buildNColumns } from '../utils'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columnBlock: {
      setColumns: (columns: number) => ReturnType
      unsetColumns: () => ReturnType
    }
  }
}

export interface ColumnBlockOptions {
  nestedColumns: boolean
}

export const ColumnBlock = Node.create<ColumnBlockOptions>({
  name: 'columnBlock',
  group: 'block',
  content: 'column{2,}',
  isolating: true,
  selectable: true,

  addOptions() {
    return {
      nestedColumns: false,
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="column-block"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = mergeAttributes(HTMLAttributes, {
      'data-type': 'column-block',
      class: 'column-block',
    })
    return ['div', attrs, 0]
  },

  addCommands() {
    return {
      setColumns:
        (n: number) =>
        ({ tr, dispatch, state }: CommandProps) => {
          if (!dispatch) return false

          const { selection } = state
          const { $from, $to } = selection

          // 获取选中内容
          const content = tr.doc.slice($from.pos, $to.pos).content

          // 创建列
          const columns = buildNColumns(n)

          // 如果有选中内容，将其放入第一列
          if (content.size > 0) {
            columns[0].content = content.toJSON()
          }

          const columnBlock = buildColumnBlock({
            content: columns,
          })

          // 创建新节点
          const newNode = state.schema.nodeFromJSON(columnBlock)
          if (!newNode) return false

          // 替换选中内容
          tr.replaceWith($from.pos, $to.pos, newNode)

          // 设置光标位置到第一列
          const resolvedPos = tr.doc.resolve($from.pos + 2)
          tr.setSelection(new TextSelection(resolvedPos))

          dispatch(tr)
          return true
        },

      unsetColumns:
        () =>
        ({ tr, dispatch, state }: CommandProps) => {
          if (!dispatch) return false

          const { selection } = state
          const { $from } = selection

          // 查找 columnBlock 节点
          let columnBlockPos = -1
          let columnBlockNode = null

          for (let d = $from.depth; d > 0; d--) {
            const node = $from.node(d)
            if (node.type.name === 'columnBlock') {
              columnBlockPos = $from.before(d)
              columnBlockNode = node
              break
            }
          }

          if (!columnBlockNode || columnBlockPos === -1) {
            return false
          }

          // 收集所有列的内容
          const contents: any[] = []
          columnBlockNode.forEach((child) => {
            if (child.type.name === 'column' && child.content.size > 0) {
              child.content.forEach((node) => {
                contents.push(node)
              })
            }
          })

          // 替换 columnBlock 为其内容
          if (contents.length > 0) {
            tr.replaceWith(
              columnBlockPos,
              columnBlockPos + columnBlockNode.nodeSize,
              contents
            )
          } else {
            // 如果没有内容，插入一个空段落
            const paragraph = state.schema.nodes.paragraph.create()
            tr.replaceWith(
              columnBlockPos,
              columnBlockPos + columnBlockNode.nodeSize,
              paragraph
            )
          }

          dispatch(tr)
          return true
        },
    }
  },
})