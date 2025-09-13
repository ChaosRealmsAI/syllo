import { Editor } from '@tiptap/react';
import { SlashCommand } from '../contracts/slash-commands.types';

export const slashCommands: SlashCommand[] = [
  {
    id: 'heading1',
    title: '标题 1',
    description: '大标题',
    icon: 'H1',
    group: '基础',
    command: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    }
  },
  {
    id: 'heading2',
    title: '标题 2',
    description: '中标题',
    icon: 'H2',
    group: '基础',
    command: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    }
  },
  {
    id: 'heading3',
    title: '标题 3',
    description: '小标题',
    icon: 'H3',
    group: '基础',
    command: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    }
  },
  {
    id: 'paragraph',
    title: '正文',
    description: '普通段落',
    icon: '¶',
    group: '基础',
    command: (editor: Editor) => {
      editor.chain().focus().setParagraph().run();
    }
  },
  {
    id: 'bulletList',
    title: '无序列表',
    description: '创建无序列表',
    icon: '•',
    group: '列表',
    command: (editor: Editor) => {
      editor.chain().focus().toggleBulletList().run();
    }
  },
  {
    id: 'orderedList',
    title: '有序列表',
    description: '创建有序列表',
    icon: '1.',
    group: '列表',
    command: (editor: Editor) => {
      editor.chain().focus().toggleOrderedList().run();
    }
  },
  {
    id: 'blockquote',
    title: '引用',
    description: '添加引用块',
    icon: '"',
    group: '基础',
    command: (editor: Editor) => {
      editor.chain().focus().toggleBlockquote().run();
    }
  },
  {
    id: 'codeBlock',
    title: '代码块',
    description: '添加代码块',
    icon: '</>',
    group: '代码',
    command: (editor: Editor) => {
      editor.chain().focus().toggleCodeBlock().run();
    }
  },
  {
    id: 'horizontalRule',
    title: '分割线',
    description: '插入水平分割线',
    icon: '—',
    group: '基础',
    command: (editor: Editor) => {
      editor.chain().focus().setHorizontalRule().run();
    }
  }
];