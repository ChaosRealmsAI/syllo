import { DragEvent as CustomDragEvent, MouseEvent as CustomMouseEvent } from '../contracts/types';
import { ElementSnapshotUtil } from './element-snapshot';

export class EventListener {
  private events: (CustomDragEvent | CustomMouseEvent)[] = [];
  private boundHandlers: Map<string, EventListenerOrEventListenerObject> = new Map();
  private isListening = false;
  
  start(): void {
    if (this.isListening) return;
    
    this.addDragEventListeners();
    this.addMouseEventListeners();
    this.addCustomEventListeners();
    this.isListening = true;
  }
  
  stop(): void {
    if (!this.isListening) return;
    
    this.removeDragEventListeners();
    this.removeMouseEventListeners();
    this.removeCustomEventListeners();
    this.isListening = false;
  }
  
  getEvents(): (CustomDragEvent | CustomMouseEvent)[] {
    return [...this.events];
  }
  
  clear(): void {
    this.events = [];
  }
  
  private addDragEventListeners(): void {
    const dragEvents = ['dragstart', 'dragover', 'dragenter', 'dragleave', 'drop', 'dragend'];
    
    dragEvents.forEach(eventType => {
      const handler = (event: Event) => this.handleDragEvent(event as DragEvent, eventType as any);
      this.boundHandlers.set(eventType, handler);
      document.addEventListener(eventType, handler, { capture: true });
    });
  }
  
  private removeDragEventListeners(): void {
    const dragEvents = ['dragstart', 'dragover', 'dragenter', 'dragleave', 'drop', 'dragend'];
    
    dragEvents.forEach(eventType => {
      const handler = this.boundHandlers.get(eventType);
      if (handler) {
        document.removeEventListener(eventType, handler, { capture: true });
        this.boundHandlers.delete(eventType);
      }
    });
  }
  
  private addMouseEventListeners(): void {
    const mouseEvents = ['mousedown', 'mousemove', 'mouseup'];
    
    mouseEvents.forEach(eventType => {
      const handler = (event: Event) => this.handleMouseEvent(event as MouseEvent, eventType as any);
      this.boundHandlers.set(eventType, handler);
      document.addEventListener(eventType, handler, { capture: true });
    });
  }
  
  private removeMouseEventListeners(): void {
    const mouseEvents = ['mousedown', 'mousemove', 'mouseup'];
    
    mouseEvents.forEach(eventType => {
      const handler = this.boundHandlers.get(eventType);
      if (handler) {
        document.removeEventListener(eventType, handler, { capture: true });
        this.boundHandlers.delete(eventType);
      }
    });
  }
  
  private addCustomEventListeners(): void {
    // 监听飞书可能触发的自定义事件
    const customEvents = [
      'feishu:drag:start',
      'feishu:drag:move', 
      'feishu:drag:end',
      'feishu:drop:success',
      'feishu:drop:cancel'
    ];
    
    customEvents.forEach(eventType => {
      const handler = (event: Event) => this.handleCustomEvent(event, eventType);
      this.boundHandlers.set(eventType, handler);
      document.addEventListener(eventType, handler, { capture: true });
    });
  }
  
  private removeCustomEventListeners(): void {
    const customEvents = [
      'feishu:drag:start',
      'feishu:drag:move',
      'feishu:drag:end', 
      'feishu:drop:success',
      'feishu:drop:cancel'
    ];
    
    customEvents.forEach(eventType => {
      const handler = this.boundHandlers.get(eventType);
      if (handler) {
        document.removeEventListener(eventType, handler, { capture: true });
        this.boundHandlers.delete(eventType);
      }
    });
  }
  
  private handleDragEvent(event: DragEvent, type: CustomDragEvent['type']): void {
    if (!event.target || !(event.target instanceof Element)) return;
    
    const customEvent: CustomDragEvent = {
      type,
      timestamp: Date.now(),
      target: ElementSnapshotUtil.capture(event.target),
      coordinates: { x: event.clientX, y: event.clientY },
      dataTransfer: this.serializeDataTransfer(event.dataTransfer)
    };
    
    this.events.push(customEvent);
    
    // 输出到控制台便于调试
    console.log(`[FeishuDragMonitor] ${type}:`, customEvent);
  }
  
  private handleMouseEvent(event: MouseEvent, type: CustomMouseEvent['type']): void {
    if (!event.target || !(event.target instanceof Element)) return;
    
    // 过滤鼠标移动事件，只记录与拖拽相关的
    if (type === 'mousemove' && !this.isDragRelated(event.target)) {
      return;
    }
    
    const customEvent: CustomMouseEvent = {
      type,
      timestamp: Date.now(),
      target: ElementSnapshotUtil.capture(event.target),
      coordinates: { x: event.clientX, y: event.clientY },
      button: event.button
    };
    
    this.events.push(customEvent);
    console.log(`[FeishuDragMonitor] ${type}:`, customEvent);
  }
  
  private handleCustomEvent(event: Event, type: string): void {
    if (!event.target || !(event.target instanceof Element)) return;
    
    const customEvent: CustomDragEvent = {
      type: type.split(':')[2] as CustomDragEvent['type'],
      timestamp: Date.now(),
      target: ElementSnapshotUtil.capture(event.target),
      coordinates: { x: 0, y: 0 }, // 自定义事件可能没有坐标
      dataTransfer: (event as any).detail || null
    };
    
    this.events.push(customEvent);
    console.log(`[FeishuDragMonitor] Custom Event ${type}:`, customEvent);
  }
  
  private serializeDataTransfer(dataTransfer: DataTransfer | null): any {
    if (!dataTransfer) return null;
    
    const result: any = {
      dropEffect: dataTransfer.dropEffect,
      effectAllowed: dataTransfer.effectAllowed,
      types: Array.from(dataTransfer.types),
      items: []
    };
    
    // 尝试读取数据（某些情况下可能受限制）
    try {
      dataTransfer.types.forEach(type => {
        try {
          result.items.push({
            type,
            data: dataTransfer.getData(type)
          });
        } catch (e) {
          result.items.push({
            type,
            data: '[Access Denied]'
          });
        }
      });
    } catch (e) {
      result.error = 'Cannot access dataTransfer items';
    }
    
    return result;
  }
  
  private isDragRelated(element: Element): boolean {
    // 检查元素是否与拖拽相关
    return (
      element.hasAttribute('draggable') ||
      element.classList.contains('drag-handle') ||
      element.classList.contains('draggable') ||
      element.closest('[draggable="true"]') !== null ||
      element.closest('.drag-handle') !== null ||
      element.getAttribute('role') === 'button' ||
      element.hasAttribute('data-drag-handle')
    );
  }
  
  // 获取特定时间范围的事件
  getEventsByTimeRange(startTime: number, endTime: number): (CustomDragEvent | CustomMouseEvent)[] {
    return this.events.filter(event => 
      event.timestamp >= startTime && event.timestamp <= endTime
    );
  }
  
  // 获取拖拽会话中的所有事件
  getDragSessionEvents(dragStartTime: number): (CustomDragEvent | CustomMouseEvent)[] {
    const sessionEvents = [];
    let inSession = false;
    
    for (const event of this.events) {
      if (event.timestamp < dragStartTime) continue;
      
      if (event.type === 'dragstart' || event.type === 'mousedown') {
        inSession = true;
      }
      
      if (inSession) {
        sessionEvents.push(event);
      }
      
      if (event.type === 'dragend' || event.type === 'drop' || event.type === 'mouseup') {
        break;
      }
    }
    
    return sessionEvents;
  }
}