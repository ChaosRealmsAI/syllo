# 编辑器架构设计与重构计划

## 📋 目录
- [一、现状分析](#一现状分析)
- [二、新架构设计](#二新架构设计)
- [三、重构计划](#三重构计划)
- [四、实施步骤](#四实施步骤)
- [五、Tiptap集成策略](#五tiptap集成策略)

## 一、现状分析

### 当前问题
1. **目录结构混乱**
   - 层级嵌套过深（最深4层）
   - 功能模块分散在不同位置
   - 存在重复功能组件

2. **职责不清**
   - Block组件与编辑器逻辑耦合
   - 拖拽功能分散在多处
   - UI组件与业务组件混杂

3. **扩展性差**
   - 难以添加新的视图模式
   - Block类型扩展不够灵活
   - 与第三方编辑器集成困难

## 二、新架构设计

### 2.1 核心设计原则
- **模块化**: 四大独立模块，职责清晰
- **可扩展**: 易于添加新功能和视图
- **渐进式**: 支持逐步迁移到Tiptap
- **类型安全**: 完整的TypeScript类型定义

### 2.2 目录结构

```
syllo-ui/src/components/
├── editor/                      # 编辑器核心模块
│   ├── index.ts                # 统一导出
│   ├── Editor.tsx              # 主编辑器组件
│   ├── DocumentEditor.tsx      # 完整文档编辑器
│   │
│   ├── core/                   # 核心抽象层
│   │   ├── EditorProvider.tsx  # 编辑器上下文
│   │   ├── EditorInterface.ts  # 编辑器接口
│   │   ├── BlockInterface.ts   # Block接口
│   │   └── types.ts           # 类型定义
│   │
│   ├── views/                  # 视图模式
│   │   ├── DocumentView.tsx    # 文档视图（默认）
│   │   ├── CardView.tsx        # 卡片视图
│   │   ├── KanbanView.tsx      # 看板视图
│   │   ├── CompactView.tsx     # 紧凑视图
│   │   ├── PrintView.tsx       # 打印视图
│   │   └── ViewSelector.tsx    # 视图选择器
│   │
│   ├── layouts/                # 布局系统
│   │   ├── SingleColumn.tsx    # 单列布局
│   │   ├── MultiColumn.tsx     # 多列布局
│   │   ├── GridLayout.tsx      # 网格布局
│   │   ├── MasonryLayout.tsx   # 瀑布流布局
│   │   └── LayoutProvider.tsx  # 布局上下文
│   │
│   ├── dnd/                    # 拖拽系统
│   │   ├── DndProvider.tsx     # 拖拽上下文
│   │   ├── DragLayer.tsx       # 拖拽层
│   │   ├── DropZone.tsx        # 放置区域
│   │   ├── DropIndicator.tsx   # 拖拽指示器
│   │   └── hooks/              # 拖拽hooks
│   │       ├── useDraggable.ts
│   │       └── useDroppable.ts
│   │
│   ├── toolbar/                # 工具栏
│   │   ├── EditorToolbar.tsx   # 主工具栏
│   │   ├── BlockToolbar.tsx    # Block工具栏
│   │   ├── FloatingMenu.tsx    # 浮动菜单
│   │   └── SlashMenu.tsx       # 斜杠命令菜单
│   │
│   ├── implementations/        # 编辑器实现
│   │   ├── native/             # 原生React实现
│   │   │   └── NativeEditor.tsx
│   │   └── tiptap/             # Tiptap实现（预留）
│   │       ├── TiptapEditor.tsx
│   │       ├── extensions/
│   │       └── nodes/
│   │
│   └── styles/                 # 样式文件
│       ├── editor.module.css
│       ├── themes/             # 主题样式
│       └── variables.css       # CSS变量
│
├── blocks/                      # Block模块
│   ├── index.ts
│   ├── core/                   # Block核心
│   │   ├── Block.tsx           # Block基类
│   │   ├── BlockWrapper.tsx    # Block容器
│   │   ├── BlockHandle.tsx     # 拖拽句柄
│   │   ├── BlockMenu.tsx       # Block菜单
│   │   └── BlockRegistry.ts    # Block注册器
│   │
│   ├── types/                  # Block类型
│   │   ├── basic/              # 基础块
│   │   │   ├── HeadingBlock.tsx
│   │   │   ├── ParagraphBlock.tsx
│   │   │   └── DividerBlock.tsx
│   │   ├── list/               # 列表块
│   │   │   ├── BulletList.tsx
│   │   │   ├── NumberedList.tsx
│   │   │   └── CheckboxList.tsx
│   │   ├── media/              # 媒体块
│   │   │   ├── ImageBlock.tsx
│   │   │   ├── VideoBlock.tsx
│   │   │   └── FileBlock.tsx
│   │   ├── code/               # 代码块
│   │   │   ├── CodeBlock.tsx
│   │   │   └── CodeSandbox.tsx
│   │   ├── embed/              # 嵌入块
│   │   │   ├── LinkPreview.tsx
│   │   │   ├── TwitterEmbed.tsx
│   │   │   └── YouTubeEmbed.tsx
│   │   └── advanced/           # 高级块
│   │       ├── TableBlock.tsx
│   │       ├── KanbanBlock.tsx
│   │       └── TaskCard.tsx
│   │
│   └── utils/                  # Block工具
│       ├── blockHelpers.ts
│       └── blockValidation.ts
│
├── navigation/                  # 导航模块
│   ├── index.ts
│   ├── TopBar.tsx              # 顶部导航栏
│   ├── Breadcrumb.tsx          # 面包屑
│   ├── DocumentActions.tsx     # 文档操作
│   ├── ShareMenu.tsx           # 分享菜单
│   └── UserMenu.tsx            # 用户菜单
│
├── outline/                     # 大纲模块
│   ├── index.ts
│   ├── DocumentOutline.tsx     # 文档大纲
│   ├── OutlineItem.tsx         # 大纲项
│   ├── OutlineTree.tsx         # 大纲树
│   ├── ScrollSpy.tsx           # 滚动监听
│   └── hooks/
│       ├── useActiveSection.ts
│       └── useOutlineData.ts
│
├── ui/                          # 基础UI组件（保持不变）
│   └── ...
│
└── shared/                      # 共享组件
    ├── icons/                   # 图标
    ├── theme/                   # 主题
    └── utils/                   # 工具函数
```

### 2.3 架构层次

```
┌─────────────────────────────────────────────────┐
│                 DocumentEditor                   │ <- 完整编辑器
├─────────────────────────────────────────────────┤
│  TopBar │    Editor Area    │ DocumentOutline   │ <- 三大区域
├─────────┼───────────────────┼──────────────────┤
│         │   ViewComponent    │                  │ <- 视图层
│         ├───────────────────┤                  │
│         │  LayoutComponent   │                  │ <- 布局层
│         ├───────────────────┤                  │
│         │   Block System     │                  │ <- Block层
└─────────┴───────────────────┴──────────────────┘
```

## 三、重构计划

### 3.1 阶段一：基础重构（Week 1-2）
- [ ] 创建新的目录结构
- [ ] 抽取Block核心组件
- [ ] 实现基础编辑器框架
- [ ] 迁移现有Block类型

### 3.2 阶段二：功能完善（Week 3-4）
- [ ] 实现多视图系统
- [ ] 完善拖拽功能
- [ ] 添加工具栏系统
- [ ] 优化大纲组件

### 3.3 阶段三：高级功能（Week 5-6）
- [ ] 实现布局系统
- [ ] 添加快捷键支持
- [ ] 性能优化
- [ ] 添加测试

### 3.4 阶段四：Tiptap准备（Week 7-8）
- [ ] 设计适配器接口
- [ ] 创建Tiptap扩展
- [ ] 实现数据转换
- [ ] 集成测试

## 四、实施步骤

### 步骤1：创建核心结构
```bash
# 1. 创建新的目录结构
mkdir -p src/components/{editor,blocks,navigation,outline}

# 2. 创建核心文件
touch src/components/editor/core/EditorInterface.ts
touch src/components/blocks/core/Block.tsx
```

### 步骤2：实现Block系统
```tsx
// blocks/core/Block.tsx
export interface BlockProps {
  id: string;
  type: string;
  content: any;
  // 内置能力
  draggable?: boolean;
  editable?: boolean;
  deletable?: boolean;
}

export const Block: React.FC<BlockProps> = ({
  id,
  type,
  content,
  draggable = true,
  editable = true,
  deletable = true
}) => {
  const [showHandle, setShowHandle] = useState(false);

  return (
    <BlockWrapper
      onMouseEnter={() => setShowHandle(true)}
      onMouseLeave={() => setShowHandle(false)}
      draggable={draggable}
    >
      {showHandle && <BlockHandle />}
      <BlockContent type={type} content={content} />
      {showHandle && <BlockMenu />}
    </BlockWrapper>
  );
};
```

### 步骤3：实现编辑器核心
```tsx
// editor/Editor.tsx
export const Editor: React.FC<EditorProps> = ({
  blocks,
  view = 'document',
  layout = 'single',
  onBlocksChange
}) => {
  const ViewComponent = VIEW_COMPONENTS[view];
  const LayoutComponent = LAYOUT_COMPONENTS[layout];

  return (
    <EditorProvider value={{ blocks, onBlocksChange }}>
      <DndProvider>
        <LayoutComponent>
          <ViewComponent blocks={blocks} />
        </LayoutComponent>
      </DndProvider>
    </EditorProvider>
  );
};
```

### 步骤4：组装完整编辑器
```tsx
// editor/DocumentEditor.tsx
export const DocumentEditor: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="document-editor">
      <TopBar
        onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="editor-body">
        <DocumentOutline
          blocks={blocks}
          collapsed={sidebarCollapsed}
        />
        <Editor
          blocks={blocks}
          onBlocksChange={setBlocks}
        />
      </div>
    </div>
  );
};
```

## 五、Tiptap集成策略

### 5.1 适配器模式
```tsx
// editor/implementations/tiptap/TiptapAdapter.ts
export class TiptapAdapter implements EditorInterface {
  private editor: Editor;

  constructor(config: EditorConfig) {
    this.editor = new Editor({
      extensions: [
        // 自定义扩展
        BlockNode,
        DragHandleExtension,
        SlashMenuExtension,
      ],
    });
  }

  // 适配器方法
  getBlocks(): Block[] {
    return this.convertToBlocks(this.editor.state.doc);
  }

  updateBlock(id: string, content: any): void {
    this.editor.commands.updateBlock({ id, content });
  }
}
```

### 5.2 渐进式迁移
1. **保持UI组件独立**：所有UI组件与编辑器实现解耦
2. **数据格式兼容**：设计中间数据格式，支持双向转换
3. **功能平行开发**：原生版本和Tiptap版本并行维护
4. **平滑切换**：通过配置切换编辑器实现

### 5.3 关键集成点
- **Block节点**：使用Tiptap的NodeView渲染React组件
- **拖拽功能**：利用Tiptap的draggable属性
- **菜单系统**：集成Tiptap的BubbleMenu
- **快捷键**：使用Tiptap的键盘快捷键系统

## 六、技术决策

### 6.1 状态管理
- 编辑器状态：Context API
- Block状态：组件内部state
- 全局状态：考虑使用Zustand

### 6.2 样式方案
- 基础样式：CSS Modules
- 主题系统：CSS变量
- 动态样式：内联样式

### 6.3 性能优化
- 虚拟滚动：大文档优化
- 懒加载：按需加载Block类型
- 缓存策略：使用React.memo

### 6.4 测试策略
- 单元测试：每个Block组件
- 集成测试：编辑器核心功能
- E2E测试：关键用户流程

## 七、迁移清单

### 需要迁移的组件
- [x] block-editor → editor + blocks
- [x] document-outline → outline
- [x] feishu-nav → navigation
- [x] drag-toolbar → blocks/core
- [x] menu → editor/toolbar

### 需要保留的组件
- [x] ui/* - 基础UI组件
- [x] theme-provider - 主题系统

### 需要删除的组件
- [ ] 重复的拖拽组件
- [ ] 临时测试组件
- [ ] 废弃的样式文件

## 八、风险与对策

### 风险1：重构影响现有功能
**对策**：分步骤迁移，保持旧代码可用

### 风险2：Tiptap集成复杂度
**对策**：先完成原生版本，预留接口

### 风险3：性能问题
**对策**：早期进行性能测试，及时优化

## 九、时间表

| 阶段 | 时间 | 主要任务 | 交付物 |
|-----|------|---------|--------|
| Phase 1 | Week 1-2 | 基础架构搭建 | 核心编辑器框架 |
| Phase 2 | Week 3-4 | 功能迁移 | 完整功能的原生编辑器 |
| Phase 3 | Week 5-6 | 优化完善 | 生产就绪版本 |
| Phase 4 | Week 7-8 | Tiptap集成 | 双引擎支持 |

## 十、成功标准

1. **代码质量**
   - 100% TypeScript覆盖
   - 测试覆盖率 > 80%
   - 无关键性能问题

2. **功能完整**
   - 所有现有功能正常工作
   - 新增多视图支持
   - 拖拽功能流畅

3. **可维护性**
   - 清晰的模块划分
   - 完整的文档
   - 易于扩展新功能

4. **Tiptap就绪**
   - 适配器接口定义完成
   - 数据格式兼容
   - 可切换实现

---

## 附录：快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 构建生产版本
npm run build

# 4. 运行测试
npm run test
```

## 相关文档
- [Block开发指南](./docs/block-development.md)
- [视图模式说明](./docs/view-modes.md)
- [Tiptap集成指南](./docs/tiptap-integration.md)