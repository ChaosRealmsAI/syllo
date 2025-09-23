"use client";

import React, { useEffect, useState } from "react";
import { Editor } from "@tiptap/core";
import { NodeRangeSelection } from "@tiptap/extension-node-range";

interface SimpleDragHandleProps {
  editor: Editor;
}

export default function SimpleDragHandle({ editor }: SimpleDragHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<'horizontal' | 'vertical' | null>(null);

  useEffect(() => {
    if (!editor) return;

    // 创建拖拽句柄元素
    const handle = document.createElement('div');
    handle.className = 'drag-handle';
    handle.draggable = true;
    handle.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="4" cy="4" r="1.5" fill="currentColor"/>
        <circle cx="4" cy="8" r="1.5" fill="currentColor"/>
        <circle cx="4" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="4" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="8" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      </svg>
    `;
    handle.style.cssText = `
      position: absolute;
      left: -40px;
      width: 24px;
      height: 24px;
      cursor: grab;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 4px;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 100;
    `;

    document.body.appendChild(handle);

    // 当前悬停的节点
    let currentBlockElement: HTMLElement | null = null;

    // 拖拽相关状态
    let startX = 0;
    let startY = 0;

    // 克隆拖拽图像
    const createDragImage = (element: HTMLElement) => {
      const clone = element.cloneNode(true) as HTMLElement;
      const wrapper = document.createElement('div');
      wrapper.style.position = 'absolute';
      wrapper.style.top = '-10000px';
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);
      return wrapper;
    };

    handle.addEventListener('dragstart', (e) => {
      if (!currentBlockElement) return;

      e.dataTransfer!.effectAllowed = 'move';
      e.dataTransfer!.setData('text/html', ''); // 需要设置数据
      setIsDragging(true);
      startX = e.clientX;
      startY = e.clientY;
      handle.style.cursor = 'grabbing';

      console.log('开始拖拽');

      try {
        // 获取节点位置
        const pos = editor.view.posAtDOM(currentBlockElement, 0);
        const $pos = editor.state.doc.resolve(pos);

        // 获取块级节点的准确范围
        let depth = $pos.depth;
        while (depth > 0 && !$pos.node(depth).isBlock) {
          depth--;
        }

        const before = $pos.before(depth);
        const after = before + $pos.node(depth).nodeSize;

        // 使用 NodeRangeSelection（官方的方式）
        const selection = NodeRangeSelection.create(editor.state.doc, before, after);

        // 获取内容切片
        const slice = selection.content();

        // 设置拖拽图像
        const dragImage = createDragImage(currentBlockElement);
        e.dataTransfer!.setDragImage(dragImage, 0, 0);

        // 清理拖拽图像
        setTimeout(() => document.body.removeChild(dragImage), 0);

        // 告诉 ProseMirror 拖拽的内容
        // @ts-ignore
        editor.view.dragging = { slice, move: true };

        // 设置选择
        const tr = editor.state.tr.setSelection(selection);
        editor.view.dispatch(tr);

        console.log('节点已选中，等待放置');
      } catch (error) {
        console.error('拖拽启动失败:', error);
      }
    });

    // 监听拖拽移动来检测方向
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault(); // 允许放置
      const deltaX = Math.abs(e.clientX - startX);
      const deltaY = Math.abs(e.clientY - startY);

      if (deltaX > 30 || deltaY > 30) {
        const direction = deltaX > deltaY ? 'horizontal' : 'vertical';
        setDragDirection(direction);
        updateDropIndicator(e, direction);
      }
    };

    document.addEventListener('dragover', handleDragOver);

    // 拖拽结束
    handle.addEventListener('dragend', () => {
      setIsDragging(false);
      setDragDirection(null);
      handle.style.cursor = 'grab';
      document.removeEventListener('dragover', handleDragOver);
      hideDropIndicator();
      // @ts-ignore
      editor.view.dragging = null;
      console.log('拖拽结束');
    });

    // 监听编辑器鼠标移动
    const editorDom = editor.view.dom;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) return;

      const target = e.target as HTMLElement;
      const blockElement = target.closest('.ProseMirror > *') as HTMLElement;

      if (blockElement) {
        currentBlockElement = blockElement;
        const rect = blockElement.getBoundingClientRect();
        const editorRect = editorDom.getBoundingClientRect();

        // 定位句柄
        handle.style.top = `${rect.top + rect.height / 2 - 12}px`;
        handle.style.left = `${editorRect.left - 35}px`;
        handle.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      if (!isDragging) {
        handle.style.opacity = '0';
        currentBlockElement = null;
      }
    };

    editorDom.addEventListener('mousemove', handleMouseMove);
    editorDom.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.body.removeChild(handle);
      editorDom.removeEventListener('mousemove', handleMouseMove);
      editorDom.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('dragover', handleDragOver);
    };
  }, [editor, isDragging]);

  // 更新拖放指示器
  const updateDropIndicator = (e: DragEvent, direction: 'horizontal' | 'vertical') => {
    let indicator = document.getElementById('drop-indicator');

    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'drop-indicator';
      document.body.appendChild(indicator);
    }

    const target = document.elementFromPoint(e.clientX, e.clientY);
    const blockElement = target?.closest('.ProseMirror > *') as HTMLElement;

    if (blockElement) {
      const rect = blockElement.getBoundingClientRect();

      indicator.style.cssText = `
        position: fixed;
        background: #3B82F6;
        pointer-events: none;
        z-index: 1000;
        transition: all 0.2s;
      `;

      if (direction === 'horizontal') {
        // 竖线 - 横向拖拽
        const isLeft = e.clientX < rect.left + rect.width / 2;
        indicator.style.left = isLeft ? `${rect.left - 2}px` : `${rect.right - 2}px`;
        indicator.style.top = `${rect.top}px`;
        indicator.style.width = '4px';
        indicator.style.height = `${rect.height}px`;
      } else {
        // 横线 - 纵向拖拽
        const isTop = e.clientY < rect.top + rect.height / 2;
        indicator.style.left = `${rect.left}px`;
        indicator.style.top = isTop ? `${rect.top - 2}px` : `${rect.bottom - 2}px`;
        indicator.style.width = `${rect.width}px`;
        indicator.style.height = '4px';
      }
    }
  };

  const hideDropIndicator = () => {
    const indicator = document.getElementById('drop-indicator');
    if (indicator) {
      indicator.remove();
    }
  };

  return null; // 这个组件只负责逻辑，不渲染任何内容
}