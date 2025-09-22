import { Editor, Range } from '@tiptap/core';

export interface CommandItem {
  title: string;
  description: string;
  icon: string;
  command: ({ editor, range }: { editor: Editor; range: Range }) => void;
}

export const suggestionItems: CommandItem[] = [
  {
    title: '文本',
    description: '开始输入普通文本',
    icon: '📝',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setParagraph()
        .run();
    },
  },
  {
    title: '标题 1',
    description: '大标题',
    icon: 'H1',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setHeading({ level: 1 })
        .run();
    },
  },
  {
    title: '标题 2',
    description: '中等标题',
    icon: 'H2',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setHeading({ level: 2 })
        .run();
    },
  },
  {
    title: '标题 3',
    description: '小标题',
    icon: 'H3',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setHeading({ level: 3 })
        .run();
    },
  },
  {
    title: '无序列表',
    description: '创建一个无序列表',
    icon: '•',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBulletList()
        .run();
    },
  },
  {
    title: '有序列表',
    description: '创建一个有序列表',
    icon: '1.',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleOrderedList()
        .run();
    },
  },
  {
    title: '引用',
    description: '创建引用块',
    icon: '"',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setBlockquote()
        .run();
    },
  },
  {
    title: '代码块',
    description: '创建代码块',
    icon: '</>',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setCodeBlock()
        .run();
    },
  },
  {
    title: '分割线',
    description: '插入分割线',
    icon: '—',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setHorizontalRule()
        .run();
    },
  },
];