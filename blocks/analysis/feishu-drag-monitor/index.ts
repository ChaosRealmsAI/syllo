// 飞书拖拽监测积木统一导出

export * from './contracts/types';
export { FeishuDragMonitorImpl } from './impl/feishu-drag-monitor';
export { ElementSnapshotUtil } from './impl/element-snapshot';

// 便捷创建函数
import { FeishuDragMonitorImpl } from './impl/feishu-drag-monitor';

export function createFeishuDragMonitor(): FeishuDragMonitorImpl {
  return new FeishuDragMonitorImpl();
}

// 一键启动监测的全局函数
export function startFeishuDragMonitoring(): FeishuDragMonitorImpl {
  const monitor = createFeishuDragMonitor();
  monitor.start();
  return monitor;
}

// 注入到浏览器控制台的快捷脚本
export const BROWSER_INJECTION_SCRIPT = `
// === 飞书拖拽监测脚本 ===
(function() {
  // 检查是否已经注入
  if (window.feishuDragMonitor) {
    console.log('飞书拖拽监测已在运行中');
    return window.feishuDragMonitor;
  }

  ${getInlineScript()}

  // 创建并启动监测器
  const monitor = createFeishuDragMonitor();
  monitor.start();
  
  // 绑定到全局
  window.feishuDragMonitor = monitor;
  
  // 添加便捷方法到控制台
  console.log('='.repeat(50));
  console.log('🎯 飞书拖拽监测已启动！');
  console.log('='.repeat(50));
  console.log('使用方法：');
  console.log('• window.feishuDragMonitor.printCurrentSession() - 查看当前会话');
  console.log('• window.feishuDragMonitor.printAllSessions() - 查看所有会话');
  console.log('• window.feishuDragMonitor.exportData() - 导出数据');
  console.log('• window.feishuDragMonitor.downloadData() - 下载数据');
  console.log('• window.feishuDragMonitor.clear() - 清除数据');
  console.log('• window.feishuDragMonitor.stop() - 停止监测');
  console.log('='.repeat(50));
  
  return monitor;
})();
`;

// 获取内联脚本内容（所有代码打包到一个字符串中）
function getInlineScript(): string {
  // 这里返回所有实现代码的字符串版本
  // 由于篇幅原因，这里用占位符表示
  return `
    // 这里会包含所有实现代码的内联版本
    // ElementSnapshotUtil, EventListener, DOMObserver, NetworkInterceptor, FeishuDragMonitorImpl
    // 实际使用时需要将这些类的代码内联进来
    console.log('Monitor implementation loaded');
  `;
}