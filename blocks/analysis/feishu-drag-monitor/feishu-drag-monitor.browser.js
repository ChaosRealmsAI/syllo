// 飞书拖拽监测器 - 浏览器注入版本
// 使用方法：在飞书页面的控制台中粘贴并执行此脚本

(function() {
  'use strict';

  // 检查是否已经注入
  if (window.feishuDragMonitor) {
    console.log('📋 飞书拖拽监测已在运行中');
    return window.feishuDragMonitor;
  }

  // 元素快照工具类
  class ElementSnapshotUtil {
    static capture(element) {
      const computedStyles = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      
      const relevantStyles = [
        'position', 'top', 'left', 'right', 'bottom',
        'width', 'height', 'transform', 'opacity',
        'z-index', 'display', 'visibility',
        'background-color', 'border', 'cursor',
        'transition', 'animation'
      ];
      
      const styles = {};
      relevantStyles.forEach(prop => {
        styles[prop] = computedStyles.getPropertyValue(prop);
      });
      
      const dataset = {};
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
          x: rect.x, y: rect.y,
          width: rect.width, height: rect.height,
          top: rect.top, right: rect.right,
          bottom: rect.bottom, left: rect.left
        }
      };
    }
    
    static findDragHandle(element) {
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
      
      if (element.getAttribute('draggable') === 'true') {
        return element;
      }
      
      return null;
    }
  }

  // 网络请求拦截器
  class NetworkInterceptor {
    constructor() {
      this.requests = [];
      this.originalFetch = window.fetch;
      this.originalXhrOpen = XMLHttpRequest.prototype.open;
      this.originalXhrSend = XMLHttpRequest.prototype.send;
    }
    
    start() {
      this.interceptFetch();
      this.interceptXHR();
    }
    
    stop() {
      window.fetch = this.originalFetch;
      XMLHttpRequest.prototype.open = this.originalXhrOpen;
      XMLHttpRequest.prototype.send = this.originalXhrSend;
    }
    
    getRequests() {
      return [...this.requests];
    }
    
    clear() {
      this.requests = [];
    }
    
    interceptFetch() {
      const self = this;
      window.fetch = async function(input, init) {
        const timestamp = Date.now();
        const url = input instanceof Request ? input.url : input.toString();
        const method = init?.method || 'GET';
        
        const request = {
          timestamp,
          method,
          url,
          headers: self.extractHeaders(init?.headers),
          body: init?.body
        };
        
        try {
          const response = await self.originalFetch(input, init);
          const clonedResponse = response.clone();
          
          request.response = {
            status: response.status,
            headers: self.extractResponseHeaders(response.headers),
            body: await self.safeGetResponseBody(clonedResponse)
          };
          
          self.requests.push(request);
          return response;
        } catch (error) {
          request.response = {
            status: 0,
            headers: {},
            body: { error: error.message }
          };
          self.requests.push(request);
          throw error;
        }
      };
    }
    
    interceptXHR() {
      const self = this;
      
      XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._interceptorData = {
          timestamp: Date.now(),
          method,
          url: url.toString(),
          headers: {}
        };
        return self.originalXhrOpen.apply(this, [method, url, ...args]);
      };
      
      XMLHttpRequest.prototype.send = function(body) {
        if (!this._interceptorData) return self.originalXhrSend.call(this, body);
        
        const request = {
          ...this._interceptorData,
          body
        };
        
        this.addEventListener('loadend', () => {
          request.response = {
            status: this.status,
            headers: self.parseResponseHeaders(this.getAllResponseHeaders()),
            body: this.responseText
          };
          self.requests.push(request);
        });
        
        return self.originalXhrSend.call(this, body);
      };
    }
    
    extractHeaders(headers) {
      if (!headers) return {};
      
      if (headers instanceof Headers) {
        const result = {};
        headers.forEach((value, key) => {
          result[key] = value;
        });
        return result;
      }
      
      if (Array.isArray(headers)) {
        const result = {};
        headers.forEach(([key, value]) => {
          result[key] = value;
        });
        return result;
      }
      
      return headers;
    }
    
    extractResponseHeaders(headers) {
      const result = {};
      headers.forEach((value, key) => {
        result[key] = value;
      });
      return result;
    }
    
    parseResponseHeaders(headerStr) {
      const headers = {};
      headerStr.split('\r\n').forEach(line => {
        const [key, value] = line.split(': ');
        if (key && value) {
          headers[key] = value;
        }
      });
      return headers;
    }
    
    async safeGetResponseBody(response) {
      try {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          return await response.json();
        } else if (contentType?.includes('text/')) {
          return await response.text();
        }
        return null;
      } catch {
        return null;
      }
    }
  }

  // DOM观察器
  class DOMObserver {
    constructor() {
      this.changes = [];
      this.isObserving = false;
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => this.processMutation(mutation));
      });
    }
    
    start(targetNode = document.body) {
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
    
    stop() {
      if (!this.isObserving) return;
      this.observer.disconnect();
      this.isObserving = false;
    }
    
    getChanges() {
      return [...this.changes];
    }
    
    clear() {
      this.changes = [];
    }
    
    processMutation(mutation) {
      const timestamp = Date.now();
      const target = mutation.target;
      
      if (!target) return;
      
      const change = {
        type: mutation.type,
        timestamp,
        target: ElementSnapshotUtil.capture(target)
      };
      
      switch (mutation.type) {
        case 'attributes':
          change.attributeName = mutation.attributeName || undefined;
          change.oldValue = mutation.oldValue || undefined;
          change.newValue = target.getAttribute(mutation.attributeName) || undefined;
          break;
          
        case 'characterData':
          change.oldValue = mutation.oldValue || undefined;
          change.newValue = target.textContent || undefined;
          break;
          
        case 'childList':
          if (mutation.addedNodes.length > 0) {
            change.addedNodes = Array.from(mutation.addedNodes)
              .filter(node => node.nodeType === Node.ELEMENT_NODE)
              .map(node => ElementSnapshotUtil.capture(node));
          }
          
          if (mutation.removedNodes.length > 0) {
            change.removedNodes = Array.from(mutation.removedNodes)
              .filter(node => node.nodeType === Node.ELEMENT_NODE)
              .map(node => ElementSnapshotUtil.capture(node));
          }
          break;
      }
      
      this.changes.push(change);
    }
    
    getChangesByTimeRange(startTime, endTime) {
      return this.changes.filter(change => 
        change.timestamp >= startTime && change.timestamp <= endTime
      );
    }
  }

  // 事件监听器
  class EventListener {
    constructor() {
      this.events = [];
      this.boundHandlers = new Map();
      this.isListening = false;
    }
    
    start() {
      if (this.isListening) return;
      
      this.addDragEventListeners();
      this.addMouseEventListeners();
      this.addCustomEventListeners();
      this.isListening = true;
    }
    
    stop() {
      if (!this.isListening) return;
      
      this.removeDragEventListeners();
      this.removeMouseEventListeners();
      this.removeCustomEventListeners();
      this.isListening = false;
    }
    
    getEvents() {
      return [...this.events];
    }
    
    clear() {
      this.events = [];
    }
    
    addDragEventListeners() {
      const dragEvents = ['dragstart', 'dragover', 'dragenter', 'dragleave', 'drop', 'dragend'];
      
      dragEvents.forEach(eventType => {
        const handler = (event) => this.handleDragEvent(event, eventType);
        this.boundHandlers.set(eventType, handler);
        document.addEventListener(eventType, handler, { capture: true });
      });
    }
    
    removeDragEventListeners() {
      const dragEvents = ['dragstart', 'dragover', 'dragenter', 'dragleave', 'drop', 'dragend'];
      
      dragEvents.forEach(eventType => {
        const handler = this.boundHandlers.get(eventType);
        if (handler) {
          document.removeEventListener(eventType, handler, { capture: true });
          this.boundHandlers.delete(eventType);
        }
      });
    }
    
    addMouseEventListeners() {
      const mouseEvents = ['mousedown', 'mousemove', 'mouseup'];
      
      mouseEvents.forEach(eventType => {
        const handler = (event) => this.handleMouseEvent(event, eventType);
        this.boundHandlers.set(eventType, handler);
        document.addEventListener(eventType, handler, { capture: true });
      });
    }
    
    removeMouseEventListeners() {
      const mouseEvents = ['mousedown', 'mousemove', 'mouseup'];
      
      mouseEvents.forEach(eventType => {
        const handler = this.boundHandlers.get(eventType);
        if (handler) {
          document.removeEventListener(eventType, handler, { capture: true });
          this.boundHandlers.delete(eventType);
        }
      });
    }
    
    addCustomEventListeners() {
      const customEvents = [
        'feishu:drag:start', 'feishu:drag:move', 'feishu:drag:end',
        'feishu:drop:success', 'feishu:drop:cancel'
      ];
      
      customEvents.forEach(eventType => {
        const handler = (event) => this.handleCustomEvent(event, eventType);
        this.boundHandlers.set(eventType, handler);
        document.addEventListener(eventType, handler, { capture: true });
      });
    }
    
    removeCustomEventListeners() {
      const customEvents = [
        'feishu:drag:start', 'feishu:drag:move', 'feishu:drag:end',
        'feishu:drop:success', 'feishu:drop:cancel'
      ];
      
      customEvents.forEach(eventType => {
        const handler = this.boundHandlers.get(eventType);
        if (handler) {
          document.removeEventListener(eventType, handler, { capture: true });
          this.boundHandlers.delete(eventType);
        }
      });
    }
    
    handleDragEvent(event, type) {
      if (!event.target || !(event.target instanceof Element)) return;
      
      const customEvent = {
        type,
        timestamp: Date.now(),
        target: ElementSnapshotUtil.capture(event.target),
        coordinates: { x: event.clientX, y: event.clientY },
        dataTransfer: this.serializeDataTransfer(event.dataTransfer)
      };
      
      this.events.push(customEvent);
      console.log(`[FeishuDragMonitor] ${type}:`, customEvent);
    }
    
    handleMouseEvent(event, type) {
      if (!event.target || !(event.target instanceof Element)) return;
      
      if (type === 'mousemove' && !this.isDragRelated(event.target)) {
        return;
      }
      
      const customEvent = {
        type,
        timestamp: Date.now(),
        target: ElementSnapshotUtil.capture(event.target),
        coordinates: { x: event.clientX, y: event.clientY },
        button: event.button
      };
      
      this.events.push(customEvent);
      console.log(`[FeishuDragMonitor] ${type}:`, customEvent);
    }
    
    handleCustomEvent(event, type) {
      if (!event.target || !(event.target instanceof Element)) return;
      
      const customEvent = {
        type: type.split(':')[2],
        timestamp: Date.now(),
        target: ElementSnapshotUtil.capture(event.target),
        coordinates: { x: 0, y: 0 },
        dataTransfer: event.detail || null
      };
      
      this.events.push(customEvent);
      console.log(`[FeishuDragMonitor] Custom Event ${type}:`, customEvent);
    }
    
    serializeDataTransfer(dataTransfer) {
      if (!dataTransfer) return null;
      
      const result = {
        dropEffect: dataTransfer.dropEffect,
        effectAllowed: dataTransfer.effectAllowed,
        types: Array.from(dataTransfer.types),
        items: []
      };
      
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
    
    isDragRelated(element) {
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
    
    getEventsByTimeRange(startTime, endTime) {
      return this.events.filter(event => 
        event.timestamp >= startTime && event.timestamp <= endTime
      );
    }
  }

  // 主监测器类
  class FeishuDragMonitor {
    constructor() {
      this.eventListener = new EventListener();
      this.domObserver = new DOMObserver();
      this.networkInterceptor = new NetworkInterceptor();
      this.sessions = [];
      this.currentSession = null;
      this.isActive = false;
      this.sessionIdCounter = 0;
    }
    
    start() {
      if (this.isActive) {
        console.warn('[FeishuDragMonitor] Already started');
        return;
      }
      
      console.log('[FeishuDragMonitor] Starting comprehensive drag monitoring...');
      
      this.eventListener.start();
      this.domObserver.start();
      this.networkInterceptor.start();
      
      this.isActive = true;
      this.setupSessionDetection();
      
      console.log('[FeishuDragMonitor] Monitoring started successfully');
      window.feishuDragMonitor = this;
    }
    
    stop() {
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
    
    getCurrentSession() {
      return this.currentSession;
    }
    
    getAllSessions() {
      return [...this.sessions];
    }
    
    exportData() {
      const data = {
        totalSessions: this.sessions.length,
        currentSession: this.currentSession,
        completedSessions: this.sessions,
        timestamp: new Date().toISOString(),
        summary: this.generateSummary()
      };
      
      return JSON.stringify(data, null, 2);
    }
    
    clear() {
      this.sessions = [];
      this.currentSession = null;
      this.sessionIdCounter = 0;
      
      this.eventListener.clear();
      this.domObserver.clear();
      this.networkInterceptor.clear();
      
      console.log('[FeishuDragMonitor] Data cleared');
    }
    
    setupSessionDetection() {
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
    
    startNewSession(startTime) {
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
    
    updateCurrentSession() {
      if (!this.currentSession) return;
      
      const sessionStartTime = this.currentSession.startTime;
      const now = Date.now();
      
      this.currentSession.events = this.eventListener.getEventsByTimeRange(sessionStartTime, now);
      this.currentSession.domChanges = this.domObserver.getChangesByTimeRange(sessionStartTime, now);
      this.currentSession.networkRequests = this.networkInterceptor.getRequests()
        .filter(req => req.timestamp >= sessionStartTime && req.timestamp <= now);
    }
    
    checkSessionEnd() {
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
      
      const lastEventTime = Math.max(
        ...this.currentSession.events.map(e => e.timestamp),
        this.currentSession.startTime
      );
      
      if (Date.now() - lastEventTime > 5000) {
        console.log('[FeishuDragMonitor] Session timeout, ending session');
        this.endCurrentSession();
      }
    }
    
    endCurrentSession() {
      if (!this.currentSession) return;
      
      this.currentSession.endTime = Date.now();
      this.analyzeFinalState();
      this.sessions.push({ ...this.currentSession });
      
      console.log(`[FeishuDragMonitor] Session ended: ${this.currentSession.sessionId}`);
      console.log(`[FeishuDragMonitor] Session duration: ${this.currentSession.endTime - this.currentSession.startTime}ms`);
      console.log(`[FeishuDragMonitor] Events captured: ${this.currentSession.events.length}`);
      console.log(`[FeishuDragMonitor] DOM changes: ${this.currentSession.domChanges.length}`);
      console.log(`[FeishuDragMonitor] Network requests: ${this.currentSession.networkRequests.length}`);
      
      this.currentSession = null;
    }
    
    analyzeFinalState() {
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
    
    determineOperation(startEvent, endEvent) {
      if (startEvent.dataTransfer?.effectAllowed) {
        return startEvent.dataTransfer.effectAllowed;
      }
      return 'move';
    }
    
    isDragInitiation(event) {
      return event.target && (
        event.target.hasAttribute?.('draggable') ||
        ElementSnapshotUtil.findDragHandle(event.target) !== null
      );
    }
    
    isDragEnd(event) {
      return this.currentSession !== null;
    }
    
    generateSummary() {
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
    
    // 调试方法
    printCurrentSession() {
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
    
    printAllSessions() {
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
    
    downloadData() {
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

  // 创建并启动监测器
  const monitor = new FeishuDragMonitor();
  monitor.start();
  
  // 绑定到全局
  window.feishuDragMonitor = monitor;
  
  // 输出使用说明
  console.log('='.repeat(60));
  console.log('🎯 飞书拖拽监测器已启动！');
  console.log('='.repeat(60));
  console.log('📋 使用方法：');
  console.log('• window.feishuDragMonitor.printCurrentSession() - 查看当前会话');
  console.log('• window.feishuDragMonitor.printAllSessions() - 查看所有会话');
  console.log('• window.feishuDragMonitor.exportData() - 导出数据');
  console.log('• window.feishuDragMonitor.downloadData() - 下载数据');
  console.log('• window.feishuDragMonitor.clear() - 清除数据');
  console.log('• window.feishuDragMonitor.stop() - 停止监测');
  console.log('='.repeat(60));
  console.log('🔥 开始操作飞书拖拽功能，所有操作将被记录！');
  
  return monitor;
})();