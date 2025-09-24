# TipTap 多列布局实现 - 失败经验与教训

## 📋 项目背景

**目标**：为 TipTap 编辑器实现多列布局功能，支持通过拖拽创建和管理多列内容。

**需求**：
- 列布局是容器，不可被拖拽
- 列内的内容块可以被拖拽
- 支持创建 2-5 列布局
- 拖拽到块边缘创建列，拖拽到列内移动内容

## 🔴 遇到的问题

### 问题描述
实现多列布局后，拖拽句柄出现在列容器上，而不是列内的内容块上。导致：
- ❌ 整个列被拖拽（违背设计）
- ❌ 列内容无法单独拖拽
- ❌ 破坏了"列只是容器"的核心原则

## ❌ 失败原因分析

### 1. 对 ProseMirror 机制理解不足

```typescript
// ❌ 错误认知
const Column = Node.create({
  draggable: false,  // 以为这样就够了
})
```

**实际情况**：
- `draggable: false` 只影响 ProseMirror 原生拖拽
- 自定义拖拽句柄系统需要独立处理
- 两个系统之间没有自动联动

### 2. 错误的解决方向

```typescript
// ❌ 在拖拽系统中硬编码
if (outerNode.type.name === 'column' ||
    outerNode.type.name === 'columnLayout') {
  hideHandle()
}
```

**问题**：
- 违反开放封闭原则
- 增加系统耦合度
- 不可扩展（每个新容器都要改代码）

### 3. DOM 结构控制不当

```typescript
// ❌ 简单使用 ReactNodeViewRenderer
addNodeView() {
  return ReactNodeViewRenderer(ColumnComponent)
}
```

没有正确控制 DOM 结构，导致拖拽系统无法区分容器和内容。

### 4. 测试场景不完整

- ✅ 测试了列布局创建
- ❌ 没测试列内拖拽
- ❌ 没验证拖拽句柄显示
- ❌ 没测试边界情况

## 📚 核心教训

### 1. 系统边界理解

```
ProseMirror 层
├── draggable 属性
├── 节点规范
└── 选择系统

自定义拖拽层
├── 拖拽句柄显示
├── 拖拽检测逻辑
└── 视觉反馈

DOM 层
├── 元素属性
├── 事件处理
└── CSS 样式
```

**教训**：三个层次需要协同工作，不能只改一层。

### 2. 架构设计原则

#### ❌ 错误：命令式设计
```typescript
// 系统告诉节点怎么做
if (isColumnNode(node)) {
  doNotShowDragHandle()
}
```

#### ✅ 正确：声明式设计
```typescript
// 节点告诉系统自己的特性
const Column = Node.create({
  draggable: false,
  attrs: {
    isDragContainer: true
  }
})
```

### 3. 分离关注点

```typescript
// 拖拽系统：只关心"能否拖拽"
const canDrag = node.type.spec.draggable !== false

// 节点定义：声明自己的行为
const Column = {
  draggable: false,  // 我不能被拖拽
  selectable: false, // 我不能被选中
}
```

## ✅ 正确的解决方案

### 方案 1：通用标记机制（推荐）

```typescript
// 节点标记自己
const Column = Node.create({
  addNodeView() {
    return () => {
      const dom = document.createElement('div')
      dom.setAttribute('data-drag-container', 'true')
      return { dom }
    }
  }
})

// 拖拽系统识别标记
if (element.hasAttribute('data-drag-container')) {
  // 跳过容器，查找内部内容
}
```

### 方案 2：节点规范检查

```typescript
// 拖拽系统检查节点规范
const spec = editor.state.schema.nodes[nodeName].spec
if (spec.draggable === false) {
  hideHandle()
}
```

### 方案 3：白名单机制

```typescript
// 只为特定节点显示拖拽句柄
const DRAGGABLE_NODES = ['paragraph', 'heading', 'blockquote', 'codeBlock']
if (!DRAGGABLE_NODES.includes(node.type.name)) {
  hideHandle()
}
```

## 🎯 最佳实践

### 1. 节点定义清晰

```typescript
const Column = Node.create({
  name: 'column',
  group: 'container',      // 明确分组
  draggable: false,        // 不可拖拽
  selectable: false,       // 不可选中
  defining: true,          // 定义性节点
  isolating: true,         // 隔离内容
})
```

### 2. DOM 结构语义化

```html
<div data-column-layout="true" data-columns="2">
  <div data-column="true" data-drag-container="true">
    <div data-content="true">
      <!-- 实际可拖拽的内容 -->
    </div>
  </div>
</div>
```

### 3. 增量开发与测试

```typescript
describe('Column Layout', () => {
  test('列容器不显示拖拽句柄')
  test('列内内容显示拖拽句柄')
  test('可以拖拽内容到列中')
  test('可以从列中拖出内容')
  test('空列自动清理')
})
```

## 💡 关键领悟

### 1. 声明式 > 命令式
让节点声明自己的特性，而不是系统判断节点类型。

### 2. 组合 > 继承
通过组合多个简单机制实现复杂功能，而不是创建复杂的单一系统。

### 3. 标准 > 自定义
优先使用 ProseMirror 标准机制，必要时才自定义。

## 📊 影响评估

| 方面 | 错误做法的影响 | 正确做法的收益 |
|------|--------------|--------------|
| 可维护性 | 每次添加容器都要改拖拽系统 | 节点自描述，无需改动系统 |
| 扩展性 | 硬编码限制扩展 | 通用机制支持任意扩展 |
| 耦合度 | 系统间高度耦合 | 各层独立，低耦合 |
| 测试 | 需要大量集成测试 | 可单独测试各组件 |

## 🔄 后续改进

1. **建立节点分类系统**
   - content: 内容节点（可拖拽）
   - container: 容器节点（不可拖拽）
   - decoration: 装饰节点（不可拖拽）

2. **完善拖拽系统**
   - 支持节点规范自动识别
   - 提供拖拽行为配置接口
   - 增加拖拽事件钩子

3. **文档与示例**
   - 创建容器节点最佳实践
   - 拖拽系统集成指南
   - 常见问题解决方案

## 📝 总结

这次失败的根本原因是**没有正确理解系统边界和职责分离**。试图通过修改单一层次解决多层次问题，导致方案不完整。

**核心教训**：
> 好的架构应该让正确的事情容易做，错误的事情难以做。节点应该自己声明行为，系统应该识别和响应这些声明，而不是硬编码判断。

---

*文档创建时间：2024-09-23*
*项目：TipTap 多列布局扩展*