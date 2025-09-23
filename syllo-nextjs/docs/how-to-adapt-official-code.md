# 基于官方代码改造实现指南

## 改造策略

基于你复制的官方源码，我建议采用**"核心保留 + 功能扩展"**的改造策略。

## 一、需要保留的核心代码

### 1. 插件架构（✅ 保留）

```typescript
// 保留官方的插件创建模式
export const CustomDragHandle = Extension.create({
  name: 'customDragHandle',

  addProseMirrorPlugins() {
    return [
      DragHandlePlugin({
        // 配置项
      }).plugin
    ]
  }
})
```

### 2. 性能优化机制（✅ 保留）

```typescript
// 官方的 RAF 优化非常好，应该保留
let rafId: number | null = null
let pendingMouseCoords: { x: number; y: number } | null = null

handleDOMEvents: {
  mousemove(view, e) {
    pendingMouseCoords = { x: e.clientX, y: e.clientY }

    if (rafId) return false

    rafId = requestAnimationFrame(() => {
      // 处理逻辑
    })
  }
}
```

### 3. 位置追踪系统（✅ 保留）

```typescript
// 官方的位置映射机制很完善
if (tr.docChanged && currentNodePos !== -1) {
  const newPos = tr.mapping.map(currentNodePos)
  currentNodePos = newPos
}
```

### 4. Floating UI 定位（✅ 保留）

```typescript
// 官方使用 floating-ui 进行精确定位
computePosition(virtualElement, element, config).then(val => {
  element.style.left = `${val.x}px`
  element.style.top = `${val.y}px`
})
```

## 二、需要修改的部分

### 1. dragHandler 改造（添加列创建逻辑）

```typescript
// 原始 dragHandler
export function dragHandler(event: DragEvent, editor: Editor) {
  // 官方只处理基本拖拽
}

// 改造后
export function enhancedDragHandler(event: DragEvent, editor: Editor) {
  const { view } = editor

  // 保留原有逻辑
  const dragHandleRanges = getDragHandleRanges(event, editor)

  // ✅ 新增：边缘检测
  const dropPosition = detectDropPosition(event)

  // ✅ 新增：保存拖拽信息供后续使用
  ;(window as any).dragData = {
    ranges: dragHandleRanges,
    dropHint: dropPosition.type, // 'horizontal' | 'vertical'
    edgeThreshold: 50,
    maxColumns: 5
  }

  // 继续原有逻辑
  view.dragging = { slice, move: true }
}
```

### 2. 扩展 handleDOMEvents（添加拖放处理）

```typescript
// 在 drag-handle-plugin.ts 中扩展
props: {
  handleDOMEvents: {
    // 保留原有的 mousemove
    mousemove(view, e) { /* ... */ },

    // ✅ 新增：dragover 处理
    dragover(view, e) {
      e.preventDefault()

      const dropInfo = detectDropPosition(e, view)

      if (dropInfo.type === 'horizontal') {
        showVerticalLine(e.clientX)  // 显示竖线
      } else {
        showHorizontalLine(e.clientY) // 显示横线
      }

      return false
    },

    // ✅ 新增：drop 处理
    drop(view, e) {
      e.preventDefault()

      const dragData = (window as any).dragData
      const dropInfo = detectDropPosition(e, view)

      if (dropInfo.type === 'horizontal') {
        // 创建列布局
        createColumnLayout(view, dragData, dropInfo)
      } else {
        // 普通移动
        moveNode(view, dragData, dropInfo)
      }

      return true
    }
  }
}
```

### 3. 新增辅助函数

```typescript
// helpers/detectDropPosition.ts
export function detectDropPosition(
  event: DragEvent,
  view: EditorView
): DropInfo {
  const rect = view.dom.getBoundingClientRect()
  const x = event.clientX - rect.left
  const edgeThreshold = 50

  // 检测是否在边缘
  if (x < edgeThreshold) {
    return { type: 'horizontal', side: 'left' }
  }
  if (x > rect.width - edgeThreshold) {
    return { type: 'horizontal', side: 'right' }
  }

  return { type: 'vertical' }
}

// helpers/createColumnLayout.ts
export function createColumnLayout(
  view: EditorView,
  dragData: DragData,
  dropInfo: DropInfo
) {
  const { state, dispatch } = view
  const { schema } = state

  // 检查是否已在列布局中
  const $pos = state.doc.resolve(dropInfo.pos)

  if ($pos.parent.type.name === 'columnLayout') {
    // 已有列布局，检查列数
    if ($pos.parent.childCount >= 5) {
      return false // 超过最大列数
    }
    // 添加新列
    addColumnToExistingLayout(...)
  } else {
    // 创建新列布局
    const columnLayout = schema.nodes.columnLayout.create(...)
    dispatch(state.tr.replaceRangeWith(...))
  }
}
```

