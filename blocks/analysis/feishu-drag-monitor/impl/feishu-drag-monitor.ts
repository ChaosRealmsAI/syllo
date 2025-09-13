import { FeishuDragMonitor, DragSession } from '../contracts/types';
import { EventListener } from './event-listener';
import { DOMObserver } from './dom-observer';
import { NetworkInterceptor } from './network-interceptor';
import { ElementSnapshotUtil } from './element-snapshot';

export class FeishuDragMonitorImpl implements FeishuDragMonitor {
  private eventListener: EventListener;
  private domObserver: DOMObserver;
  private networkInterceptor: NetworkInterceptor;
  private sessions: DragSession[] = [];
  private currentSession: DragSession | null = null;
  private isActive = false;
  private sessionIdCounter = 0;
  
  constructor() {
    this.eventListener = new EventListener();
    this.domObserver = new DOMObserver();
    this.networkInterceptor = new NetworkInterceptor();
  }
  
  start(): void {
    if (this.isActive) {
      console.warn('[FeishuDragMonitor] Already started');
      return;
    }
    
    console.log('[FeishuDragMonitor] Starting comprehensive drag monitoring...');
    
    this.eventListener.start();
    this.domObserver.start();
    this.networkInterceptor.start();
    
    this.isActive = true;
    
    // 监听拖拽开始事件
    this.setupSessionDetection();
    
    console.log('[FeishuDragMonitor] Monitoring started successfully');
    console.log('[FeishuDragMonitor] Use window.feishuDragMonitor to access the monitor instance');
    
    // 将实例绑定到全局对象以便调试
    (window as any).feishuDragMonitor = this;
  }
  
  stop(): void {
    if (!this.isActive) {
      console.warn('[FeishuDragMonitor] Not currently active');
      return;
    }
    
    console.log('[FeishuDragMonitor] Stopping monitoring...');
    
    this.eventListener.stop();
    this.domObserver.stop();
    this.networkInterceptor.stop();
    
    if (this.currentSession) {
      this.endCurrentSession();
    }
    
    this.isActive = false;
    console.log('[FeishuDragMonitor] Monitoring stopped');
  }
  
  getCurrentSession(): DragSession | null {
    return this.currentSession;
  }
  
  getAllSessions(): DragSession[] {
    return [...this.sessions];
  }
  
  exportData(): string {
    const data = {
      totalSessions: this.sessions.length,
      currentSession: this.currentSession,
      completedSessions: this.sessions,
      timestamp: new Date().toISOString(),
      summary: this.generateSummary()
    };
    
    return JSON.stringify(data, null, 2);
  }
  
  clear(): void {
    this.sessions = [];
    this.currentSession = null;
    this.sessionIdCounter = 0;
    
    this.eventListener.clear();
    this.domObserver.clear();
    this.networkInterceptor.clear();
    
    console.log('[FeishuDragMonitor] Data cleared');
  }
  
  private setupSessionDetection(): void {
    // 定期检查是否有新的拖拽会话
    setInterval(() => {
      if (!this.isActive) return;
      
      const recentEvents = this.eventListener.getEvents().slice(-10);
      const dragStartEvent = recentEvents.find(event => 
        event.type === 'dragstart' || 
        (event.type === 'mousedown' && this.isDragInitiation(event))
      );
      
      if (dragStartEvent && !this.currentSession) {
        this.startNewSession(dragStartEvent.timestamp);
      }
      
      if (this.currentSession) {
        this.updateCurrentSession();
        this.checkSessionEnd();
      }
    }, 100);
  }
  
  private startNewSession(startTime: number): void {
    const sessionId = `session_${++this.sessionIdCounter}_${Date.now()}`;
    
    this.currentSession = {
      sessionId,
      startTime,
      events: [],
      domChanges: [],
      networkRequests: []
    };
    
    console.log(`[FeishuDragMonitor] New drag session started: ${sessionId}`);
  }
  
  private updateCurrentSession(): void {
    if (!this.currentSession) return;
    
    const sessionStartTime = this.currentSession.startTime;
    const now = Date.now();
    
    // 获取会话期间的所有数据
    this.currentSession.events = this.eventListener.getEventsByTimeRange(sessionStartTime, now);
    this.currentSession.domChanges = this.domObserver.getChangesByTimeRange(sessionStartTime, now);
    this.currentSession.networkRequests = this.networkInterceptor.getRequests()
      .filter(req => req.timestamp >= sessionStartTime && req.timestamp <= now);
  }
  
