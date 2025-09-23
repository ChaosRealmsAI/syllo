# TipTap 拖拽编辑器实现

## ✅ 已完成功能

我已经基于你的需求实现了一个完整的拖拽系统，具有以下功能：

### 1. 单编辑器架构
- 重构了原来的多编辑器架构
- 现在使用单一的TipTap编辑器实例
- 所有内容在同一个文档树中，可以自由拖拽

### 2. 拖拽功能
- **纵向移动**：拖动块上下调整顺序（显示蓝色横线）
- **横向布局**：拖到块的边缘创建列布局（显示蓝色竖线）
- **最多5列**：限制每行最多5个并列的列
- **拖拽句柄**：悬停在块上显示拖拽句柄（⋮⋮）

### 3. 节点扩展
创建了三个关键扩展：
- `ColumnLayout`：列布局容器（Block Node）
- `Column`：单个列（子节点）
- `DragDropPlugin`：自定义拖拽逻辑

### 4. 视觉效果
- 拖拽句柄动态显示
- 拖拽时的视觉提示线（横线/竖线）
- 响应式的样式和动画效果

## 🚀 运行项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看效果

## 📁 项目结构

```
src/
├── components/
│   ├── DragDropEditor.tsx    # 新的单编辑器组件
│   ├── Editor.tsx            # 主编辑器入口
│   └── column-editor/        # 旧的多编辑器实现（已弃用）
│
├── extensions/
│   ├── column-layout.ts      # 列布局节点扩展
│   ├── column.ts             # 列节点扩展
│   ├── drag-drop-plugin.ts   # 拖拽逻辑插件
│   └── drag-handle-config.ts # 拖拽句柄配置
│
└── styles/
    ├── drag-drop.css         # 拖拽相关样式
    └── column-editor.css     # 原列编辑器样式
```

## 🎯 使用说明

1. **创建列布局**
   - 点击工具栏的"创建列布局"按钮
   - 或拖动块到其他块的边缘

2. **移动块**
   - 悬停在块上显示拖拽句柄
   - 拖动句柄移动整个块
   - 拖到边缘创建列，拖到中间调整顺序

3. **限制**
   - 最多5列并排
   - 列内不能再创建子列
   - 只有块级内容可拖拽，列容器本身不可拖拽

## 🔧 技术要点

### 核心改变
1. **从多编辑器到单编辑器**
   - 旧：每个列都是独立的编辑器实例
   - 新：单一编辑器，列是节点

2. **拖拽实现**
   - 使用ProseMirror的Plugin系统
   - 自定义拖拽检测和处理逻辑
   - Transaction保证原子操作

3. **Schema设计**
   ```
   Document
   ├── Paragraph (可拖拽)
   ├── ColumnLayout (不可拖拽)
   │   ├── Column (不可拖拽)
   │   │   └── Paragraph (可拖拽)
   │   └── Column
   │       └── Heading (可拖拽)
   └── BlockQuote (可拖拽)
   ```

## 🐛 已知问题和优化建议

1. **性能优化**
   - 可以添加防抖处理拖拽事件
   - 大文档时可能需要虚拟滚动

2. **功能增强**
   - 可以添加撤销/重做支持
   - 可以保存/恢复列布局
   - 可以添加列宽调整功能

3. **用户体验**
   - 可以添加更多的视觉反馈
   - 可以支持键盘快捷键移动块
   - 可以添加拖拽动画效果

## 📚 相关文档

- [实现指南](./docs/drag-drop-implementation-guide.md)
- [拖拽设计文档](./docs/drag-drop-final.md)
- [TipTap概念说明](./docs/tiptap-official-concepts.md)
- [架构对比](./docs/tiptap-visual-guide.md)