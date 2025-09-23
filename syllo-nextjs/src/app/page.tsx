import Editor from '@/components/Editor'

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-white text-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-black">TipTap 拖拽编辑器</h1>
        <Editor />
      </div>
    </main>
  )
}