'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import type { ColumnContentEditorProps } from './types'

const lowlight = createLowlight(common)

export function ColumnContentEditor({ initialContent, index }: ColumnContentEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: initialContent || `<p>列 ${index + 1}</p>`,
    editorProps: {
      attributes: {
        class: 'column-editor-content focus:outline-none',
      },
    },
    immediatelyRender: false,
  })

  return <EditorContent editor={editor} />
}