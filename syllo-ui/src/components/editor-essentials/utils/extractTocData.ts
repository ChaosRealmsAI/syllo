import { EditorBlock } from '../../block-editor/core/EditorContent';
import { TocItem } from '../../document-outline/types';

/**
 * 从编辑器blocks中提取标题信息，生成目录数据
 */
export function extractTocData(blocks: EditorBlock[]): TocItem[] {
  const tocItems: TocItem[] = [];
  const stack: TocItem[] = []; // 用于处理嵌套层级

  blocks.forEach((block) => {
    if (block.type === 'heading1' || block.type === 'heading2' || block.type === 'heading3' || block.type === 'heading4' || block.type === 'heading5') {
      const level = parseInt(block.type.replace('heading', ''));
      const tocItem: TocItem = {
        id: block.id,
        title: String(block.content),
        level: level,
        children: []
      };

      // 清理stack，移除当前级别及更深的项目
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        // 顶级项目
        tocItems.push(tocItem);
      } else {
        // 子项目
        const parent = stack[stack.length - 1];
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(tocItem);
      }

      stack.push(tocItem);
    }
  });

  return tocItems;
}

/**
 * 将flat的标题列表转换为嵌套结构
 */
export function buildTocHierarchy(tocItems: TocItem[]): TocItem[] {
  const result: TocItem[] = [];
  const stack: TocItem[] = [];

  tocItems.forEach(item => {
    // 清理stack，移除当前级别及更深的项目
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      // 顶级项目
      result.push(item);
    } else {
      // 子项目
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(item);
    }

    stack.push(item);
  });

  return result;
}