# Block Editor 测试用例总览

本目录包含了 Block Editor 组件库的完整测试用例，覆盖了所有核心功能和交互逻辑。这些测试用例记录了重构前的所有行为细节，确保重构后功能的完整性。

## 测试文件结构

```
__tests__/
├── README.md                     # 测试总览文档
├── test-setup.ts                 # 测试环境配置
├── interaction-test-cases.md     # 交互逻辑详细用例文档
├── Editor.test.tsx               # 编辑器核心功能测试
├── CheckboxList.test.tsx         # 复选框列表组件测试
├── DragContext.test.tsx          # 拖拽上下文测试
└── TaskCard.test.tsx             # 任务卡片组件测试
```

## 测试覆盖范围

### 1. 编辑器核心功能 (`Editor.test.tsx`)

**测试重点:**
- ✅ 初始状态渲染
- ✅ 鼠标交互逻辑（hover激活块）
- ✅ 所有块类型的正确渲染
- ✅ 工具栏和文档元信息显示
- ✅ 多列布局渲染

**关键交互逻辑:**
- `EditorContent.tsx:40-48` - 鼠标移动设置 activeBlockId
- `EditorContent.tsx:51-53` - 鼠标离开清除 activeBlockId
- `Editor.tsx:399-400` - blocks 和 activeBlockId 状态管理

### 2. 复选框列表组件 (`CheckboxList.test.tsx`)

**测试重点:**
- ✅ 基础渲染和嵌套结构
- ✅ 编辑状态管理
- ✅ 键盘事件处理 (Enter/Escape/Tab)
- ✅ 项目增删改功能
- ✅ 拖拽手柄显示
- ✅ 样式状态逻辑

**关键交互逻辑:**
- `CheckboxList.tsx:33-34` - editingId 和 editingText 状态
- `CheckboxList.tsx:149-164` - 键盘事件处理
- `CheckboxList.tsx:54-84` - 添加新项目逻辑
- `CheckboxList.tsx:36-52` - 递归更新嵌套结构

### 3. 拖拽系统 (`DragContext.test.tsx`)

**测试重点:**
- ✅ Provider 初始化和状态管理
- ✅ 块查找功能（递归查找）
- ✅ 块移动逻辑（before/after位置）
- ✅ 块更新功能
- ✅ 深拷贝数据完整性
- ✅ 错误处理和边界情况

**关键交互逻辑:**
- `DragContext.tsx:38-44` - 三个核心状态管理
- `DragContext.tsx:47-70` - findBlock 和 findBlockParent
- `DragContext.tsx:73-114` - moveBlock 复杂逻辑
- `DragContext.tsx:75` - 深拷贝保证数据安全

### 4. 任务卡片组件 (`TaskCard.test.tsx`)

**测试重点:**
- ✅ 基础信息渲染
- ✅ 状态和优先级样式
- ✅ Compact 模式显示
- ✅ 编辑模式切换
- ✅ 表单编辑功能
- ✅ 拖拽手柄显示
- ✅ 过期日期警告

**关键交互逻辑:**
- `TaskCard.tsx:70-133` - 编辑模式状态管理
- `TaskCard.tsx:73-97` - 状态和优先级颜色映射
- `TaskCard.tsx:125-133` - 保存和取消逻辑
- `TaskCard.tsx:135` - 过期日期检测

## 核心交互模式总结

### 1. 状态管理模式
```typescript
// 编辑器级别状态
const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);
const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

// 组件级别状态
const [editingId, setEditingId] = useState<string | null>(null);
const [isEditing, setIsEditing] = useState(false);
```

### 2. 鼠标交互模式
```typescript
// 通用hover激活模式
const handleMouseMove = useCallback((e: React.MouseEvent) => {
  const target = e.target as HTMLElement;
  const blockElement = target.closest('[data-block-id]');
  const blockId = blockElement?.getAttribute('data-block-id');
  if (blockId && blockId !== activeBlockId) {
    setActiveBlockId(blockId);
  }
}, [activeBlockId, setActiveBlockId]);
```

### 3. 键盘交互模式
```typescript
// 标准编辑键盘处理
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === "Enter") {
    finishEdit();
    addNewItem();
  } else if (e.key === "Escape") {
    cancelEdit();
  } else if (e.key === "Tab") {
    e.preventDefault();
    addSubItem();
  }
};
```

### 4. 数据更新模式
```typescript
// 递归更新嵌套结构
const updateInItems = (items: Item[]): Item[] => {
  return items.map(item => {
    if (item.id === targetId) {
      return { ...item, ...updates };
    }
    if (item.children) {
      return { ...item, children: updateInItems(item.children) };
    }
    return item;
  });
};
```

### 5. 拖拽处理模式
```typescript
// 深拷贝 + 移除 + 插入模式
const moveBlock = (draggedId: string, targetId: string, position: "before" | "after") => {
  setBlocks(prevBlocks => {
    const newBlocks = JSON.parse(JSON.stringify(prevBlocks)); // 深拷贝
    const draggedBlock = removeBlock(newBlocks, draggedId);
    if (draggedBlock) {
      insertBlock(newBlocks, draggedBlock, targetId, position);
    }
    return newBlocks;
  });
};
```

## 测试运行方式

### 安装依赖
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

### 运行测试
```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test Editor.test.tsx

# 带覆盖率的测试
npm test -- --coverage

# 监听模式
npm test -- --watch
```

### Jest 配置 (jest.config.js)
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/components/block-editor/__tests__/test-setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/components/block-editor/**/*.{ts,tsx}',
    '!src/components/block-editor/**/*.d.ts',
    '!src/components/block-editor/__tests__/**/*',
  ],
};
```

## 重构指导原则

基于这些测试用例，重构时需要确保：

### 1. 保持所有现有交互行为
- 鼠标hover激活块的逻辑
- 键盘快捷键的完整功能
- 编辑模式的进入和退出
- 拖拽的完整流程

### 2. 保持数据结构兼容性
- EditorBlock 接口结构
- CheckboxItem 嵌套结构
- TaskData 完整字段
- DragState 状态定义

### 3. 保持UI行为一致性
- 工具栏显示/隐藏逻辑
- 编辑状态的视觉反馈
- hover效果和过渡动画
- 错误状态的处理

### 4. 保持性能特性
- useCallback 的使用
- 深拷贝的数据安全
- 递归操作的效率
- 组件重渲染的控制

## 扩展测试

重构后建议添加的测试：

### 1. Tiptap集成测试
- 节点视图的正确渲染
- Tiptap命令的执行
- 编辑器状态同步

### 2. 性能测试
- 大数据量的渲染性能
- 频繁拖拽的流畅度
- 内存泄漏检测

### 3. 可访问性测试
- 键盘导航
- 屏幕阅读器支持
- ARIA属性正确性

### 4. 端到端测试
- 完整编辑流程
- 复杂拖拽场景
- 多组件协作

## 结论

这套测试用例全面记录了当前编辑器的所有交互细节和功能特性。它们作为重构的"安全网"，确保新的纯UI组件架构能够保持所有现有功能的完整性。

重构时建议：
1. 先运行现有测试确保基准功能
2. 逐步重构并调整测试
3. 保持测试覆盖率不下降
4. 添加新的tiptap集成测试

通过这种渐进式的重构方法，可以最大化保证系统的稳定性和功能完整性。