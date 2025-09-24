# TipTap 多列布局 - 实现规划 V2

## 🎯 目标

基于失败经验，重新设计多列布局实现方案，确保：
1. 列容器不可拖拽（无拖拽句柄）
2. 列内内容正常拖拽
3. 支持拖拽创建列布局
4. 架构清晰，易于扩展

## 🏗️ 架构设计

### 核心原则

```
声明式设计：节点声明特性 → 系统识别 → 行为响应
职责分离：拖拽系统通用化，节点自描述行为
标准优先：优先使用 ProseMirror 标准机制
```

### 系统分层

```
┌─────────────────────────────────────┐
│         应用层（UI组件）              │
├─────────────────────────────────────┤
│      节点定义层（Node Specs）         │
├─────────────────────────────────────┤
│     拖拽系统层（Drag System）         │
├─────────────────────────────────────┤
│      ProseMirror 核心层              │
└─────────────────────────────────────┘
```

## 📋 实现步骤

### Phase 1: 节点定义优化 ✅

#### 1.1 ColumnLayout 节点
```typescript
const ColumnLayout = Node.create({
  name: 'columnLayout',
  group: 'block',
  content: 'column{2,5}',

  // 关键配置
  draggable: false,      // 不可拖拽
  selectable: false,     // 不可选中整个节点
  defining: true,        // 定义性节点
  isolating: true,       // 隔离内容

  // 自定义属性标记
  addAttributes() {
    return {
      nodeType: { default: 'container' },  // 标记为容器
      columns: { default: 2 }
    }
  },

  // 控制 DOM 结构
  parseDOM: [{
    tag: 'div[data-node-type="container"]',
  }],

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, {
      'data-node-type': 'container',
      'data-column-layout': '',
      class: 'column-layout-container'
    }), 0]
  }
})
```

#### 1.2 Column 节点
```typescript
const Column = Node.create({
  name: 'column',
  content: 'block+',

  // 关键配置
  draggable: false,
  selectable: false,

  addAttributes() {
    return {
      nodeType: { default: 'container' }
    }
  },

  parseDOM: [{
    tag: 'div[data-node-type="container"]',
  }],

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, {
      'data-node-type': 'container',
      'data-column': '',
      class: 'column-container'
    }), 0]
  }
})
```

### Phase 2: 拖拽系统增强 🔧

#### 2.1 通用容器识别机制
```typescript
// helpers/nodeClassifier.ts
export function isContainerNode(node: Node): boolean {
  // 方法1: 检查节点规范
  if (node.type.spec.draggable === false) {
    return true
  }

  // 方法2: 检查自定义属性
  if (node.attrs.nodeType === 'container') {
    return true
  }

  // 方法3: 检查节点名称（备用）
  const containerNodes = ['column', 'columnLayout', 'table', 'tableRow']
  return containerNodes.includes(node.type.name)
}

export function isDraggableNode(node: Node): boolean {
  return !isContainerNode(node)
}
```

#### 2.2 增强拖拽句柄显示逻辑
```typescript
// drag-handle-plugin.ts 修改
mousemove(view, e) {
  // ... 现有逻辑

  const nodeData = findElementNextToCoords({
    x: e.clientX,
    y: e.clientY,
    direction: 'right',
    editor,
    // 新增：过滤器函数
    filter: (element, node) => {
      // 跳过容器节点
      if (node && isContainerNode(node)) {
        return false
      }

      // 跳过带容器标记的 DOM 元素
      if (element.hasAttribute('data-node-type') &&
          element.getAttribute('data-node-type') === 'container') {
        return false
      }

      return true
    }
  })

  // ... 后续逻辑
}
```

### Phase 3: 拖拽行为实现 🎯

#### 3.1 拖拽检测增强
```typescript
export function analyzeDropContext(event: DragEvent, editor: Editor) {
  const target = getDropTarget(event)
  const source = getDragSource(event)

  return {
    // 源信息
    source: {
      node: source.node,
      inContainer: isInContainer(source.node),
      containerType: getContainerType(source.node)
    },

    // 目标信息
    target: {
      node: target.node,
      inContainer: isInContainer(target.node),
      containerType: getContainerType(target.node),
      dropZone: detectDropZone(event, target.element)
    },

    // 操作建议
    operation: suggestOperation(source, target)
  }
}

function suggestOperation(source, target) {
  // 不在容器中 + 边缘拖放 = 创建列
  if (!target.inContainer && target.dropZone.isEdge) {
    return 'CREATE_COLUMNS'
  }

  // 拖到列内 = 移动到列
  if (target.containerType === 'column' && target.dropZone.isInside) {
    return 'MOVE_TO_COLUMN'
  }

  // 默认 = 普通移动
  return 'STANDARD_MOVE'
}
```

#### 3.2 拖放处理器
```typescript
class ColumnDragHandler {
  handleDrop(event: DragEvent, editor: Editor) {
    const context = analyzeDropContext(event, editor)

    switch (context.operation) {
      case 'CREATE_COLUMNS':
        this.createColumns(context, editor)
        break

      case 'MOVE_TO_COLUMN':
        this.moveToColumn(context, editor)
        break

      case 'STANDARD_MOVE':
        // 让默认处理器处理
        return false
    }

    return true
  }

  createColumns(context, editor) {
    const { tr } = editor.state
    // ... 创建列布局逻辑
  }

  moveToColumn(context, editor) {
    const { tr } = editor.state
    // ... 移动到列逻辑
  }
}
```

