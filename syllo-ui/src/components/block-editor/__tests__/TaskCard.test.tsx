import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { TaskCard, TaskData, TaskStatus, TaskPriority } from '../blocks/task/TaskCard';

// Mock shadcn/ui components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, className, ...props }: any) => (
    <div className={className} {...props}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className, variant, ...props }: any) => (
    <span className={`badge ${variant} ${className}`} {...props}>
      {children}
    </span>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, ...props }: any) => (
    <button onClick={onClick} className={`btn ${variant} ${size}`} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: (props: any) => <textarea {...props} />,
}));

jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, className }: any) => <div className={`avatar ${className}`}>{children}</div>,
  AvatarFallback: ({ children }: any) => <span className="avatar-fallback">{children}</span>,
  AvatarImage: ({ src }: any) => <img src={src} alt="avatar" className="avatar-image" />,
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <div className="select-wrapper">
      <select value={value} onChange={(e) => onValueChange?.(e.target.value)}>
        {children}
      </select>
    </div>
  ),
  SelectContent: ({ children }: any) => <div className="select-content">{children}</div>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
  SelectTrigger: ({ children }: any) => <div className="select-trigger">{children}</div>,
  SelectValue: () => <span>Select Value</span>,
}));

jest.mock('lucide-react', () => ({
  Calendar: () => <span>Calendar</span>,
  Clock: () => <span>Clock</span>,
  Flag: ({ className }: any) => <span className={className}>Flag</span>,
  MessageSquare: () => <span>MessageSquare</span>,
  Paperclip: () => <span>Paperclip</span>,
  User: () => <span>User</span>,
  Edit3: () => <span>Edit3</span>,
  MoreHorizontal: () => <span>MoreHorizontal</span>,
  GripVertical: () => <span>GripVertical</span>,
}));

jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('TaskCard Component', () => {
  const mockOnChange = jest.fn();
  const mockOnStatusChange = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const sampleTask: TaskData = {
    id: 'task-1',
    title: '实现编辑器拖拽功能',
    description: '基于 @dnd-kit 实现编辑器块的拖拽排序功能，支持纵向和横向布局。',
    status: 'in-progress' as TaskStatus,
    priority: 'high' as TaskPriority,
    assignee: {
      id: 'user-1',
      name: '张三',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    },
    dueDate: '2024-02-01',
    estimatedTime: 8,
    tags: ['前端', '拖拽', 'UI'],
    comments: 3,
    attachments: 2,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-22',
  };

  const overdueTask: TaskData = {
    ...sampleTask,
    id: 'task-overdue',
    dueDate: '2023-12-01', // 过期日期
  };

  const completedTask: TaskData = {
    ...sampleTask,
    id: 'task-completed',
    status: 'done' as TaskStatus,
  };

  describe('基础渲染', () => {
    test('应该渲染任务基本信息', () => {
      render(<TaskCard task={sampleTask} />);

      expect(screen.getByText('实现编辑器拖拽功能')).toBeInTheDocument();
      expect(screen.getByText('基于 @dnd-kit 实现编辑器块的拖拽排序功能，支持纵向和横向布局。')).toBeInTheDocument();
      expect(screen.getByText('张三')).toBeInTheDocument();
    });

    test('应该显示正确的状态标签', () => {
      render(<TaskCard task={sampleTask} />);

      expect(screen.getByText('进行中')).toBeInTheDocument();
    });

    test('应该显示正确的优先级', () => {
      render(<TaskCard task={sampleTask} />);

      expect(screen.getByText('高')).toBeInTheDocument();
    });

    test('应该显示标签', () => {
      render(<TaskCard task={sampleTask} />);

      expect(screen.getByText('前端')).toBeInTheDocument();
      expect(screen.getByText('拖拽')).toBeInTheDocument();
      expect(screen.getByText('UI')).toBeInTheDocument();
    });

    test('应该显示元数据信息', () => {
      render(<TaskCard task={sampleTask} />);

      expect(screen.getByText('8h')).toBeInTheDocument(); // estimatedTime
      expect(screen.getByText('3')).toBeInTheDocument(); // comments
      expect(screen.getByText('2')).toBeInTheDocument(); // attachments
    });

    test('应该显示截止日期', () => {
      render(<TaskCard task={sampleTask} />);

      // 检查日期格式化结果
      expect(screen.getByText('2024/2/1')).toBeInTheDocument();
    });
  });

  describe('状态样式逻辑', () => {
    test('完成状态应该有特殊样式', () => {
      render(<TaskCard task={completedTask} />);

      const title = screen.getByText('实现编辑器拖拽功能');
      expect(title).toHaveClass('line-through');

      // 卡片应该有透明度
      const card = title.closest('.opacity-75');
      expect(card).toBeInTheDocument();
    });

    test('过期任务应该有警告样式', () => {
      render(<TaskCard task={overdueTask} />);

      // 过期日期应该有红色样式
      const dateElement = screen.getByText('2023/12/1');
      expect(dateElement.closest('.text-red-600, .dark\\:text-red-400')).toBeInTheDocument();
    });

    test('不同状态应该有对应的颜色', () => {
      const todoTask = { ...sampleTask, status: 'todo' as TaskStatus };
      const { rerender } = render(<TaskCard task={todoTask} />);

      expect(screen.getByText('待办')).toBeInTheDocument();

      rerender(<TaskCard task={{ ...sampleTask, status: 'review' as TaskStatus }} />);
      expect(screen.getByText('待审核')).toBeInTheDocument();

      rerender(<TaskCard task={{ ...sampleTask, status: 'done' as TaskStatus }} />);
      expect(screen.getByText('已完成')).toBeInTheDocument();
    });

    test('不同优先级应该有对应的颜色', () => {
      const { rerender } = render(<TaskCard task={{ ...sampleTask, priority: 'low' as TaskPriority }} />);

      expect(screen.getByText('低')).toBeInTheDocument();

      rerender(<TaskCard task={{ ...sampleTask, priority: 'medium' as TaskPriority }} />);
      expect(screen.getByText('中')).toBeInTheDocument();

      rerender(<TaskCard task={{ ...sampleTask, priority: 'urgent' as TaskPriority }} />);
      expect(screen.getByText('紧急')).toBeInTheDocument();
    });
  });

  describe('Compact模式', () => {
    test('compact模式应该显示简化信息', () => {
      render(<TaskCard task={sampleTask} compact={true} />);

      expect(screen.getByText('实现编辑器拖拽功能')).toBeInTheDocument();
      expect(screen.getByText('进行中')).toBeInTheDocument();

      // 不应该显示完整的描述
      expect(screen.queryByText('基于 @dnd-kit 实现编辑器块的拖拽排序功能，支持纵向和横向布局。')).not.toBeInTheDocument();
    });

    test('compact模式下draggable应该显示拖拽手柄', () => {
      render(<TaskCard task={sampleTask} compact={true} draggable={true} />);

      expect(screen.getByText('GripVertical')).toBeInTheDocument();
    });
  });

  describe('编辑功能', () => {
    test('editable模式应该显示编辑按钮', () => {
      render(<TaskCard task={sampleTask} editable={true} />);

      expect(screen.getByText('Edit3')).toBeInTheDocument();
    });

    test('点击编辑按钮应该进入编辑模式', async () => {
      render(<TaskCard task={sampleTask} editable={true} onChange={mockOnChange} />);

      const editButton = screen.getByText('Edit3');
      await user.click(editButton);

      // 应该显示编辑表单
      expect(screen.getByDisplayValue('实现编辑器拖拽功能')).toBeInTheDocument();
      expect(screen.getByDisplayValue('基于 @dnd-kit 实现编辑器块的拖拽排序功能，支持纵向和横向布局。')).toBeInTheDocument();
    });

    test('编辑模式应该显示表单字段', async () => {
      render(<TaskCard task={sampleTask} editable={true} onChange={mockOnChange} />);

      const editButton = screen.getByText('Edit3');
      await user.click(editButton);

      // 验证表单字段
      expect(screen.getByLabelText('状态')).toBeInTheDocument();
      expect(screen.getByLabelText('优先级')).toBeInTheDocument();
      expect(screen.getByLabelText('截止日期')).toBeInTheDocument();

      // 验证保存和取消按钮
      expect(screen.getByText('保存')).toBeInTheDocument();
      expect(screen.getByText('取消')).toBeInTheDocument();
    });

    test('保存应该调用onChange', async () => {
      render(<TaskCard task={sampleTask} editable={true} onChange={mockOnChange} />);

      const editButton = screen.getByText('Edit3');
      await user.click(editButton);

      const titleInput = screen.getByDisplayValue('实现编辑器拖拽功能');
      await user.clear(titleInput);
      await user.type(titleInput, '更新后的任务标题');

      const saveButton = screen.getByText('保存');
      await user.click(saveButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '更新后的任务标题',
        })
      );
    });

    test('取消应该恢复原始数据', async () => {
      render(<TaskCard task={sampleTask} editable={true} onChange={mockOnChange} />);

      const editButton = screen.getByText('Edit3');
      await user.click(editButton);

      const titleInput = screen.getByDisplayValue('实现编辑器拖拽功能');
      await user.clear(titleInput);
      await user.type(titleInput, '这个更改应该被取消');

      const cancelButton = screen.getByText('取消');
      await user.click(cancelButton);

      // 应该恢复到非编辑模式，显示原始标题
      expect(screen.getByText('实现编辑器拖拽功能')).toBeInTheDocument();
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    test('状态选择应该更新任务状态', async () => {
      render(<TaskCard task={sampleTask} editable={true} onChange={mockOnChange} />);

      const editButton = screen.getByText('Edit3');
      await user.click(editButton);

      const statusSelect = screen.getByRole('combobox');
      fireEvent.change(statusSelect, { target: { value: 'done' } });

      const saveButton = screen.getByText('保存');
      await user.click(saveButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'done',
        })
      );
    });
  });

  describe('拖拽功能', () => {
    test('draggable模式应该显示拖拽手柄', () => {
      render(<TaskCard task={sampleTask} draggable={true} />);

      expect(screen.getByText('GripVertical')).toBeInTheDocument();
    });

    test('非draggable模式不应该显示拖拽手柄', () => {
      render(<TaskCard task={sampleTask} draggable={false} />);

      expect(screen.queryByText('GripVertical')).not.toBeInTheDocument();
    });
  });

  describe('状态改变回调', () => {
    test('点击状态标签应该调用onStatusChange', async () => {
      render(<TaskCard task={sampleTask} onStatusChange={mockOnStatusChange} />);

      const statusBadge = screen.getByText('进行中');
      await user.click(statusBadge);

      expect(mockOnStatusChange).toHaveBeenCalledWith('task-1', 'in-progress');
    });
  });

  describe('可选字段处理', () => {
    test('缺少可选字段应该安全渲染', () => {
      const minimalTask: TaskData = {
        id: 'minimal-task',
        title: '最小任务',
        status: 'todo' as TaskStatus,
        priority: 'low' as TaskPriority,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      render(<TaskCard task={minimalTask} />);

      expect(screen.getByText('最小任务')).toBeInTheDocument();
      expect(screen.getByText('待办')).toBeInTheDocument();
      expect(screen.getByText('低')).toBeInTheDocument();
    });

    test('没有assignee应该不显示用户信息', () => {
      const taskWithoutAssignee = { ...sampleTask, assignee: undefined };
      render(<TaskCard task={taskWithoutAssignee} />);

      expect(screen.queryByText('张三')).not.toBeInTheDocument();
      expect(screen.queryByText('User')).not.toBeInTheDocument();
    });

    test('没有tags应该不显示标签', () => {
      const taskWithoutTags = { ...sampleTask, tags: undefined };
      render(<TaskCard task={taskWithoutTags} />);

      expect(screen.queryByText('前端')).not.toBeInTheDocument();
      expect(screen.queryByText('拖拽')).not.toBeInTheDocument();
    });

    test('没有description应该不显示描述区域', () => {
      const taskWithoutDescription = { ...sampleTask, description: undefined };
      render(<TaskCard task={taskWithoutDescription} />);

      expect(screen.queryByText('基于 @dnd-kit 实现编辑器块的拖拽排序功能，支持纵向和横向布局。')).not.toBeInTheDocument();
    });
  });

  describe('日期处理', () => {
    test('应该正确格式化日期', () => {
      render(<TaskCard task={sampleTask} />);

      // 检查截止日期格式
      expect(screen.getByText('2024/2/1')).toBeInTheDocument();
    });

    test('无截止日期应该不显示日期信息', () => {
      const taskWithoutDueDate = { ...sampleTask, dueDate: undefined };
      render(<TaskCard task={taskWithoutDueDate} />);

      expect(screen.queryByText('Calendar')).not.toBeInTheDocument();
    });
  });

  describe('hover效果', () => {
    test('卡片应该有hover类名', () => {
      render(<TaskCard task={sampleTask} />);

      const card = screen.getByText('实现编辑器拖拽功能').closest('.group');
      expect(card).toHaveClass('cursor-pointer', 'hover:shadow-md', 'transition-all');
    });

    test('编辑按钮应该在hover时显示', () => {
      render(<TaskCard task={sampleTask} editable={true} />);

      const editButton = screen.getByText('Edit3').closest('button');
      expect(editButton).toHaveClass('opacity-0', 'group-hover:opacity-100');
    });
  });
});