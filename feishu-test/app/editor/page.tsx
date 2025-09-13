'use client';

import React, { useState, useRef, useEffect } from 'react';
import './editor.css';

export default function FeishuEditor() {
  const [content, setContent] = useState<string[]>(['']);
  const [currentLine, setCurrentLine] = useState(0);
  const [saveStatus, setSaveStatus] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<NodeJS.Timeout>();

  // Track click positions based on recording
  const [clickHistory, setClickHistory] = useState<Array<{x: number, y: number, time: number}>>([]);
  
  // Document tree data
  const documents = [
    { id: 1, title: '读书笔记', active: true },
    { id: 2, title: '富爸爸创业', active: false },
    { id: 3, title: '富爸爸穷爸爸', active: false },
    { id: 4, title: '游资情绪交易系统', active: false },
  ];

  // Handle click positioning (from recording: 3 clicks)
  const handleEditorClick = (e: React.MouseEvent) => {
    const rect = editorRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setClickHistory(prev => [...prev, { x, y, time: Date.now() }]);
    
    // Calculate which line was clicked based on y position
    const lineHeight = 30; // Approximate line height
    const clickedLine = Math.floor(y / lineHeight);
    setCurrentLine(Math.min(clickedLine, content.length - 1));
    
    // Focus the editor
    const selection = window.getSelection();
    const range = document.createRange();
    const editableElements = editorRef.current?.querySelectorAll('.ace-line');
    if (editableElements && editableElements[currentLine]) {
      range.selectNodeContents(editableElements[currentLine]);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  // Handle keyboard input (from recording: "sdsf ", Enter, "sdf ")
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Create new line
      setContent(prev => {
        const newContent = [...prev];
        newContent.splice(currentLine + 1, 0, '');
        return newContent;
      });
      setCurrentLine(prev => prev + 1);
      triggerAutoSave();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const lineIndex = Array.from(editorRef.current?.children || []).indexOf(target.closest('.ace-line')!);
    
    if (lineIndex >= 0) {
      const newText = target.textContent || '';
      setContent(prev => {
        const newContent = [...prev];
        newContent[lineIndex] = newText;
        return newContent;
      });
      triggerAutoSave();
    }
  };

  // Auto-save mechanism
  const triggerAutoSave = () => {
    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    
    // Set saving status immediately for feedback
    setSaveStatus('保存中...');
    
    // Simulate save after 1 second (as per requirement)
    saveTimerRef.current = setTimeout(() => {
      setSaveStatus('已经保存到云端');
      // Clear status after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  // DOM mutation observer for tracking changes (46 DOM changes recorded)
  useEffect(() => {
    if (!editorRef.current) return;
    
    const observer = new MutationObserver((mutations) => {
      console.log(`DOM changes detected: ${mutations.length}`);
    });
    
    observer.observe(editorRef.current, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="container">
      {/* Left Sidebar */}
      {showSidebar && (
        <div className="sidebar">
          <div className="doc-tree">
            <h3>文档列表</h3>
            {documents.map(doc => (
              <div 
                key={doc.id} 
                className={`doc-item ${doc.active ? 'active' : ''}`}
              >
                📄 {doc.title}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Main Editor Area */}
      <div className="editor-main">
        {/* Header */}
        <div className="editor-header">
          <h1>读书笔记</h1>
          <div className="editor-toolbar">
            <button className="toolbar-btn">分享</button>
            <button className="toolbar-btn">编辑</button>
            <button 
              className="toolbar-btn"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? '隐藏侧边栏' : '显示侧边栏'}
            </button>
          </div>
          {saveStatus && (
            <div className="save-status">
              {saveStatus === '保存中...' ? '⏳' : '✅'} {saveStatus}
            </div>
          )}
        </div>
        
        {/* Editor Content */}
        <div className="editor-content">
          <div 
            className="page-block root-block"
            ref={editorRef}
            onClick={handleEditorClick}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
          >
            {content.map((line, index) => (
              <div 
                key={index}
                className="ace-line"
                contentEditable
                suppressContentEditableWarning
                data-line={index}
              >
                {line || '\u200B'}
              </div>
            ))}
          </div>
        </div>
        
        {/* Debug Info */}
        <div className="debug-info">
          <p>点击历史: {clickHistory.length} 次</p>
          <p>当前行: {currentLine + 1}</p>
          <p>总行数: {content.length}</p>
        </div>
      </div>
    </div>
  );
}