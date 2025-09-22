"use client";

import React, { useState } from 'react';
import { DragHandle, FramedDragHandle } from '@/components/drag-toolbar';

export default function FramedDragDemo() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Framed Drag Handle Demo</h1>

        <div className="space-y-8">
          {/* 对比展示 */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Component Comparison</h2>

            <div className="space-y-6">
              {/* 原始 DragHandle */}
              <div className="flex items-center space-x-4">
                <DragHandle
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
                <div>
                  <span className="text-sm font-medium">Original DragHandle</span>
                  <p className="text-xs text-gray-400">Simple, minimal design</p>
                </div>
              </div>

              {/* 带外框的 DragHandle - 深色模式 */}
              <div className="flex items-center space-x-4">
                <FramedDragHandle
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  darkMode={true}
                />
                <div>
                  <span className="text-sm font-medium">Framed DragHandle (Dark)</span>
                  <p className="text-xs text-gray-400">With border frame, dark mode</p>
                </div>
              </div>

              {/* 带外框的 DragHandle - 浅色模式 */}
              <div className="flex items-center space-x-4 p-3 bg-white rounded">
                <FramedDragHandle
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  darkMode={false}
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Framed DragHandle (Light)</span>
                  <p className="text-xs text-gray-600">With border frame, light mode</p>
                </div>
              </div>

              {/* 无边框版本 */}
              <div className="flex items-center space-x-4">
                <FramedDragHandle
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  showBorder={false}
                  darkMode={true}
                />
                <div>
                  <span className="text-sm font-medium">Framed DragHandle (No Border)</span>
                  <p className="text-xs text-gray-400">Background only, no border</p>
                </div>
              </div>
            </div>
          </div>

          {/* 拖拽状态 */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Drag Status</h2>
            <div className={`px-4 py-2 rounded-md ${isDragging ? 'bg-blue-900 text-blue-100' : 'bg-gray-800 text-gray-400'}`}>
              {isDragging ? '🎯 Dragging...' : '✋ Not dragging'}
            </div>
          </div>

          {/* 特性说明 */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Clean border frame design inspired by Feishu/Lark</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Supports both dark and light modes</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Optional border visibility</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Smooth hover and active states</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Cursor changes on drag (grab → grabbing)</span>
              </li>
            </ul>
          </div>

          {/* 使用示例 */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
            <pre className="bg-gray-950 p-4 rounded-md overflow-x-auto text-sm">
              <code className="text-gray-300">{`import { FramedDragHandle } from '@/components/drag-toolbar';

function MyComponent() {
  const handleDragStart = (e) => {
    console.log('Drag started');
  };

  const handleDragEnd = () => {
    console.log('Drag ended');
  };

  return (
    <FramedDragHandle
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      darkMode={true}      // true for dark mode, false for light
      showBorder={true}    // true to show border frame
    />
  );
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}