// 飞书拖拽监测契约定义

export interface DragEvent {
  type: 'dragstart' | 'dragover' | 'dragenter' | 'dragleave' | 'drop' | 'dragend';
  timestamp: number;
  target: ElementSnapshot;
  coordinates: { x: number; y: number };
  dataTransfer?: any;
}

export interface MouseEvent {
  type: 'mousedown' | 'mousemove' | 'mouseup';
  timestamp: number;
  target: ElementSnapshot;
  coordinates: { x: number; y: number };
  button: number;
}

export interface ElementSnapshot {
  tagName: string;
  className: string;
  id: string;
  dataset: Record<string, string>;
  computedStyles: Record<string, string>;
  boundingRect: DOMRect;
}

export interface DOMChange {
  type: 'childList' | 'attributes' | 'characterData';
  timestamp: number;
  target: ElementSnapshot;
  attributeName?: string;
  oldValue?: string;
  newValue?: string;
  addedNodes?: ElementSnapshot[];
  removedNodes?: ElementSnapshot[];
}

export interface NetworkRequest {
  timestamp: number;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
  response?: {
    status: number;
    headers: Record<string, string>;
    body?: any;
  };
}

export interface DragSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  events: (DragEvent | MouseEvent)[];
  domChanges: DOMChange[];
  networkRequests: NetworkRequest[];
  finalState?: {
    sourceElement: ElementSnapshot;
    targetElement: ElementSnapshot;
    operation: 'move' | 'copy' | 'link';
  };
}

export interface FeishuDragMonitor {
  start(): void;
  stop(): void;
  getCurrentSession(): DragSession | null;
  getAllSessions(): DragSession[];
  exportData(): string;
  clear(): void;
}