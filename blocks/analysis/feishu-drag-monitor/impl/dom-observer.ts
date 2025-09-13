import { DOMChange, ElementSnapshot } from '../contracts/types';
import { ElementSnapshotUtil } from './element-snapshot';

export class DOMObserver {
  private observer: MutationObserver;
  private changes: DOMChange[] = [];
  private isObserving = false;
  
  constructor() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => this.processMutation(mutation));
    });
  }
  
  start(targetNode: Node = document.body): void {
    if (this.isObserving) return;
    
    this.observer.observe(targetNode, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true
    });
    
    this.isObserving = true;
  }
  
  stop(): void {
    if (!this.isObserving) return;
    
    this.observer.disconnect();
    this.isObserving = false;
  }
  
  getChanges(): DOMChange[] {
    return [...this.changes];
  }
  
  clear(): void {
    this.changes = [];
  }
  
  private processMutation(mutation: MutationRecord): void {
    const timestamp = Date.now();
    const target = mutation.target as Element;
    
    if (!target) return;
    
    const change: DOMChange = {
      type: mutation.type as 'childList' | 'attributes' | 'characterData',
      timestamp,
      target: ElementSnapshotUtil.capture(target)
    };
    
    switch (mutation.type) {
      case 'attributes':
        change.attributeName = mutation.attributeName || undefined;
        change.oldValue = mutation.oldValue || undefined;
        change.newValue = target.getAttribute(mutation.attributeName!) || undefined;
        break;
        
      case 'characterData':
        change.oldValue = mutation.oldValue || undefined;
        change.newValue = target.textContent || undefined;
        break;
        
      case 'childList':
        if (mutation.addedNodes.length > 0) {
          change.addedNodes = Array.from(mutation.addedNodes)
            .filter(node => node.nodeType === Node.ELEMENT_NODE)
            .map(node => ElementSnapshotUtil.capture(node as Element));
        }
        
        if (mutation.removedNodes.length > 0) {
          change.removedNodes = Array.from(mutation.removedNodes)
            .filter(node => node.nodeType === Node.ELEMENT_NODE)
            .map(node => ElementSnapshotUtil.capture(node as Element));
        }
        break;
    }
    
    this.changes.push(change);
  }
  
  // 获取特定时间范围内的变化
  getChangesByTimeRange(startTime: number, endTime: number): DOMChange[] {
    return this.changes.filter(change => 
      change.timestamp >= startTime && change.timestamp <= endTime
    );
  }
  
  // 获取影响特定元素的变化
  getChangesByElement(elementSelector: string): DOMChange[] {
    return this.changes.filter(change => {
      const element = document.querySelector(elementSelector);
      return element && this.isElementAffected(change, element);
    });
  }
  
  private isElementAffected(change: DOMChange, element: Element): boolean {
    // 检查变化是否直接影响目标元素
    if (change.target.id === element.id || 
        change.target.className === element.className) {
      return true;
    }
    
    // 检查是否是子元素变化
    if (change.addedNodes || change.removedNodes) {
      const targetElement = this.findElementBySnapshot(change.target);
      if (targetElement && element.contains(targetElement)) {
        return true;
      }
    }
    
    return false;
  }
  
  private findElementBySnapshot(snapshot: ElementSnapshot): Element | null {
    // 尝试通过ID查找
    if (snapshot.id) {
      const element = document.getElementById(snapshot.id);
      if (element) return element;
    }
    
    // 尝试通过类名和标签名查找
    if (snapshot.className) {
      const elements = document.querySelectorAll(`${snapshot.tagName}.${snapshot.className.split(' ')[0]}`);
      return elements[0] || null;
    }
    
    return null;
  }
}