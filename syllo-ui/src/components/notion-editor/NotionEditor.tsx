"use client";

import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import { SlashCommandExtension } from './extensions/slash-commands/SlashCommandExtension';
import DragHandle from '@tiptap/extension-drag-handle-react';
import './styles/notion.css';

interface NotionEditorProps {
  content?: any;
  onUpdate?: (content: any) => void;
  title?: string;
  onTitleChange?: (title: string) => void;
  placeholder?: string;
  className?: string;
}

export const NotionEditor: React.FC<NotionEditorProps> = ({
  content,
  onUpdate,
  title = '',
  onTitleChange,
  placeholder = '输入 "/" 打开命令菜单...',
  className = ''
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    editable: true,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'notion-heading',
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: 'notion-paragraph',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'notion-list',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'notion-list',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'notion-list-item',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'notion-blockquote',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'notion-code-block',
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: 'notion-divider',
          },
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
        showOnlyWhenEditable: true,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'notion-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      SlashCommandExtension,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'notion-editor',
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onUpdate?.(json);
    },
  });

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange?.(e.target.value);
  }, [onTitleChange]);

  return (
    <div className={`notion-editor-container ${className}`}>
      <div className="notion-header">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="无标题"
          className="notion-title-input"
        />
      </div>
      <div className="notion-editor-wrapper">
        {editor && (
          <DragHandle editor={editor}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drag-handle-icon"
            >
              <circle cx="2" cy="2" r="0.8" fill="currentColor" />
              <circle cx="6" cy="2" r="0.8" fill="currentColor" />
              <circle cx="10" cy="2" r="0.8" fill="currentColor" />
              <circle cx="2" cy="6" r="0.8" fill="currentColor" />
              <circle cx="6" cy="6" r="0.8" fill="currentColor" />
              <circle cx="10" cy="6" r="0.8" fill="currentColor" />
              <circle cx="2" cy="10" r="0.8" fill="currentColor" />
              <circle cx="6" cy="10" r="0.8" fill="currentColor" />
              <circle cx="10" cy="10" r="0.8" fill="currentColor" />
            </svg>
          </DragHandle>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};