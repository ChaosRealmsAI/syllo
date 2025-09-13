'use client';

import { DragContainer } from '../../blocks/editor/drag-interaction';
import type { DraggableBlock } from '../../blocks/editor/drag-interaction';

const initialBlocks: DraggableBlock[] = [
  { id: '1', content: '飞书风格拖拽编辑器', type: 'heading' },
  { id: '2', content: '这是一个仿飞书文档的拖拽编辑器演示。鼠标悬停在任意内容块上，左侧会出现拖拽手柄。', type: 'paragraph' },
  { id: '3', content: '核心功能', type: 'heading' },
  { id: '4', content: '拖拽重排序 - 使用左侧手柄拖动块到新位置', type: 'list' },
  { id: '5', content: '视觉反馈 - 拖拽时显示蓝色插入指示线', type: 'list' },
  { id: '6', content: '多种块类型 - 支持标题、段落、列表、引用等', type: 'list' },
  { id: '7', content: '编辑器采用了类似飞书文档的交互设计，提供直观的拖拽体验。', type: 'paragraph' },
  { id: '8', content: '好的交互设计应该是直观的、符合用户预期的。', type: 'quote' },
  { id: '9', content: '后续计划', type: 'heading' },
  { id: '10', content: '实现多列布局 - 拖拽到右侧创建并排显示', type: 'list' },
  { id: '11', content: '嵌套拖拽 - 支持块的层级结构', type: 'list' },
  { id: '12', content: '键盘快捷键 - 提供更高效的操作方式', type: 'list' },
];

export default function DragDemoPage() {
  const handleBlocksChange = (blocks: DraggableBlock[]) => {
    console.log('Blocks reordered:', blocks);
  };

  return (
    <div className="min-h-screen bg-white">
      <DragContainer 
        initialBlocks={initialBlocks}
        onBlocksChange={handleBlocksChange}
      />
    </div>
  );
}