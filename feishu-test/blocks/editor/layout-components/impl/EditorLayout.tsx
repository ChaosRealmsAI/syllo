'use client';

import { useState } from 'react';
import { EditorLayoutProps } from '../contracts/components.types';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { TiptapEditor } from '../../tiptap-core';

export function EditorLayout({ 
  title, 
  content = '', 
  sidebarItems = [],
  showComments = true,
  onContentChange 
}: EditorLayoutProps) {
  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string>('');

  const defaultSidebarItems = sidebarItems.length > 0 ? sidebarItems : [
    {
      id: 'notes',
      title: '读书笔记',
      icon: '📚',
      children: [
        { id: 'rich-dad', title: '富爸爸创业' },
        { id: 'poor-dad', title: '富爸爸穷爸爸' },
        { id: 'trading', title: '游资情绪交易系统' }
      ]
    },
    {
      id: 'coding',
      title: 'coding',
      icon: '💻',
      children: [
        { id: 'rag', title: 'RAG' },
        { id: 'llm', title: 'LLM 理解' }
      ]
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-white">
      <TopBar 
        title={title}
        isEditMode={isEditMode}
        onToggleEdit={() => setIsEditMode(!isEditMode)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          items={defaultSidebarItems}
          selectedId={selectedItem}
          onItemClick={setSelectedItem}
        />
        
        <div className="flex-1 flex">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto py-8 px-12">
              <div className="mb-6">
                <h1 className="text-4xl font-bold mb-3">{title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                      C
                    </div>
                    <span>今天修改</span>
                  </div>
                </div>
              </div>
              
              <TiptapEditor 
                content={content}
                editable={isEditMode}
                placeholder="开始输入内容..."
                onUpdate={onContentChange}
              />
            </div>
          </div>
          
          {showComments && (
            <div className="w-80 border-l bg-gray-50 p-4">
              <div className="mb-4">
                <h3 className="font-medium">评论（0）</h3>
              </div>
              <div className="bg-white rounded-lg p-3 border">
                <input 
                  type="text" 
                  placeholder="输入评论..."
                  className="w-full outline-none text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}