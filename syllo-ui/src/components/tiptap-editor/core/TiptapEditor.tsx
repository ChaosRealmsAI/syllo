"use client";

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { CustomDragHandle } from '../extensions/CustomDragHandle';
import { SlashCommand } from '../extensions/SlashCommand';
import styles from '@/components/editor-essentials/styles/editor.module.css';
import '../styles/tiptap.css';

interface TiptapEditorProps {
  content?: any;  // 改为 any 以支持 JSON 格式
  onUpdate?: (content: any) => void;
  placeholder?: string;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onUpdate,
  placeholder = '输入 "/" 查看命令...'
}) => {
  const editor = useEditor({
    immediatelyRender: false,  // 解决 SSR 问题
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5],
          HTMLAttributes: {
            class: styles.heading,
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: styles.paragraph,
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: styles.blockquote,
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: styles.codeBlock,
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: styles.unorderedList,
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: styles.orderedList,
          },
        },
        listItem: {
          HTMLAttributes: {
            class: styles.listItem,
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: styles.divider,
          },
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      CustomDragHandle,
      SlashCommand,
    ],
    content,
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onUpdate?.(json);
    },
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className={`${styles.editorWrapper} tiptap-editor-wrapper`}>
      <EditorContent editor={editor} />
    </div>
  );
};