### Phase 4: 视觉反馈系统 🎨

#### 4.1 拖拽指示器管理
```typescript
class DragIndicatorManager {
  private indicators = {
    horizontal: null,
    vertical: null,
    container: null
  }

  showColumnCreation(side: 'left' | 'right', rect: DOMRect) {
    // 显示垂直蓝线
    this.indicators.vertical = this.createVerticalLine(
      side === 'left' ? rect.left : rect.right,
      rect.height
    )
  }

  showColumnInsertion(rect: DOMRect) {
    // 高亮列容器
    this.indicators.container = this.highlightContainer(rect)
  }

  showStandardMove(rect: DOMRect) {
    // 显示水平蓝线
    this.indicators.horizontal = this.createHorizontalLine(
      rect.bottom,
      rect.width
    )
  }

  clear() {
    Object.values(this.indicators).forEach(indicator => {
      indicator?.remove()
    })
  }
}
```

### Phase 5: React 组件优化 ⚛️

#### 5.1 ColumnLayout 组件
```tsx
const ColumnLayoutView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  deleteNode
}) => {
  const columns = node.attrs.columns || 2

  return (
    <NodeViewWrapper
      className="column-layout-wrapper"
      data-node-type="container"
    >
      {/* 控制栏 - 不可编辑 */}
      <div className="column-controls" contentEditable={false}>
        <button onClick={() => addColumn()}>+ 列</button>
        <span>{columns} 列</span>
        <button onClick={() => removeLayout()}>✕</button>
      </div>

      {/* 内容区 - 可编辑 */}
      <div className="column-layout-content">
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  )
}
```

#### 5.2 Column 组件
```tsx
const ColumnView: React.FC<NodeViewProps> = ({ node }) => {
  const [isDragOver, setIsDragOver] = useState(false)

  return (
    <NodeViewWrapper
      className={`column ${isDragOver ? 'drag-over' : ''}`}
      data-node-type="container"
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={() => setIsDragOver(false)}
    >
      <NodeViewContent className="column-content" />
    </NodeViewWrapper>
  )
}
```

## 🧪 测试计划

### 单元测试
```typescript
describe('Column Layout', () => {
  describe('Node Configuration', () => {
    test('ColumnLayout 节点不可拖拽')
    test('Column 节点不可拖拽')
    test('列内段落可拖拽')
  })

  describe('Drag Handle Display', () => {
    test('列容器不显示拖拽句柄')
    test('列内内容显示拖拽句柄')
    test('嵌套内容正确显示拖拽句柄')
  })

  describe('Drag Operations', () => {
    test('拖拽到边缘创建列')
    test('拖拽到列内移动内容')
    test('从列中拖出内容')
    test('列之间移动内容')
  })

  describe('Auto Cleanup', () => {
    test('空列自动删除')
    test('单列自动解除布局')
  })
})
```

### 集成测试场景
1. 创建 2-5 列布局
2. 在列间拖拽内容
3. 将外部内容拖入列
4. 将列内内容拖出
5. 嵌套结构（列内有列表等）

## 📅 实施时间线

| 阶段 | 任务 | 预计时间 | 状态 |
|------|-----|---------|------|
| Phase 1 | 节点定义优化 | 1小时 | 待开始 |
| Phase 2 | 拖拽系统增强 | 2小时 | 待开始 |
| Phase 3 | 拖拽行为实现 | 2小时 | 待开始 |
| Phase 4 | 视觉反馈系统 | 1小时 | 待开始 |
| Phase 5 | React组件优化 | 1小时 | 待开始 |
| 测试 | 完整测试 | 2小时 | 待开始 |

## 🔑 关键成功因素

1. **严格的职责分离**
   - 拖拽系统不知道具体节点类型
   - 节点通过标准机制声明行为

2. **渐进式实现**
   - 先实现基础功能
   - 逐步添加高级特性

3. **充分的测试覆盖**
   - 每个功能点都要测试
   - 特别关注边界情况

4. **清晰的文档**
   - 代码注释完整
   - 架构决策有据可查

## 💡 创新点

### 1. 通用容器系统
不只是为列设计，可以扩展到任何容器类型（如卡片、分组等）。

### 2. 智能拖拽识别
根据上下文自动判断拖拽意图，提供最合适的操作。

### 3. 渐进增强
基础功能可用的同时，为高级用户提供更多控制选项。

## 📝 风险与对策

| 风险 | 影响 | 对策 |
|-----|-----|-----|
| ProseMirror 版本兼容 | 高 | 使用标准 API，避免内部实现 |
| 性能问题 | 中 | 使用虚拟滚动，限制最大列数 |
| 复杂交互冲突 | 中 | 完整的事件测试矩阵 |
| 浏览器兼容性 | 低 | 使用标准 DOM API |

## ✅ 成功标准

1. **功能完整**：所有需求功能正常工作
2. **架构清晰**：代码易读、易维护、易扩展
3. **性能良好**：拖拽流畅，无卡顿
4. **测试充分**：测试覆盖率 > 80%
5. **文档完善**：有完整的使用和开发文档

---

*文档创建时间：2024-09-23*
*版本：2.0*
*状态：规划中*