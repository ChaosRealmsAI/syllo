# TipTap 拖拽系统实现指南

## 一、架构要求

### 1.1 必须使用单编辑器架构
```typescript
// ✅ 正确：单编辑器
const editor = useEditor({
  extensions: [
    Document,
    Paragraph,
    Heading,
    ColumnLayout,  // 列布局扩展
    Column,        // 列扩展
    DragHandle,    // 拖拽句柄
  ]
})

// ❌ 错误：多编辑器（当前错误实现）
columns.map(col => useEditor({...}))  // 每列一个编辑器
```

### 1.2 为什么必须单编辑器
- 多编辑器之间无法拖拽（不同文档树）
- 单编辑器才能共享同一个文档树
- 所有节点在同一棵树中才能自由移动

## 二、节点层级设计

### 2.1 节点定义
```typescript
// 列布局容器（Block Node）
const ColumnLayout = Node.create({
  name: 'columnLayout',
  group: 'block',           // 块级节点
  content: 'column{2,5}',   // 2-5列
  draggable: false,         // 容器不可拖拽

  parseHTML() {
    return [{ tag: 'div[data-type="column-layout"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, {
      'data-type': 'column-layout',
      class: 'column-layout'
    }), 0]
  }
})

// 单个列（子节点，非Block）
const Column = Node.create({
  name: 'column',
  content: 'block+',        // 列内可包含多个块
  draggable: false,         // 列不可拖拽

  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    return ['div', mergeAttributes(HTMLAttributes, {
      'data-type': 'column',
      class: 'column'
    }), 0]
  }
})
```

### 2.2 文档结构
```
Document
├── Paragraph (可拖拽)
├── ColumnLayout (不可拖拽)
│   ├── Column (不可拖拽)
│   │   ├── Paragraph (可拖拽)
│   │   └── Heading (可拖拽)
│   └── Column (不可拖拽)
│       └── Paragraph (可拖拽)
└── Paragraph (可拖拽)
```

## 三、拖拽系统实现

### 3.1 DragHandle扩展配置
```typescript
const DragHandle = DragHandleExtension.configure({
  render: () => {
    const element = document.createElement('div')
    element.classList.add('drag-handle')
    element.innerHTML = '⋮⋮'  // 拖拽图标
    return element
  },

  onNodeChange: ({ node, pos }) => {
    // 只为可拖拽的块显示句柄
    if (node && node.type.spec.draggable !== false) {
      // 显示句柄
    }
  }
})
```

### 3.2 拖拽逻辑实现

#### 3.2.1 检测拖拽位置
```typescript
interface DropPosition {
  type: 'vertical' | 'horizontal-left' | 'horizontal-right'
  targetPos: number
  targetNode: Node
}

function detectDropPosition(
  event: DragEvent,
  view: EditorView
): DropPosition | null {
  const pos = view.posAtCoords({
    left: event.clientX,
    top: event.clientY
  })

  if (!pos) return null

  const $pos = view.state.doc.resolve(pos.pos)
  const node = $pos.node()

  // 获取目标元素的边界
  const dom = view.domAtPos(pos.pos)
  const rect = dom.node.getBoundingClientRect()

  // 检测是否在边缘（创建列）
  const edgeThreshold = 50  // 边缘50px内
  const isLeftEdge = event.clientX < rect.left + edgeThreshold
  const isRightEdge = event.clientX > rect.right - edgeThreshold

  if (isLeftEdge) {
    return { type: 'horizontal-left', targetPos: pos.pos, targetNode: node }
  }
  if (isRightEdge) {
    return { type: 'horizontal-right', targetPos: pos.pos, targetNode: node }
  }

  // 否则是纵向移动
  return { type: 'vertical', targetPos: pos.pos, targetNode: node }
}
```

#### 3.2.2 处理拖拽释放
```typescript
function handleDrop(
  draggedNode: Node,
  draggedPos: number,
  dropPosition: DropPosition,
  editor: Editor
) {
  const { type, targetPos, targetNode } = dropPosition

  editor.chain()
    .focus()
    .command(({ tr, state }) => {
      if (type === 'vertical') {
        // 纵向移动：简单的位置交换
        return moveNodeVertically(tr, draggedPos, targetPos)
      } else {
        // 横向创建列
        return createColumnLayout(tr, state, draggedPos, targetPos, type)
      }
    })
    .run()
}
```

### 3.3 核心命令实现

#### 3.3.1 纵向移动节点
```typescript
function moveNodeVertically(
  tr: Transaction,
  fromPos: number,
  toPos: number
): boolean {
  const node = tr.doc.nodeAt(fromPos)
  if (!node) return false

  // 删除原节点
  tr.delete(fromPos, fromPos + node.nodeSize)

  // 在新位置插入
  const mappedPos = tr.mapping.map(toPos)
  tr.insert(mappedPos, node)

  return true
}
```

