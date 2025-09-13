import { ElementSnapshot } from '../contracts/types';

export class ElementSnapshotUtil {
  static capture(element: Element): ElementSnapshot {
    const computedStyles = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    // 捕获关键样式属性
    const relevantStyles = [
      'position', 'top', 'left', 'right', 'bottom',
      'width', 'height', 'transform', 'opacity',
      'z-index', 'display', 'visibility',
      'background-color', 'border', 'cursor',
      'transition', 'animation'
    ];
    
    const styles: Record<string, string> = {};
    relevantStyles.forEach(prop => {
      styles[prop] = computedStyles.getPropertyValue(prop);
    });
    
    // 捕获所有 data-* 属性
    const dataset: Record<string, string> = {};
    if (element instanceof HTMLElement) {
      Object.keys(element.dataset).forEach(key => {
        dataset[key] = element.dataset[key] || '';
      });
    }
    
    return {
      tagName: element.tagName,
      className: element.className,
      id: element.id,
      dataset,
      computedStyles: styles,
      boundingRect: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left
      } as DOMRect
    };
  }
  
  static captureTree(element: Element, depth: number = 2): ElementSnapshot & { children?: ElementSnapshot[] } {
    const snapshot = this.capture(element);
    
    if (depth > 0) {
      const children = Array.from(element.children).map(child => 
        this.captureTree(child, depth - 1)
      );
      return { ...snapshot, children };
    }
    
    return snapshot;
  }
  
  static findDragHandle(element: Element): Element | null {
    // 查找拖拽句柄的启发式规则
    const dragHandleSelectors = [
      '[draggable="true"]',
      '[data-drag-handle]',
      '.drag-handle',
      '.draggable',
      '[role="button"][aria-grabbed]'
    ];
    
    for (const selector of dragHandleSelectors) {
      const handle = element.querySelector(selector);
      if (handle) return handle;
    }
    
    // 检查元素本身是否可拖拽
    if (element.getAttribute('draggable') === 'true') {
      return element;
    }
    
    return null;
  }
}