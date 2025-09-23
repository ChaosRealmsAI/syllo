'use client'

import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ColumnExtension } from '@/extensions/columns'
import FeishuColumnBlock from './FeishuColumnBlock'

export default function Editor() {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        document: false, // 需要禁用默认的 document 以支持列布局
      }),
      ColumnExtension,
    ],
    content: ``,
    editorProps: {
      attributes: {
        class: 'max-w-none focus:outline-none min-h-[300px] p-8 border rounded-lg bg-white text-black',
      },
    },
    immediatelyRender: false, // 解决 SSR 问题
  })

  if (!editor) {
    return null
  }

  return (
    <div>
      {/* 飞书风格列布局 */}
      <FeishuColumnBlock editor={editor} />
    </div>
  )
}