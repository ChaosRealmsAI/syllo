'use client'

import DragDropEditor from '@/components/DragDropEditor'

export default function TestPage() {
  return (
    <main className="min-h-screen p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">拖拽句柄测试页面</h1>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>测试说明：</strong>
          </p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1">
            <li>• 将鼠标悬停在段落/标题上，应该看到左侧的拖拽句柄</li>
            <li>• 拖拽句柄显示为6个点（⋮⋮）</li>
            <li>• 拖动句柄可以移动整个块</li>
            <li>• 拖到边缘创建列，拖到中间调整顺序</li>
          </ul>
        </div>

        <DragDropEditor />
      </div>
    </main>
  )
}