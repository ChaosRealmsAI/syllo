/**
 * 飞书拖拽操作辅助工具类
 */
export class DragHelper {
  constructor(page) {
    this.page = page;
  }

  /**
   * 等待拖拽句柄出现
   * @param {Locator} element - 要悬停的元素
   * @param {number} timeout - 超时时间
   */
  async waitForDragHandle(element, timeout = 5000) {
    await element.hover();
    await this.page.waitForTimeout(300);
    
    // 等待拖拽句柄出现
    const dragHandle = this.page.locator('[class*="drag"], [data-testid*="drag"], img[src*="drag"]');
    try {
      await dragHandle.first().waitFor({ timeout });
      return dragHandle.first();
    } catch (error) {
      console.log('拖拽句柄未找到，使用原始元素');
      return element;
    }
  }

  /**
   * 执行平滑拖拽操作
   * @param {Locator} source - 源元素
   * @param {Locator} target - 目标元素
   * @param {Object} options - 选项
   */
  async smoothDrag(source, target, options = {}) {
    const {
      steps = 10,
      delay = 50,
      forceHover = true
    } = options;

    if (forceHover) {
      await source.hover();
      await this.page.waitForTimeout(300);
    }

    const sourceBoundingBox = await source.boundingBox();
    const targetBoundingBox = await target.boundingBox();

    if (!sourceBoundingBox || !targetBoundingBox) {
      throw new Error('无法获取元素边界框');
    }

    const sourceCenter = {
      x: sourceBoundingBox.x + sourceBoundingBox.width / 2,
      y: sourceBoundingBox.y + sourceBoundingBox.height / 2
    };

    const targetCenter = {
      x: targetBoundingBox.x + targetBoundingBox.width / 2,
      y: targetBoundingBox.y + targetBoundingBox.height / 2
    };

    // 开始拖拽
    await this.page.mouse.move(sourceCenter.x, sourceCenter.y);
    await this.page.mouse.down();

    // 分步移动到目标位置
    const deltaX = (targetCenter.x - sourceCenter.x) / steps;
    const deltaY = (targetCenter.y - sourceCenter.y) / steps;

    for (let i = 1; i <= steps; i++) {
      await this.page.mouse.move(
        sourceCenter.x + deltaX * i,
        sourceCenter.y + deltaY * i
      );
      await this.page.waitForTimeout(delay);
    }

    await this.page.mouse.up();
    await this.page.waitForTimeout(500);
  }

  /**
   * 使用HTML5 Drag API进行拖拽
   * @param {Locator} source - 源元素
   * @param {Locator} target - 目标元素
   */
  async html5Drag(source, target) {
    await source.hover();
    await this.page.waitForTimeout(300);

    await this.page.evaluate(async (sourceSelector, targetSelector) => {
      const sourceEl = document.querySelector(sourceSelector);
      const targetEl = document.querySelector(targetSelector);

      if (!sourceEl || !targetEl) {
        throw new Error('找不到源元素或目标元素');
      }

      // 创建拖拽事件
      const dragStartEvent = new DragEvent('dragstart', {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer()
      });

      const dragOverEvent = new DragEvent('dragover', {
        bubbles: true,
        cancelable: true,
        dataTransfer: dragStartEvent.dataTransfer
      });

      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer: dragStartEvent.dataTransfer
      });

      const dragEndEvent = new DragEvent('dragend', {
        bubbles: true,
        cancelable: true,
        dataTransfer: dragStartEvent.dataTransfer
      });

      // 执行拖拽序列
      sourceEl.dispatchEvent(dragStartEvent);
      targetEl.dispatchEvent(dragOverEvent);
      targetEl.dispatchEvent(dropEvent);
      sourceEl.dispatchEvent(dragEndEvent);

    }, await source.getAttribute('selector') || 'unknown', await target.getAttribute('selector') || 'unknown');
  }

  /**
   * 检测元素是否可拖拽
   * @param {Locator} element - 要检测的元素
   */
  async isDraggable(element) {
    await element.hover();
    await this.page.waitForTimeout(300);

    const isDraggable = await this.page.evaluate((el) => {
      const computedStyle = window.getComputedStyle(el);
      return el.draggable === true || 
             computedStyle.cursor.includes('grab') || 
             computedStyle.cursor.includes('move') ||
             el.getAttribute('draggable') === 'true';
    }, await element.elementHandle());

    const hasDragHandle = await this.page.locator('[class*="drag"], [data-testid*="drag"]').count() > 0;

    return isDraggable || hasDragHandle;
  }

  /**
   * 获取页面上所有可拖拽的元素
   */
  async getAllDraggableElements() {
    const draggableSelectors = [
      '[draggable="true"]',
      '[class*="draggable"]',
      '.ace-line',
      '.text-block',
      '.workspace-tree-view-node',
      '[data-node-level]'
    ];

    const elements = [];
    for (const selector of draggableSelectors) {
      const found = this.page.locator(selector);
      const count = await found.count();
      if (count > 0) {
        elements.push({ selector, locator: found, count });
      }
    }

    return elements;
  }

  /**
   * 验证拖拽操作的结果
   * @param {Locator} container - 容器元素
   * @param {Array} expectedOrder - 期望的顺序
   */
  async verifyDragResult(container, expectedOrder) {
    await this.page.waitForTimeout(1000); // 等待DOM更新

    const actualOrder = await container.locator('> *').allTextContents();
    
    console.log('期望顺序:', expectedOrder);
    console.log('实际顺序:', actualOrder);

    return actualOrder.every((text, index) => 
      expectedOrder[index] && text.includes(expectedOrder[index])
    );
  }

  /**
   * 截图用于调试
   * @param {string} name - 截图名称
   */
  async debugScreenshot(name) {
    await this.page.screenshot({ 
      path: `debug-${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }
}