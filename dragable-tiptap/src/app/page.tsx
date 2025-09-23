"use client";

import DragableEditor from "@/components/DragableEditor";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-black">TipTap 拖拽编辑器</h1>
        <DragableEditor />
      </div>
    </div>
  );
}