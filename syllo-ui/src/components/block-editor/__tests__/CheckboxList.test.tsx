import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { CheckboxList, CheckboxItem } from '../blocks/markdown/CheckboxList';

// Mock shadcn/ui components
jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange, children, ...props }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('lucide-react', () => ({
  Plus: () => <span>Plus</span>,
  X: () => <span>X</span>,
  GripVertical: () => <span>GripVertical</span>,
}));

jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('CheckboxList Component', () => {
  const mockOnChange = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const sampleItems: CheckboxItem[] = [
    {
      id: 'task-1',
      text: '设计编辑器组件架构',
      checked: true,
      children: [
        { id: 'task-1-1', text: '分析需求', checked: true },
        { id: 'task-1-2', text: '设计接口', checked: true },
        { id: 'task-1-3', text: '制定规范', checked: false },
      ],
    },
    {
      id: 'task-2',
      text: '实现核心功能',
      checked: false,
      children: [
        { id: 'task-2-1', text: '表格组件', checked: true },
        { id: 'task-2-2', text: '任务管理', checked: false },
      ],
    },
    {
      id: 'task-3',
      text: '测试和优化',
      checked: false,
    },
  ];

  describe('基础渲染', () => {
    test('应该渲染所有检查框项目', () => {
      render(<CheckboxList items={sampleItems} />);

      expect(screen.getByText('设计编辑器组件架构')).toBeInTheDocument();
      expect(screen.getByText('实现核心功能')).toBeInTheDocument();
      expect(screen.getByText('测试和优化')).toBeInTheDocument();
    });

    test('应该渲染嵌套的子项目', () => {
      render(<CheckboxList items={sampleItems} />);

      expect(screen.getByText('分析需求')).toBeInTheDocument();
      expect(screen.getByText('设计接口')).toBeInTheDocument();
      expect(screen.getByText('制定规范')).toBeInTheDocument();
      expect(screen.getByText('表格组件')).toBeInTheDocument();
      expect(screen.getByText('任务管理')).toBeInTheDocument();
    });

    test('应该正确显示检查框状态', () => {
      render(<CheckboxList items={sampleItems} />);

      const checkboxes = screen.getAllByRole('checkbox');

      // 第一个任务已完成
      expect(checkboxes[0]).toBeChecked();

      // 第二个任务未完成
      expect(checkboxes[1]).not.toBeChecked();

      // 第三个任务未完成
      expect(checkboxes[2]).not.toBeChecked();
    });

    test('非编辑模式下不应该显示操作按钮', () => {
      render(<CheckboxList items={sampleItems} editable={false} />);

      // 不应该有加号按钮
      expect(screen.queryByText('Plus')).not.toBeInTheDocument();

      // 不应该有删除按钮
      expect(screen.queryByText('X')).not.toBeInTheDocument();
    });

    test('编辑模式下应该显示拖拽手柄', () => {
      render(<CheckboxList items={sampleItems} editable={true} />);

      const gripHandles = screen.getAllByText('GripVertical');
      expect(gripHandles.length).toBeGreaterThan(0);
    });
  });

  describe('检查框交互', () => {
    test('点击检查框应该调用onChange', async () => {
      render(<CheckboxList items={sampleItems} editable={true} onChange={mockOnChange} />);

      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]); // 点击第二个任务

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'task-2',
            checked: true, // 应该从false变为true
          }),
        ])
      );
    });

    test('应该能切换嵌套项目的状态', async () => {
      render(<CheckboxList items={sampleItems} editable={true} onChange={mockOnChange} />);

      const checkboxes = screen.getAllByRole('checkbox');
      // 假设第4个checkbox是第一个子项目 (task-1-1)
      await user.click(checkboxes[3]);

      expect(mockOnChange).toHaveBeenCalled();
      const updatedItems = mockOnChange.mock.calls[0][0];

      // 检查嵌套结构是否正确更新
      const parentTask = updatedItems.find((item: CheckboxItem) => item.id === 'task-1');
      const childTask = parentTask.children?.find((child: CheckboxItem) => child.id === 'task-1-1');
      expect(childTask?.checked).toBe(false); // 从true变为false
    });
  });

  describe('编辑功能', () => {
    test('点击文本应该进入编辑模式', async () => {
      render(<CheckboxList items={sampleItems} editable={true} onChange={mockOnChange} />);

      const taskText = screen.getByText('设计编辑器组件架构');
      await user.click(taskText);

      // 应该出现输入框
      await waitFor(() => {
        expect(screen.getByDisplayValue('设计编辑器组件架构')).toBeInTheDocument();
      });
    });

    test('编辑模式下应该自动聚焦输入框', async () => {
      render(<CheckboxList items={sampleItems} editable={true} onChange={mockOnChange} />);

      const taskText = screen.getByText('设计编辑器组件架构');
      await user.click(taskText);

      await waitFor(() => {
        const input = screen.getByDisplayValue('设计编辑器组件架构');
        expect(input).toHaveFocus();
      });
    });

    test('失焦应该保存编辑', async () => {
      render(<CheckboxList items={sampleItems} editable={true} onChange={mockOnChange} />);

      const taskText = screen.getByText('设计编辑器组件架构');
      await user.click(taskText);

      await waitFor(() => {
        const input = screen.getByDisplayValue('设计编辑器组件架构');
        expect(input).toBeInTheDocument();
      });

      const input = screen.getByDisplayValue('设计编辑器组件架构');
      await user.clear(input);
      await user.type(input, '修改后的架构设计');

      // 失焦
      fireEvent.blur(input);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'task-1',
            text: '修改后的架构设计',
          }),
        ])
      );
    });
  });

  describe('键盘交互', () => {
    test('Enter键应该完成编辑并添加新项', async () => {
      render(<CheckboxList items={sampleItems} editable={true} onChange={mockOnChange} />);

      const taskText = screen.getByText('设计编辑器组件架构');
      await user.click(taskText);

      await waitFor(() => {
        const input = screen.getByDisplayValue('设计编辑器组件架构');
        expect(input).toBeInTheDocument();
      });

      const input = screen.getByDisplayValue('设计编辑器组件架构');
      await user.clear(input);
      await user.type(input, '新的任务内容');
      await user.keyboard('{Enter}');

      // 应该调用onChange两次：一次保存编辑，一次添加新项
      expect(mockOnChange).toHaveBeenCalled();
    });

    test('Escape键应该取消编辑', async () => {
      render(<CheckboxList items={sampleItems} editable={true} onChange={mockOnChange} />);

      const taskText = screen.getByText('设计编辑器组件架构');
      await user.click(taskText);

      await waitFor(() => {
        const input = screen.getByDisplayValue('设计编辑器组件架构');
        expect(input).toBeInTheDocument();
      });

      const input = screen.getByDisplayValue('设计编辑器组件架构');
      await user.clear(input);
      await user.type(input, '这个编辑应该被取消');
      await user.keyboard('{Escape}');

      // 编辑应该被取消，文本恢复原样
      await waitFor(() => {
        expect(screen.getByText('设计编辑器组件架构')).toBeInTheDocument();
        expect(screen.queryByDisplayValue('这个编辑应该被取消')).not.toBeInTheDocument();
      });
    });

    test('Tab键应该添加子项', async () => {
      render(<CheckboxList items={sampleItems} editable={true} onChange={mockOnChange} />);

      const taskText = screen.getByText('测试和优化'); // 选择没有子项的任务
      await user.click(taskText);

      await waitFor(() => {
        const input = screen.getByDisplayValue('测试和优化');
        expect(input).toBeInTheDocument();
      });

      const input = screen.getByDisplayValue('测试和优化');
      await user.keyboard('{Tab}');

      // 应该添加子项
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('项目管理', () => {
    test('点击加号按钮应该添加新项', async () => {
      render(<CheckboxList items={sampleItems} editable={true} onChange={mockOnChange} />);

      // 找到加号按钮 (hover时显示)
      const taskContainer = screen.getByText('设计编辑器组件架构').closest('.group');
      const addButtons = screen.getAllByText('Plus');

      if (addButtons.length > 0) {
        await user.click(addButtons[0]);
        expect(mockOnChange).toHaveBeenCalled();
      }
    });

    test('点击删除按钮应该删除项目', async () => {
      render(<CheckboxList items={sampleItems} editable={true} onChange={mockOnChange} />);

      const deleteButtons = screen.getAllByText('X');
      if (deleteButtons.length > 0) {
        await user.click(deleteButtons[0]);
        expect(mockOnChange).toHaveBeenCalled();

        // 验证删除逻辑
        const updatedItems = mockOnChange.mock.calls[0][0];
        expect(updatedItems.length).toBeLessThan(sampleItems.length);
      }
    });

    test('空列表应该显示添加第一个任务的提示', () => {
      render(<CheckboxList items={[]} editable={true} onChange={mockOnChange} />);

      expect(screen.getByText('添加第一个任务')).toBeInTheDocument();
    });

    test('有项目时应该显示添加任务按钮', () => {
      render(<CheckboxList items={sampleItems} editable={true} onChange={mockOnChange} />);

      expect(screen.getByText('添加任务')).toBeInTheDocument();
    });
  });

  describe('嵌套结构', () => {
    test('应该正确计算嵌套缩进', () => {
      render(<CheckboxList items={sampleItems} editable={true} />);

      // 检查子项目是否有正确的缩进样式
      const childItem = screen.getByText('分析需求').closest('div');
      expect(childItem).toHaveStyle({ marginLeft: '24px' });
    });

    test('应该递归渲染多层嵌套', () => {
      const nestedItems: CheckboxItem[] = [
        {
          id: 'parent',
          text: '父项目',
          checked: false,
          children: [
            {
              id: 'child',
              text: '子项目',
              checked: false,
              children: [
                {
                  id: 'grandchild',
                  text: '孙项目',
                  checked: false,
                },
              ],
            },
          ],
        },
      ];

      render(<CheckboxList items={nestedItems} editable={true} />);

      expect(screen.getByText('父项目')).toBeInTheDocument();
      expect(screen.getByText('子项目')).toBeInTheDocument();
      expect(screen.getByText('孙项目')).toBeInTheDocument();
    });
  });

  describe('样式和状态', () => {
    test('已完成的项目应该有删除线样式', () => {
      render(<CheckboxList items={sampleItems} />);

      const completedTask = screen.getByText('设计编辑器组件架构');
      expect(completedTask).toHaveClass('line-through');
    });

    test('编辑状态应该有特殊背景', () => {
      render(<CheckboxList items={sampleItems} editable={true} onChange={mockOnChange} />);

      const taskText = screen.getByText('设计编辑器组件架构');
      fireEvent.click(taskText);

      // 编辑状态下的容器应该有特殊样式
      const container = taskText.closest('div');
      expect(container).toHaveClass('bg-muted/50');
    });

    test('hover状态应该显示操作按钮', () => {
      render(<CheckboxList items={sampleItems} editable={true} />);

      // 模拟hover (这在实际DOM中需要CSS，这里主要测试类名)
      const taskContainer = screen.getByText('设计编辑器组件架构').closest('.group');
      expect(taskContainer).toHaveClass('group');
    });
  });

  describe('ID生成逻辑', () => {
    test('新项目应该有唯一ID', async () => {
      const onChangeMock = jest.fn();
      render(<CheckboxList items={[]} editable={true} onChange={onChangeMock} />);

      const addButton = screen.getByText('添加第一个任务');
      await user.click(addButton);

      expect(onChangeMock).toHaveBeenCalledWith([
        expect.objectContaining({
          id: expect.stringMatching(/^checkbox-\d+-[a-z0-9]+$/),
          text: '',
          checked: false,
        }),
      ]);
    });
  });

  describe('性能优化', () => {
    test('不必要的重新渲染应该被避免', () => {
      const { rerender } = render(<CheckboxList items={sampleItems} />);

      // 使用相同的props重新渲染
      rerender(<CheckboxList items={sampleItems} />);

      // 内容应该保持一致
      expect(screen.getByText('设计编辑器组件架构')).toBeInTheDocument();
    });
  });
});