#### 3.3.2 创建列布局
```typescript
function createColumnLayout(
  tr: Transaction,
  state: EditorState,
  draggedPos: number,
  targetPos: number,
  side: 'horizontal-left' | 'horizontal-right'
): boolean {
  const draggedNode = tr.doc.nodeAt(draggedPos)
  const targetNode = tr.doc.nodeAt(targetPos)

  if (!draggedNode || !targetNode) return false

  // 检查是否已在列布局中
  const $target = state.doc.resolve(targetPos)
  const inColumnLayout = $target.parent.type.name === 'columnLayout'

  if (inColumnLayout) {
    // 已有列布局，检查列数
    const columnCount = $target.parent.childCount
    if (columnCount >= 5) {
      // 已达最大列数
      return false
    }
    // 添加新列
    return addColumnToLayout(tr, $target.parent, draggedNode, side)
  } else {
    // 创建新的列布局
    const columnLayout = state.schema.nodes.columnLayout.create(null, [
      state.schema.nodes.column.create(null, [targetNode]),
      state.schema.nodes.column.create(null, [draggedNode])
    ])

    // 替换目标节点为列布局
    tr.replaceRangeWith(targetPos, targetPos + targetNode.nodeSize, columnLayout)

    // 删除被拖拽的节点
    const mappedDraggedPos = tr.mapping.map(draggedPos)
    tr.delete(mappedDraggedPos, mappedDraggedPos + draggedNode.nodeSize)

    return true
  }
}
```

## 四、视觉反馈实现

### 4.1 拖拽中的视觉提示
```typescript
class DragDropPlugin extends Plugin {
  constructor() {
    super({
      props: {
        handleDOMEvents: {
          dragover(view, event) {
            const dropPosition = detectDropPosition(event, view)

            if (dropPosition) {
              // 显示对应的视觉提示
              if (dropPosition.type === 'vertical') {
                showHorizontalLine(event.clientY)  // 显示横线
              } else {
                showVerticalLine(event.clientX)    // 显示竖线
              }
            }

            return false
          },

          drop(view, event) {
            // 处理释放
            handleDrop(...)
            // 清除视觉提示
            clearVisualHints()
            return true
          },

          dragleave() {
            // 清除视觉提示
            clearVisualHints()
            return false
          }
        }
      }
    })
  }
}
```

### 4.2 CSS样式
```css
/* 拖拽句柄 */
.drag-handle {
  position: absolute;
  left: -24px;
  cursor: grab;
  opacity: 0;
  transition: opacity 0.2s;
}

.drag-handle:hover,
.drag-handle.dragging {
  opacity: 1;
}

/* 列布局 */
.column-layout {
  display: flex;
  gap: 16px;
  margin: 16px 0;
}

.column {
  flex: 1;
  min-width: 100px;
}

/* 拖拽提示线 */
.drop-indicator-horizontal {
  position: absolute;
  height: 2px;
  background: #3b82f6;
  width: 100%;
  pointer-events: none;
}

.drop-indicator-vertical {
  position: absolute;
  width: 2px;
  background: #3b82f6;
  height: 100%;
  pointer-events: none;
}
```

## 五、关键API使用

### 5.1 TipTap命令
```typescript
// 插入内容到指定位置
editor.commands.insertContentAt(position, content)

// 删除选中内容
editor.commands.deleteSelection()

// 设置节点选择
editor.commands.setNodeSelection(position)

// 链式命令
editor.chain()
  .focus()
  .deleteSelection()
  .insertContentAt(position, node)
  .run()
```

### 5.2 ProseMirror事务
```typescript
// 自定义命令
editor.commands.command(({ tr, state }) => {
  // 使用事务进行操作
  tr.delete(from, to)
  tr.insert(pos, node)

  // 映射位置（处理文档变化）
  const mappedPos = tr.mapping.map(originalPos)

  return true  // 返回true表示成功
})
```

## 六、实现步骤

### 第一步：重构为单编辑器
1. 删除 `ColumnContentEditor` 组件
2. 在主编辑器中注册 `ColumnLayout` 和 `Column` 扩展
3. 移除React状态管理的columns数组

### 第二步：创建节点扩展
1. 实现 `ColumnLayout` 节点
2. 实现 `Column` 节点
3. 定义content规则和schema

### 第三步：实现拖拽逻辑
1. 配置 `DragHandle` 扩展
2. 创建拖拽插件
3. 实现位置检测
4. 实现节点移动命令

### 第四步：添加视觉反馈
1. 实现拖拽提示线
2. 添加拖拽中的样式
3. 处理边界情况

### 第五步：测试优化
1. 测试各种拖拽场景
2. 处理边界情况
3. 优化性能

## 七、注意事项

1. **不要创建多个编辑器实例**
2. **列容器本身不可拖拽**
3. **最多5列限制需要强制执行**
4. **列内不能嵌套列**
5. **使用事务确保原子性操作**
6. **注意位置映射（mapping）**
7. **保持Schema严格性**

## 八、参考资源

- [TipTap官方文档](https://tiptap.dev)
- [ProseMirror指南](https://prosemirror.net/docs/guide/)
- [DragHandle扩展文档](https://tiptap.dev/api/extensions/drag-handle)
- [自定义节点文档](https://tiptap.dev/guide/custom-extensions)