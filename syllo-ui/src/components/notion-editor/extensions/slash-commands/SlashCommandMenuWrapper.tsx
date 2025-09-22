import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import SlashMenu from '@/components/menu/src/SlashMenu';
import { menuSections } from '@/components/menu/src/menuData';
import { Editor, Range } from '@tiptap/core';

interface SlashCommandMenuWrapperProps {
  editor: Editor;
  range: Range;
  items: any[];
  command: (item: any) => void;
}

export const SlashCommandMenuWrapper = forwardRef<any, SlashCommandMenuWrapperProps>(
  ({ editor, range, items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // 处理菜单项点击
    const handleItemClick = (item: any) => {
      // 根据item的类型执行相应的编辑器命令
      if (!editor || !range) return;

      editor.chain().focus().deleteRange(range).run();

      switch (item.id) {
        case 'heading1':
        case 'h1':
          editor.chain().setHeading({ level: 1 }).run();
          break;
        case 'heading2':
        case 'h2':
          editor.chain().setHeading({ level: 2 }).run();
          break;
        case 'heading3':
        case 'h3':
          editor.chain().setHeading({ level: 3 }).run();
          break;
        case 'text':
        case 'paragraph':
          editor.chain().setParagraph().run();
          break;
        case 'bullet-list':
        case 'bulletList':
          editor.chain().toggleBulletList().run();
          break;
        case 'numbered-list':
        case 'numberedList':
          editor.chain().toggleOrderedList().run();
          break;
        case 'quote':
        case 'blockquote':
          editor.chain().setBlockquote().run();
          break;
        case 'code':
        case 'codeBlock':
          editor.chain().setCodeBlock().run();
          break;
        case 'divider':
        case 'horizontalRule':
          editor.chain().setHorizontalRule().run();
          break;
        case 'table':
          // 处理表格插入
          if (item.data) {
            // TipTap的表格插入需要使用insertTable命令
            editor.chain()
              .insertContent({
                type: 'table',
                content: Array(item.data.rows).fill(null).map(() => ({
                  type: 'tableRow',
                  content: Array(item.data.cols).fill(null).map(() => ({
                    type: 'tableCell',
                    content: [{
                      type: 'paragraph',
                    }],
                  })),
                })),
              })
              .run();
          }
          break;
        default:
          // 其他自定义处理
          break;
      }

      // 执行原始command以关闭菜单
      command(item);
    };

    // 为了兼容键盘导航
    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        // SlashMenu组件内部已经处理了键盘导航
        // 这里只需要处理Escape键
        if (event.key === 'Escape') {
          return true;
        }
        return false;
      },
    }));

    // 使用用户的SlashMenu UI
    return (
      <div className="slash-command-wrapper">
        <SlashMenu
          sections={menuSections}
          onItemClick={handleItemClick}
        />
      </div>
    );
  }
);

SlashCommandMenuWrapper.displayName = 'SlashCommandMenuWrapper';