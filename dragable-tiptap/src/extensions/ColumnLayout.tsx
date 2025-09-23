import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import React from "react";

// React 组件用于渲染列布局
const ColumnLayoutView = ({ node, updateAttributes }: any) => {
  const columns = node.attrs.columns || 2;

  return (
    <NodeViewWrapper className="column-layout-wrapper">
      <div
        className="column-layout"
        data-columns={columns}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '1rem',
          marginBlock: '1rem',
          padding: '0.5rem',
          border: '1px dashed #e5e7eb',
          borderRadius: '0.5rem',
        }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <div
            key={index}
            className="column"
            style={{
              minHeight: '100px',
              padding: '0.5rem',
              border: '1px dashed #d1d5db',
              borderRadius: '0.25rem',
            }}
          >
            <NodeViewContent className={`column-${index}`} />
          </div>
        ))}
      </div>
    </NodeViewWrapper>
  );
};

// 创建 ColumnLayout 节点扩展
export const ColumnLayout = Node.create({
  name: "columnLayout",
  group: "block",
  content: "block+",
  draggable: false, // 列容器本身不可拖动

  addAttributes() {
    return {
      columns: {
        default: 2,
        parseHTML: element => parseInt(element.getAttribute("data-columns") || "2"),
        renderHTML: attributes => ({
          "data-columns": attributes.columns,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="column-layout"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "column-layout" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ColumnLayoutView);
  },

  addCommands() {
    return {
      setColumnLayout: (columns: number = 2) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: { columns: Math.min(5, Math.max(2, columns)) }, // 限制2-5列
          content: Array.from({ length: columns }).map(() => ({
            type: "paragraph",
            content: [],
          })),
        });
      },
    };
  },
});