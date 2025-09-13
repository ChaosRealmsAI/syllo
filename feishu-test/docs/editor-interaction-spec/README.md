# 编辑器交互层需求说明

## 核心交互功能

### 1. 块拖拽（Block Dragging）

#### 1.1 拖拽手柄
- **触发方式**：鼠标悬停在块左侧时显示 `⋮⋮` 拖拽手柄
- **视觉效果**：
  - 默认：灰色，透明度 0.3
  - 悬停：深灰色，透明度 0.8
  - 拖拽中：蓝色高亮

#### 1.2 拖拽行为
- **拖拽开始**：按住拖拽手柄
- **拖拽中**：
  - 显示蓝色插入指示线
  - 原位置显示半透明占位符
  - 拖拽的块跟随鼠标，半透明显示
- **拖拽结束**：松开鼠标，块移动到新位置

### 2. 多列布局（Multi-Column Layout）

#### 2.1 触发条件
- 将块拖拽到另一个块的**右侧热区**
- 热区判定：块右侧 1/3 区域

#### 2.2 布局规则
```
单列布局：
[Block A]
[Block B]
[Block C]

拖拽 B 到 A 右侧后：
[Block A | Block B]  <- 同一行显示
[Block C]
```

#### 2.3 列宽调整
- 默认：等宽分配
- 可拖拽中间分割线调整宽度
- 最小宽度：200px
- 最多列数：3列

### 3. 嵌套拖拽（Nested Dragging）

#### 3.1 支持嵌套的块类型
- ✅ 引用块（Blockquote）
- ✅ 列表项（List Item）
- ✅ 折叠块（Collapsible）
- ❌ 代码块（不支持嵌套）
- ❌ 表格（不支持嵌套）

#### 3.2 缩进指示
- 拖拽时按住 `Tab` 或向右移动：增加缩进
- 拖拽时按住 `Shift+Tab` 或向左移动：减少缩进
- 视觉提示：蓝色指示线相应缩进

### 4. 块选择（Block Selection）

#### 4.1 单选
- 点击块左侧空白区域
- 选中后显示蓝色左边框

#### 4.2 多选
- `Shift + 点击`：范围选择
- `Cmd/Ctrl + 点击`：单个添加/移除
- 拖拽框选：从空白处开始拖拽

#### 4.3 块操作菜单
点击拖拽手柄时显示：
- 删除
- 复制
- 转换类型
- 添加评论
- 设置颜色/样式

### 5. 快捷键

| 操作 | 快捷键 |
|------|--------|
| 移动块向上 | `Cmd/Ctrl + Shift + ↑` |
| 移动块向下 | `Cmd/Ctrl + Shift + ↓` |
| 增加缩进 | `Tab` |
| 减少缩进 | `Shift + Tab` |
| 删除块 | `Cmd/Ctrl + Shift + Backspace` |
| 复制块 | `Cmd/Ctrl + D` |

### 6. 动画效果

#### 6.1 拖拽动画
- 持续时间：200ms
- 缓动函数：ease-in-out
- 使用 transform 而非 position 优化性能

#### 6.2 布局切换动画
- 列布局变化：300ms 过渡
- 使用 CSS Grid 或 Flexbox 实现

### 7. 交互状态

#### 7.1 块状态
```typescript
interface BlockState {
  id: string;
  selected: boolean;
  dragging: boolean;
  hovering: boolean;
  focused: boolean;
  columnIndex?: number;  // 所在列
  rowIndex?: number;     // 所在行
}
```

#### 7.2 布局状态
```typescript
interface LayoutState {
  rows: Array<{
    id: string;
    columns: Array<{
      blockId: string;
      width: number;  // 百分比
    }>;
  }>;
}
```

## 技术实现建议

### 使用的库
1. **@dnd-kit/sortable** - 拖拽排序
2. **@dnd-kit/modifiers** - 拖拽修饰器
3. **framer-motion** - 动画
4. **react-hotkeys-hook** - 快捷键

### 架构设计
```
blocks/
  editor/
    interaction-layer/
      contracts/
        - drag.types.ts
        - layout.types.ts
        - selection.types.ts
      impl/
        - DragHandle.tsx
        - DropZone.tsx
        - ColumnLayout.tsx
        - BlockSelection.tsx
      hooks/
        - useDragDrop.ts
        - useBlockSelection.ts
        - useColumnLayout.ts
```

## 验收标准

### 功能验收
- [ ] 拖拽手柄正确显示和隐藏
- [ ] 块可以上下拖拽排序
- [ ] 块可以拖拽形成多列布局
- [ ] 支持嵌套拖拽（列表、引用块）
- [ ] 块选择功能正常
- [ ] 所有快捷键生效

### 性能验收
- [ ] 拖拽无卡顿（60fps）
- [ ] 大量块（100+）时性能良好
- [ ] 动画流畅

### 兼容性验收
- [ ] Chrome/Edge/Safari/Firefox 兼容
- [ ] 触摸设备支持
- [ ] 键盘导航支持