## 三、改造步骤

### Step 1: 复制并重命名

```bash
# 复制官方代码到你的项目
cp -r extension-drag-handle src/extensions/custom-drag-handle
cp -r extension-node-range src/extensions/custom-node-range
```

### Step 2: 修改包依赖

```typescript
// 修改 import 路径
// 原来：
import { DragHandle } from '@tiptap/extension-drag-handle'

// 改为：
import { CustomDragHandle } from './custom-drag-handle'
```

### Step 3: 添加新功能

```typescript
// custom-drag-handle/src/drag-handle.ts
export interface CustomDragHandleOptions extends DragHandleOptions {
  // 新增配置项
  enableColumnCreation?: boolean
  maxColumns?: number
  edgeThreshold?: number
  onColumnCreate?: (data: any) => void
}

export const CustomDragHandle = Extension.create<CustomDragHandleOptions>({
  // 保留原有代码

  addOptions() {
    return {
      ...super.addOptions(),
      // 新增默认值
      enableColumnCreation: true,
      maxColumns: 5,
      edgeThreshold: 50
    }
  }
})
```

### Step 4: 整合列布局节点

```typescript
// 添加列布局和列节点
import { ColumnLayout } from './nodes/column-layout'
import { Column } from './nodes/column'

// 在编辑器中注册
const editor = useEditor({
  extensions: [
    CustomDragHandle.configure({
      enableColumnCreation: true,
      maxColumns: 5
    }),
    CustomNodeRange,
    ColumnLayout,
    Column,
    // 其他扩展...
  ]
})
```

## 四、代码组织结构

```
src/extensions/
├── custom-drag-handle/
│   ├── src/
│   │   ├── drag-handle.ts         # 主扩展（基于官方）
│   │   ├── drag-handle-plugin.ts  # 插件（扩展官方）
│   │   └── helpers/
│   │       ├── dragHandler.ts     # 改造的拖拽处理
│   │       ├── detectDropPosition.ts # 新增
│   │       ├── createColumnLayout.ts # 新增
│   │       └── ... （保留官方的其他）
│   └── index.ts
│
├── custom-node-range/
│   └── ... （基本保留官方）
│
└── nodes/
    ├── column-layout.ts  # 新增
    └── column.ts        # 新增
```

## 五、关键改造点总结

| 模块 | 改造策略 | 原因 |
|------|---------|------|
| Extension 结构 | ✅ 保留 | 符合 TipTap 架构 |
| Plugin 机制 | ✅ 保留 | 核心逻辑框架好 |
| RAF 优化 | ✅ 保留 | 性能优化必要 |
| 位置追踪 | ✅ 保留 | 文档变化时需要 |
| Floating UI | ✅ 保留 | 定位精确 |
| Yjs 协作 | ❌ 移除 | 暂时不需要 |
| dragHandler | ⚠️ 扩展 | 添加列创建逻辑 |
| DOM Events | ⚠️ 扩展 | 添加 dragover/drop |
| 视觉反馈 | ➕ 新增 | 蓝线提示等 |

## 六、测试清单

改造完成后，确保测试以下功能：

- [ ] 基础拖拽移动
- [ ] 边缘检测（创建列）
- [ ] 最大列数限制（5列）
- [ ] 列内不能再创建列
- [ ] 拖拽句柄显示/隐藏
- [ ] 位置更新（文档变化时）
- [ ] 性能（大文档）
- [ ] 视觉反馈（蓝线）

## 七、优势分析

这种改造方案的优势：

1. **稳定性高**：基于官方测试过的代码
2. **维护性好**：保留官方架构，易于理解
3. **性能优秀**：继承官方的优化
4. **扩展性强**：可以继续添加新功能
5. **升级友好**：可以参考官方更新