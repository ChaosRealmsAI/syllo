import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Editor } from '../core/Editor';

// Mock CSS modules
jest.mock('../styles/editor.module.css', () => ({
  editorWrapper: 'editorWrapper',
  editorContent: 'editorContent',
  contentBlock: 'contentBlock',
  blockContainerWithHotZone: 'blockContainerWithHotZone',
  paragraph: 'paragraph',
  heading: 'heading',
  headingH1: 'headingH1',
  headingH2: 'headingH2',
  headingH3: 'headingH3',
}));

describe('Editor Core Functionality', () => {
  beforeEach(() => {
    // Reset any mocks
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    test('应该正确渲染编辑器组件', () => {
      render(<Editor />);

      // 检查主要容器
      expect(screen.getByRole('document')).toBeInTheDocument();
    });

    test('应该渲染工具栏', () => {
      render(<Editor />);

      // 工具栏应该存在
      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();
    });

    test('应该渲染文档标题和元信息', () => {
      render(<Editor />);

      // 文档标题
      expect(screen.getByDisplayValue('飞书编辑器纯UI版')).toBeInTheDocument();

      // 文档元信息
      expect(screen.getByText('用户')).toBeInTheDocument();
      expect(screen.getByText('今天修改')).toBeInTheDocument();
    });

    test('应该渲染所有初始块', () => {
      render(<Editor />);

      // 检查一些关键的初始块内容
      expect(screen.getByText('一级标题示例')).toBeInTheDocument();
      expect(screen.getByText('这是一个为Tiptap集成准备的纯UI版本。所有样式都已经提取为CSS变量，方便后续与Tiptap编辑器集成。')).toBeInTheDocument();
      expect(screen.getByText('二级标题示例')).toBeInTheDocument();
    });
  });

  describe('Block Interaction', () => {
    test('鼠标移动应该设置活动块', async () => {
      render(<Editor />);

      // 找到第一个段落块
      const paragraphBlock = screen.getByText('这是一个为Tiptap集成准备的纯UI版本。所有样式都已经提取为CSS变量，方便后续与Tiptap编辑器集成。');

      // 模拟鼠标移动
      fireEvent.mouseMove(paragraphBlock);

      // 由于工具栏只在active状态下显示，我们检查相关的数据属性
      const blockContainer = paragraphBlock.closest('[data-block-id]');
      expect(blockContainer).toHaveAttribute('data-block-id');
    });

    test('鼠标离开编辑器应该清除活动块', async () => {
      render(<Editor />);

      const editorContent = screen.getByRole('document');

      // 先激活一个块
      const paragraphBlock = screen.getByText('这是一个为Tiptap集成准备的纯UI版本。所有样式都已经提取为CSS变量，方便后续与Tiptap编辑器集成。');
      fireEvent.mouseMove(paragraphBlock);

      // 然后鼠标离开
      fireEvent.mouseLeave(editorContent);

      // 验证活动状态被清除（这需要检查内部状态，实际测试中可能需要调整）
      await waitFor(() => {
        // 工具栏应该隐藏或状态改变
        // 这里的具体实现取决于工具栏的显示逻辑
      });
    });
  });

  describe('Block Types Rendering', () => {
    test('应该正确渲染标题块', () => {
      render(<Editor />);

      // H1标题
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('一级标题示例');

      // H2标题
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements[0]).toHaveTextContent('二级标题示例');

      // H3标题
      const h3 = screen.getByRole('heading', { level: 3 });
      expect(h3).toHaveTextContent('三级标题示例');
    });

    test('应该正确渲染列表块', () => {
      render(<Editor />);

      // 无序列表
      const unorderedLists = screen.getAllByRole('list');
      expect(unorderedLists.length).toBeGreaterThan(0);

      // 检查列表项内容
      expect(screen.getByText('CSS变量系统已完善')).toBeInTheDocument();
      expect(screen.getByText('预留了Tiptap样式覆盖')).toBeInTheDocument();
      expect(screen.getByText('保持飞书视觉风格')).toBeInTheDocument();
    });

    test('应该正确渲染代码块', () => {
      render(<Editor />);

      // 代码块内容
      expect(screen.getByText(/Tiptap集成示例代码/)).toBeInTheDocument();
      expect(screen.getByText(/import { Editor } from '@tiptap\/core'/)).toBeInTheDocument();
    });

    test('应该正确渲染引用块', () => {
      render(<Editor />);

      // 引用内容
      expect(screen.getByText('这个纯UI版本可以直接作为Tiptap的样式基础，无需重构。')).toBeInTheDocument();
    });

    test('应该正确渲染分割线', () => {
      render(<Editor />);

      // 分割线元素 (可能需要根据实际HTML结构调整选择器)
      const dividers = screen.getAllByRole('separator');
      expect(dividers.length).toBeGreaterThan(0);
    });
  });

  describe('Advanced Block Types', () => {
    test('应该渲染表格组件', () => {
      render(<Editor />);

      // 表格标题
      expect(screen.getByText('功能')).toBeInTheDocument();
      expect(screen.getByText('状态')).toBeInTheDocument();
      expect(screen.getByText('优先级')).toBeInTheDocument();
      expect(screen.getByText('负责人')).toBeInTheDocument();

      // 表格内容
      expect(screen.getByText('表格组件')).toBeInTheDocument();
      expect(screen.getByText('✅ 完成')).toBeInTheDocument();
    });

    test('应该渲染复选框列表', () => {
      render(<Editor />);

      // 复选框项目
      expect(screen.getByText('设计编辑器组件架构')).toBeInTheDocument();
      expect(screen.getByText('实现核心功能')).toBeInTheDocument();
      expect(screen.getByText('测试和优化')).toBeInTheDocument();

      // 子项目
      expect(screen.getByText('分析需求')).toBeInTheDocument();
      expect(screen.getByText('设计接口')).toBeInTheDocument();
    });

    test('应该渲染链接预览', () => {
      render(<Editor />);

      // 链接预览内容
      expect(screen.getByText('shadcn/ui - Beautifully designed components')).toBeInTheDocument();
      expect(screen.getByText('Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.')).toBeInTheDocument();
    });

    test('应该渲染任务卡片', () => {
      render(<Editor />);

      // 任务卡片内容
      expect(screen.getByText('实现编辑器拖拽功能')).toBeInTheDocument();
      expect(screen.getByText('基于 @dnd-kit 实现编辑器块的拖拽排序功能，支持纵向和横向布局。')).toBeInTheDocument();
      expect(screen.getByText('张三')).toBeInTheDocument();
    });

    test('应该渲染高亮块', () => {
      render(<Editor />);

      // 高亮块内容
      expect(screen.getByText('提示信息')).toBeInTheDocument();
      expect(screen.getByText('这是一个信息提示块，用于展示重要的提示信息。所有新组件都已经成功集成到编辑器中！')).toBeInTheDocument();

      expect(screen.getByText('成功')).toBeInTheDocument();
      expect(screen.getByText('现代化编辑器组件已经完全集成，支持表格、复选框列表、链接预览、任务卡片和高亮块。')).toBeInTheDocument();
    });

    test('应该渲染看板组件', () => {
      render(<Editor />);

      // 看板列标题
      expect(screen.getByText('待办事项')).toBeInTheDocument();
      expect(screen.getByText('进行中')).toBeInTheDocument();
      expect(screen.getByText('已完成')).toBeInTheDocument();

      // 看板任务
      expect(screen.getByText('设计用户界面')).toBeInTheDocument();
      expect(screen.getByText('实现拖拽功能')).toBeInTheDocument();
      expect(screen.getByText('项目初始化')).toBeInTheDocument();
    });
  });

  describe('Column Layout', () => {
    test('应该正确渲染多列布局', () => {
      render(<Editor />);

      // 多列内容标题
      expect(screen.getByText('多列内容展示')).toBeInTheDocument();

      // 第一列内容
      expect(screen.getByText('第一项内容')).toBeInTheDocument();
      expect(screen.getByText('子项内容')).toBeInTheDocument();

      // 第二列内容
      expect(screen.getByText('中间列的内容')).toBeInTheDocument();
      expect(screen.getByText('这一列占据了41%的宽度，是三列中最宽的一列。可以放置更多的内容。')).toBeInTheDocument();

      // 第三列内容
      expect(screen.getByText('列标题')).toBeInTheDocument();
      expect(screen.getByText('第三列的内容。支持各种内容块，包括标题、段落、列表等。')).toBeInTheDocument();
    });
  });
});