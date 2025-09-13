'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Heading from '@tiptap/extension-heading';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { SlashCommands } from '../../slash-commands';
import { EditorConfig } from '../../tiptap-core/contracts/editor.types';
import 'tippy.js/dist/tippy.css';

export function EnhancedEditor({ 
  placeholder = '输入 / 来插入内容...', 
  autofocus = false,
  editable = true,
  content = '',
  onUpdate
}: EditorConfig) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        horizontalRule: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      CodeBlock,
      Blockquote,
      BulletList,
      OrderedList,
      ListItem,
      HorizontalRule,
      Placeholder.configure({
        placeholder,
      }),
      SlashCommands,
    ],
    content,
    autofocus,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
    },
  });

  return (
    <div className="enhanced-editor">
      <EditorContent 
        editor={editor} 
        className="prose prose-lg max-w-none focus:outline-none min-h-[400px]"
      />
      <style jsx global>{`
        .enhanced-editor .ProseMirror {
          padding: 2rem;
          outline: none;
          min-height: 400px;
        }

        .enhanced-editor .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }

        .enhanced-editor .ProseMirror h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .enhanced-editor .ProseMirror h2 {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .enhanced-editor .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .enhanced-editor .ProseMirror p {
          line-height: 1.8;
          margin-bottom: 0.75rem;
        }

        .enhanced-editor .ProseMirror ul,
        .enhanced-editor .ProseMirror ol {
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .enhanced-editor .ProseMirror li {
          margin-bottom: 0.25rem;
        }

        .enhanced-editor .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin-left: 0;
          color: #6b7280;
          font-style: italic;
        }

        .enhanced-editor .ProseMirror pre {
          background: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
        }

        .enhanced-editor .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2rem 0;
        }

        .tippy-box {
          background: transparent;
          border: none;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}