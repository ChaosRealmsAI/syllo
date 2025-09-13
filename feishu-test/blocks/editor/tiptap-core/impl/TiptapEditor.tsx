'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorConfig } from '../contracts/editor.types';

export function TiptapEditor({ 
  placeholder = '开始输入内容...', 
  autofocus = false,
  editable = true,
  content = '',
  onUpdate
}: EditorConfig) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
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
    <div className="tiptap-editor">
      <EditorContent 
        editor={editor} 
        className="prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4"
      />
    </div>
  );
}