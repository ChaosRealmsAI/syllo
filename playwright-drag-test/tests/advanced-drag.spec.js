import { test, expect } from '@playwright/test';
import { DragHelper } from './utils/drag-helper.js';

test.describe('飞书高级拖拽测试', () => {
  let dragHelper;
  
  test.beforeEach(async ({ page }) => {
    dragHelper = new DragHelper(page);
    
    // 导航到飞书文档页面
    await page.goto('https://yqpgaaarht3.feishu.cn/wiki/LOBbw5AMTiG3CIkpclacK0tHnlh');
    await page.waitForLoadState('networkidle');
    
    // 切换到编辑模式
    try {
      const editButton = page.getByRole('button', { name: /编辑/ });
      await editButton.click();
      await page.waitForTimeout(1000);
    } catch (error) {
      console.log('编辑按钮点击失败，可能已经在编辑模式');
    }
  });

  test('检测页面上所有可拖拽元素', async ({ page }) => {
    const draggableElements = await dragHelper.getAllDraggableElements();
    
    console.log('找到的可拖拽元素:');
    for (const element of draggableElements) {
      console.log(`- ${element.selector}: ${element.count}个元素`);
    }
    
    expect(draggableElements.length).toBeGreaterThan(0);
    await dragHelper.debugScreenshot('draggable-elements');
  });

  test('测试文本块的拖拽能力检测', async ({ page }) => {
    const textBlocks = page.locator('.ace-line, .text-block');
    const count = await textBlocks.count();
    
    if (count > 0) {
      const firstBlock = textBlocks.first();
      const isDraggable = await dragHelper.isDraggable(firstBlock);
      
      console.log(`第一个文本块是否可拖拽: ${isDraggable}`);
      expect(isDraggable).toBe(true);
    }
  });

  test('使用平滑拖拽移动文本块', async ({ page }) => {
    const textBlocks = page.locator('.ace-line, .text-block');
    const count = await textBlocks.count();
    
    if (count >= 2) {
      const sourceBlock = textBlocks.nth(0);
      const targetBlock = textBlocks.nth(1);
      
      // 获取拖拽前的内容
      const sourceText = await sourceBlock.textContent();
      const targetText = await targetBlock.textContent();
      
      console.log('拖拽前:', { source: sourceText, target: targetText });
      
      try {
        await dragHelper.smoothDrag(sourceBlock, targetBlock, {
          steps: 15,
          delay: 30
        });
        
        await page.waitForTimeout(2000);
        
        // 验证是否有变化
        const newSourceText = await textBlocks.nth(0).textContent();
        const newTargetText = await textBlocks.nth(1).textContent();
        
        console.log('拖拽后:', { source: newSourceText, target: newTargetText });
        
        await dragHelper.debugScreenshot('after-smooth-drag');
        
      } catch (error) {
        console.log('平滑拖拽失败:', error.message);
        await dragHelper.debugScreenshot('smooth-drag-error');
      }
    }
  });

  test('使用HTML5拖拽API', async ({ page }) => {
    const textBlocks = page.locator('.ace-line, .text-block');
    const count = await textBlocks.count();
    
    if (count >= 2) {
      const sourceBlock = textBlocks.nth(0);
      const targetBlock = textBlocks.nth(1);
      
      try {
        await dragHelper.html5Drag(sourceBlock, targetBlock);
        await page.waitForTimeout(2000);
        
        console.log('HTML5拖拽完成');
        await dragHelper.debugScreenshot('after-html5-drag');
        
      } catch (error) {
        console.log('HTML5拖拽失败:', error.message);
      }
    }
  });

  test('测试拖拽句柄的交互', async ({ page }) => {
    const textBlocks = page.locator('.ace-line, .text-block');
    const count = await textBlocks.count();
    
    if (count > 0) {
      const firstBlock = textBlocks.first();
      
      try {
        const dragHandle = await dragHelper.waitForDragHandle(firstBlock);
        
        // 检查拖拽句柄是否可见
        const isVisible = await dragHandle.isVisible();
        console.log(`拖拽句柄是否可见: ${isVisible}`);
        
        if (isVisible) {
          // 尝试点击拖拽句柄
          await dragHandle.click();
          await page.waitForTimeout(500);
          
          await dragHelper.debugScreenshot('drag-handle-clicked');
        }
        
      } catch (error) {
        console.log('拖拽句柄交互失败:', error.message);
      }
    }
  });

  test('综合拖拽测试 - 多种方法尝试', async ({ page }) => {
    const textBlocks = page.locator('.ace-line, .text-block');
    const count = await textBlocks.count();
    
    if (count >= 2) {
      const sourceBlock = textBlocks.nth(0);
      const targetBlock = textBlocks.nth(1);
      
      // 获取初始状态
      const initialOrder = await textBlocks.allTextContents();
      console.log('初始顺序:', initialOrder);
      
      const methods = [
        {
          name: '标准Playwright拖拽',
          action: async () => await sourceBlock.dragTo(targetBlock, { force: true })
        },
        {
          name: '平滑鼠标拖拽',
          action: async () => await dragHelper.smoothDrag(sourceBlock, targetBlock)
        },
        {
          name: 'HTML5拖拽',
          action: async () => await dragHelper.html5Drag(sourceBlock, targetBlock)
        }
      ];
      
      for (const method of methods) {
        console.log(`\n尝试方法: ${method.name}`);
        
        try {
          await method.action();
          await page.waitForTimeout(2000);
          
          const newOrder = await textBlocks.allTextContents();
          console.log('新顺序:', newOrder);
          
          const orderChanged = JSON.stringify(initialOrder) !== JSON.stringify(newOrder);
          console.log(`顺序是否改变: ${orderChanged}`);
          
          if (orderChanged) {
            console.log(`✅ ${method.name} 成功!`);
            await dragHelper.debugScreenshot(`success-${method.name.toLowerCase().replace(/\s+/g, '-')}`);
            break;
          }
          
        } catch (error) {
          console.log(`❌ ${method.name} 失败:`, error.message);
        }
        
        await page.waitForTimeout(1000);
      }
    }
  });

  test('模拟复杂的拖拽场景', async ({ page }) => {
    // 模拟用户真实的拖拽行为
    const textBlocks = page.locator('.ace-line, .text-block');
    const count = await textBlocks.count();
    
    if (count >= 2) {
      const sourceBlock = textBlocks.nth(0);
      const targetBlock = textBlocks.nth(1);
      
      const sourceBoundingBox = await sourceBlock.boundingBox();
      const targetBoundingBox = await targetBlock.boundingBox();
      
      if (sourceBoundingBox && targetBoundingBox) {
        // 模拟真实用户行为: 先hover，然后按下，慢慢移动，最后释放
        console.log('开始复杂拖拽场景...');
        
        // 1. 悬停显示拖拽句柄
        await page.mouse.move(
          sourceBoundingBox.x + 10, // 移动到元素左边缘，那里通常有拖拽句柄
          sourceBoundingBox.y + sourceBoundingBox.height / 2
        );
        await page.waitForTimeout(800); // 等待拖拽句柄出现
        
        // 2. 按下鼠标，模拟开始拖拽
        await page.mouse.down();
        await page.waitForTimeout(200);
        
        // 3. 小幅移动，触发拖拽开始
        await page.mouse.move(
          sourceBoundingBox.x + 15,
          sourceBoundingBox.y + sourceBoundingBox.height / 2
        );
        await page.waitForTimeout(100);
        
        // 4. 慢慢移动到目标位置
        const steps = 20;
        const deltaX = (targetBoundingBox.x - sourceBoundingBox.x) / steps;
        const deltaY = (targetBoundingBox.y - sourceBoundingBox.y) / steps;
        
        for (let i = 1; i <= steps; i++) {
          await page.mouse.move(
            sourceBoundingBox.x + deltaX * i,
            sourceBoundingBox.y + deltaY * i + sourceBoundingBox.height / 2
          );
          await page.waitForTimeout(25); // 很慢的移动
        }
        
        // 5. 在目标上悬停一下
        await page.waitForTimeout(300);
        
        // 6. 释放鼠标
        await page.mouse.up();
        await page.waitForTimeout(1000);
        
        console.log('复杂拖拽场景完成');
        await dragHelper.debugScreenshot('complex-drag-completed');
      }
    }
  });
});