  private checkSessionEnd(): void {
    if (!this.currentSession) return;
    
    const recentEvents = this.currentSession.events.slice(-5);
    const hasEndEvent = recentEvents.some(event => 
      event.type === 'dragend' || 
      event.type === 'drop' || 
      (event.type === 'mouseup' && this.isDragEnd(event))
    );
    
    if (hasEndEvent) {
      this.endCurrentSession();
    }
    
    // 超时检测（5秒无活动则认为会话结束）
    const lastEventTime = Math.max(
      ...this.currentSession.events.map(e => e.timestamp),
      this.currentSession.startTime
    );
    
    if (Date.now() - lastEventTime > 5000) {
      console.log('[FeishuDragMonitor] Session timeout, ending session');
      this.endCurrentSession();
    }
  }
  
  private endCurrentSession(): void {
    if (!this.currentSession) return;
    
    this.currentSession.endTime = Date.now();
    
    // 分析最终状态
    this.analyzeFinalState();
    
    // 保存会话
    this.sessions.push({ ...this.currentSession });
    
    console.log(`[FeishuDragMonitor] Session ended: ${this.currentSession.sessionId}`);
    console.log(`[FeishuDragMonitor] Session duration: ${this.currentSession.endTime - this.currentSession.startTime}ms`);
    console.log(`[FeishuDragMonitor] Events captured: ${this.currentSession.events.length}`);
    console.log(`[FeishuDragMonitor] DOM changes: ${this.currentSession.domChanges.length}`);
    console.log(`[FeishuDragMonitor] Network requests: ${this.currentSession.networkRequests.length}`);
    
    this.currentSession = null;
  }
  
  private analyzeFinalState(): void {
    if (!this.currentSession) return;
    
    const dragEvents = this.currentSession.events.filter(e => e.type.startsWith('drag'));
    const dropEvent = dragEvents.find(e => e.type === 'drop');
    
    if (dropEvent) {
      const dragStartEvent = dragEvents.find(e => e.type === 'dragstart');
      
      if (dragStartEvent) {
        this.currentSession.finalState = {
          sourceElement: dragStartEvent.target,
          targetElement: dropEvent.target,
          operation: this.determineOperation(dragStartEvent, dropEvent)
        };
      }
    }
  }
  
  private determineOperation(startEvent: any, endEvent: any): 'move' | 'copy' | 'link' {
    // 基于数据传输或其他线索判断操作类型
    if (startEvent.dataTransfer?.effectAllowed) {
      return startEvent.dataTransfer.effectAllowed as 'move' | 'copy' | 'link';
    }
    return 'move'; // 默认
  }
  
  private isDragInitiation(event: any): boolean {
    // 检查鼠标按下事件是否可能是拖拽开始
    return event.target && (
      event.target.hasAttribute?.('draggable') ||
      ElementSnapshotUtil.findDragHandle(event.target) !== null
    );
  }
  
  private isDragEnd(event: any): boolean {
    // 检查鼠标释放是否是拖拽结束
    return this.currentSession !== null;
  }
  
  private generateSummary(): any {
    const totalEvents = this.sessions.reduce((sum, session) => sum + session.events.length, 0);
    const totalDomChanges = this.sessions.reduce((sum, session) => sum + session.domChanges.length, 0);
    const totalNetworkRequests = this.sessions.reduce((sum, session) => sum + session.networkRequests.length, 0);
    
    const avgSessionDuration = this.sessions.length > 0 ? 
      this.sessions.reduce((sum, session) => sum + ((session.endTime || Date.now()) - session.startTime), 0) / this.sessions.length : 0;
    
    return {
      totalSessions: this.sessions.length,
      totalEvents,
      totalDomChanges,
      totalNetworkRequests,
      avgSessionDuration,
      isCurrentlyActive: this.isActive,
      hasActiveSession: this.currentSession !== null
    };
  }
  
  // 调试和分析方法
  printCurrentSession(): void {
    if (!this.currentSession) {
      console.log('[FeishuDragMonitor] No active session');
      return;
    }
    
    console.group(`[FeishuDragMonitor] Current Session: ${this.currentSession.sessionId}`);
    console.log('Events:', this.currentSession.events);
    console.log('DOM Changes:', this.currentSession.domChanges);
    console.log('Network Requests:', this.currentSession.networkRequests);
    console.groupEnd();
  }
  
  printAllSessions(): void {
    console.group('[FeishuDragMonitor] All Sessions');
    this.sessions.forEach(session => {
      console.group(`Session: ${session.sessionId}`);
      console.log('Duration:', (session.endTime || Date.now()) - session.startTime + 'ms');
      console.log('Events:', session.events.length);
      console.log('DOM Changes:', session.domChanges.length);
      console.log('Network Requests:', session.networkRequests.length);
      console.log('Final State:', session.finalState);
      console.groupEnd();
    });
    console.groupEnd();
  }
  
  downloadData(): void {
    const data = this.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feishu-drag-analysis-${new Date().toISOString().slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    console.log('[FeishuDragMonitor] Data downloaded');
  }
}