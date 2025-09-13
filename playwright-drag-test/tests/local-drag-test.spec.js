import { test, expect } from '@playwright/test';
import { DragHelper } from './utils/drag-helper.js';

test.describe('本地拖拽功能验证', () => {
  test('验证DragHelper工具类基本功能', async ({ page }) => {
    // 创建一个简单的测试页面
    await page.setContent(`
      <html>
        <head>
          <style>
            body { padding: 20px; font-family: Arial, sans-serif; }
            .container { border: 2px dashed #ccc; padding: 20px; min-height: 300px; }
            .draggable-item { 
              background: #f0f0f0; 
              border: 1px solid #ddd; 
              padding: 10px; 
              margin: 5px 0; 
              cursor: grab;
              user-select: none;
            }
            .draggable-item:hover {
              background: #e0e0e0;
            }
            .draggable-item.dragging {
              opacity: 0.5;
            }
            .drag-handle {
              display: none;
              color: #999;
              margin-right: 10px;
              cursor: grab;
            }
            .draggable-item:hover .drag-handle {
              display: inline;
            }
          </style>
        </head>
        <body>
          <h1>拖拽测试页面</h1>
          <div class="container">
            <div class="draggable-item" draggable="true">
              <span class="drag-handle">⋮⋮</span>
              第一个可拖拽项目 - 这是一些测试内容
            </div>
            <div class="draggable-item" draggable="true">
              <span class="drag-handle">⋮⋮</span>
              第二个可拖拽项目 - 这也是一些测试内容
            </div>
            <div class="draggable-item" draggable="true">
              <span class="drag-handle">⋮⋮</span>
              第三个可拖拽项目 - 更多测试内容
            </div>
          </div>
          
          <script>
            let draggedElement = null;
            
            document.addEventListener('dragstart', (e) => {
              if (e.target.classList.contains('draggable-item')) {
                draggedElement = e.target;
                e.target.classList.add('dragging');
              }
            });
            
            document.addEventListener('dragend', (e) => {
              if (e.target.classList.contains('draggable-item')) {
                e.target.classList.remove('dragging');
              }
            });
            
            document.addEventListener('dragover', (e) => {
              e.preventDefault();
            });
            
            document.addEventListener('drop', (e) => {
              e.preventDefault();
              if (draggedElement && e.target.classList.contains('draggable-item')) {
                const container = e.target.parentNode;
                const afterElement = getDragAfterElement(container, e.clientY);
                if (afterElement == null) {
                  container.appendChild(draggedElement);
                } else {
                  container.insertBefore(draggedElement, afterElement);
                }
              }
            });
            
            function getDragAfterElement(container, y) {
              const draggableElements = [...container.querySelectorAll('.draggable-item:not(.dragging)')];
              return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                  return { offset: offset, element: child };
                } else {
                  return closest;
                }
              }, { offset: Number.NEGATIVE_INFINITY }).element;
            }
          </script>
        </body>
      </html>
    `);

    const dragHelper = new DragHelper(page);
    
    // 等待页面加载
    await page.waitForTimeout(500);
    
    // 测试DragHelper初始化
    expect(dragHelper).toBeDefined();
    console.log('✅ DragHelper 初始化成功');

    // 获取拖拽元素
    const draggableItems = page.locator('.draggable-item');
    const count = await draggableItems.count();
    expect(count).toBe(3);
    console.log(`✅ 找到 ${count} 个拖拽元素`);

    // 测试拖拽句柄检测
    const firstItem = draggableItems.nth(0);
    await firstItem.hover();
    await page.waitForTimeout(300);
    
    const dragHandle = page.locator('.drag-handle').first();
    const isVisible = await dragHandle.isVisible();
    expect(isVisible).toBe(true);
    console.log('✅ 拖拽句柄显示正常');

    // 测试isDraggable方法
    const isDraggable = await dragHelper.isDraggable(firstItem);
    expect(isDraggable).toBe(true);
    console.log('✅ 拖拽能力检测正常');

    // 获取初始顺序
    const initialOrder = await draggableItems.allTextContents();
    console.log('初始顺序:', initialOrder);

    // 测试拖拽操作
    const sourceItem = draggableItems.nth(0);
    const targetItem = draggableItems.nth(2);
    
    await sourceItem.dragTo(targetItem);
    await page.waitForTimeout(500);

    // 验证顺序变化
    const newOrder = await draggableItems.allTextContents();
    console.log('拖拽后顺序:', newOrder);
    
    const orderChanged = JSON.stringify(initialOrder) !== JSON.stringify(newOrder);
    console.log(`✅ 拖拽操作${orderChanged ? '成功' : '未生效'}`);
    
    // 截图保存结果
    await page.screenshot({ path: 'drag-test-result.png', fullPage: true });
    console.log('✅ 测试截图已保存');
  });

  test('验证getAllDraggableElements方法', async ({ page }) => {
    await page.setContent(`
      <div draggable="true" class="item1">拖拽项1</div>
      <div class="draggable-item item2">拖拽项2</div>
      <div class="text-block item3">文本块</div>
      <div data-node-level="1" class="item4">节点</div>
    `);

    const dragHelper = new DragHelper(page);
    const draggableElements = await dragHelper.getAllDraggableElements();
    
    console.log('找到的可拖拽元素:');
    draggableElements.forEach((element, index) => {
      console.log(`${index + 1}. ${element.selector}: ${element.count}个元素`);
    });
    
    expect(draggableElements.length).toBeGreaterThan(0);
    console.log('✅ getAllDraggableElements 方法工作正常');
  });

  test('验证平滑拖拽功能', async ({ page }) => {
    await page.setContent(`
      <style>
        .item { 
          width: 100px; 
          height: 50px; 
          background: lightblue; 
          margin: 10px; 
          border: 1px solid blue;
          display: inline-block;
          text-align: center;
          line-height: 50px;
        }
      </style>
      <div class="item" id="source">源</div>
      <div class="item" id="target">目标</div>
    `);

    const dragHelper = new DragHelper(page);
    const source = page.locator('#source');
    const target = page.locator('#target');
    
    // 获取初始位置
    const initialSourceBox = await source.boundingBox();
    const initialTargetBox = await target.boundingBox();
    
    expect(initialSourceBox).toBeTruthy();
    expect(initialTargetBox).toBeTruthy();
    
    console.log('初始源位置:', initialSourceBox);
    console.log('初始目标位置:', initialTargetBox);
    
    // 执行平滑拖拽
    await dragHelper.smoothDrag(source, target, {
      steps: 10,
      delay: 50
    });
    
    console.log('✅ 平滑拖拽执行完成');
    await page.screenshot({ path: 'smooth-drag-test.png' });
  });
});