"use client";

import React, { useState, useRef, useCallback } from "react";
import { DragHandle } from "@tiptap/extension-drag-handle-react";
import { Editor } from "@tiptap/core";

interface DragHandleComponentProps {
  editor: Editor;
}

export default function DragHandleComponent({ editor }: DragHandleComponentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<"vertical" | "horizontal" | null>(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [currentNode, setCurrentNode] = useState<any>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    show: boolean;
    type: "horizontal" | "vertical";
    position: { x: number; y: number; width: number; height: number };
  }>({ show: false, type: "horizontal", position: { x: 0, y: 0, width: 0, height: 0 } });

  const dragRef = useRef<HTMLDivElement>(null);

  // 检测拖拽方向
  const detectDragDirection = useCallback((currentX: number, currentY: number) => {
    const deltaX = Math.abs(currentX - dragStartPos.x);
    const deltaY = Math.abs(currentY - dragStartPos.y);
    const threshold = 30; // 像素阈值

    if (deltaX > threshold || deltaY > threshold) {
      return deltaX > deltaY ? "horizontal" : "vertical";
    }
    return null;
  }, [dragStartPos]);

  // 处理拖拽开始
  const handleDragStart = useCallback((e: DragEvent, node: any) => {
    setIsDragging(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setCurrentNode(node);
    setDragDirection(null);

    // 设置拖拽数据
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", "");
    }
  }, []);

  // 处理拖拽移动
  const handleDragMove = useCallback((e: DragEvent) => {
    if (!isDragging) return;

    // 检测拖拽方向
    const direction = detectDragDirection(e.clientX, e.clientY);
    if (direction && direction !== dragDirection) {
      setDragDirection(direction);
    }

    // 获取目标元素
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (!target) return;

    // 查找最近的块级元素
    const blockElement = target.closest(".ProseMirror > *");
    if (!blockElement) return;

    const rect = blockElement.getBoundingClientRect();

    // 根据方向显示不同的指示器
    if (direction === "horizontal") {
      // 横向拖拽 - 显示竖线
      const isLeft = e.clientX < rect.left + rect.width / 2;
      setDropIndicator({
        show: true,
        type: "vertical",
        position: {
          x: isLeft ? rect.left - 2 : rect.right - 2,
          y: rect.top,
          width: 4,
          height: rect.height,
        },
      });
    } else if (direction === "vertical") {
      // 纵向拖拽 - 显示横线
      const isTop = e.clientY < rect.top + rect.height / 2;
      setDropIndicator({
        show: true,
        type: "horizontal",
        position: {
          x: rect.left,
          y: isTop ? rect.top - 2 : rect.bottom - 2,
          width: rect.width,
          height: 4,
        },
      });
    }
  }, [isDragging, dragDirection, detectDragDirection]);

  // 处理拖拽结束
  const handleDragEnd = useCallback((e: DragEvent) => {
    if (!isDragging || !currentNode) return;

    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (!target) {
      resetDragState();
      return;
    }

    const blockElement = target.closest(".ProseMirror > *");
    if (!blockElement) {
      resetDragState();
      return;
    }

    // 根据拖拽方向执行不同的操作
    if (dragDirection === "horizontal") {
      // 横向拖拽 - 创建列布局
      handleHorizontalDrop(e, blockElement);
    } else if (dragDirection === "vertical") {
      // 纵向拖拽 - 重新排序
      handleVerticalDrop(e, blockElement);
    }

    resetDragState();
  }, [isDragging, currentNode, dragDirection, editor]);

  // 处理横向拖放（创建列）
  const handleHorizontalDrop = useCallback((_e: DragEvent, targetElement: Element) => {
    // 获取目标节点位置
    const targetPos = getNodePosition(targetElement);
    if (targetPos === null) return;

    // 检查是否可以创建列布局
    const { state } = editor;
    const targetNode = state.doc.nodeAt(targetPos);

    if (!targetNode) return;

    // 如果目标已经是列布局，添加到列中
    if (targetNode.type.name === "columnLayout") {
      const columns = targetNode.attrs.columns;
      if (columns < 5) {
        // 增加列数
        editor.chain()
          .focus()
          .updateAttributes("columnLayout", { columns: columns + 1 })
          .run();
      }
    } else {
      // 创建新的列布局
      editor.chain()
        .focus()
        .setColumnLayout(2)
        .run();
    }
  }, [editor]);

  // 处理纵向拖放（重新排序）
  const handleVerticalDrop = useCallback((_e: DragEvent, targetElement: Element) => {
    // const rect = targetElement.getBoundingClientRect();
    // const isTop = e.clientY < rect.top + rect.height / 2;

    // 使用 TipTap 的命令移动节点
    // 这里需要实现具体的移动逻辑
    const targetPos = getNodePosition(targetElement);
    if (targetPos === null) return;

    // 执行移动操作
    // editor.chain().focus().moveNode(currentNodePos, targetPos, isTop).run();
  }, [editor, currentNode]);

  // 获取节点位置
  const getNodePosition = (element: Element): number | null => {
    const index = Array.from(element.parentElement?.children || []).indexOf(element);
    if (index === -1) return null;

    let pos = 0;
    for (let i = 0; i < index; i++) {
      const node = editor.state.doc.child(i);
      pos += node.nodeSize;
    }
    return pos;
  };

  // 重置拖拽状态
  const resetDragState = () => {
    setIsDragging(false);
    setDragDirection(null);
    setCurrentNode(null);
    setDropIndicator({ show: false, type: "horizontal", position: { x: 0, y: 0, width: 0, height: 0 } });
  };

  return (
    <>
      <DragHandle
        editor={editor}
        onNodeChange={({ node, pos }) => {
          setCurrentNode({ node, pos });
        }}
        onElementDragStart={(e) => handleDragStart(e, currentNode)}
        onElementDragEnd={handleDragEnd}
      >
        <div
          ref={dragRef}
          className="drag-handle"
          onDragOver={(e) => handleDragMove(e.nativeEvent as DragEvent)}
          style={{
            cursor: "grab",
            padding: "4px",
            borderRadius: "4px",
            transition: "background 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "24px",
            height: "24px",
            background: isDragging ? "#3B82F6" : "#e5e7eb",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 3.5C5 4.32843 4.32843 5 3.5 5C2.67157 5 2 4.32843 2 3.5C2 2.67157 2.67157 2 3.5 2C4.32843 2 5 2.67157 5 3.5Z"
              fill="currentColor"
            />
            <path
              d="M5 8C5 8.82843 4.32843 9.5 3.5 9.5C2.67157 9.5 2 8.82843 2 8C2 7.17157 2.67157 6.5 3.5 6.5C4.32843 6.5 5 7.17157 5 8Z"
              fill="currentColor"
            />
            <path
              d="M5 12.5C5 13.3284 4.32843 14 3.5 14C2.67157 14 2 13.3284 2 12.5C2 11.6716 2.67157 11 3.5 11C4.32843 11 5 11.6716 5 12.5Z"
              fill="currentColor"
            />
            <path
              d="M14 3.5C14 4.32843 13.3284 5 12.5 5C11.6716 5 11 4.32843 11 3.5C11 2.67157 11.6716 2 12.5 2C13.3284 2 14 2.67157 14 3.5Z"
              fill="currentColor"
            />
            <path
              d="M14 8C14 8.82843 13.3284 9.5 12.5 9.5C11.6716 9.5 11 8.82843 11 8C11 7.17157 11.6716 6.5 12.5 6.5C13.3284 6.5 14 7.17157 14 8Z"
              fill="currentColor"
            />
            <path
              d="M14 12.5C14 13.3284 13.3284 14 12.5 14C11.6716 14 11 13.3284 11 12.5C11 11.6716 11.6716 11 12.5 11C13.3284 11 14 11.6716 14 12.5Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </DragHandle>

      {/* 拖拽指示器 */}
      {dropIndicator.show && (
        <div
          className={`drop-indicator ${dropIndicator.type}`}
          style={{
            position: "fixed",
            left: dropIndicator.position.x,
            top: dropIndicator.position.y,
            width: dropIndicator.position.width,
            height: dropIndicator.position.height,
            background: "#3B82F6",
            pointerEvents: "none",
            zIndex: 1000,
            borderRadius: "2px",
          }}
        />
      )}
    </>
  );
}