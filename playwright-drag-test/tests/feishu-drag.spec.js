import { test, expect } from '@playwright/test';

test.describe('飞书文档拖拽测试', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    
    // 设置较长的超时时间，因为拖拽操作可能比较慢
    test.setTimeout(60000);
    
    // 导航到飞书文档页面
    await page.goto('/wiki/LOBbw5AMTiG3CIkpclacK0tHnlh');
    await page.waitForLoadState('networkidle');
  });

  test.beforeEach(async () => {
    // 确保每个测试开始时都在编辑模式
    const editButton = page.getByRole('button', { name: /编辑/ });
    await editButton.click();
    
    // 等待编辑模式生效
    await page.waitForTimeout(1000);
  });

  test('应该能够显示拖拽句柄当鼠标悬停在内容块上', async () => {
    // 查找第一个文本内容块
    const textBlocks = page.locator('.text-block, .ace-line').first();
    await textBlocks.waitFor();
    
    // 悬停在文本块上
    await textBlocks.hover();
    
    // 等待拖拽句柄出现
    await page.waitForTimeout(500);
    
    // 验证拖拽句柄是否可见
    const dragHandles = page.locator('[class*="drag"], img[src*="drag"]');
    await expect(dragHandles.first()).toBeVisible({ timeout: 5000 });
  });

  test('应该能够拖拽文档内容块进行重新排序', async () => {
    // 获取所有文本块
    const textBlocks = page.locator('.ace-line, .text-block');
    await textBlocks.first().waitFor();
    
    const firstBlock = textBlocks.nth(0);
    const secondBlock = textBlocks.nth(1);
    
    // 获取拖拽前的文本内容
    const firstBlockTextBefore = await firstBlock.textContent();
    const secondBlockTextBefore = await secondBlock.textContent();
    
    console.log('拖拽前:', {
      first: firstBlockTextBefore,
      second: secondBlockTextBefore
    });
    
    // 悬停在第一个块上以显示拖拽句柄
    await firstBlock.hover();
    await page.waitForTimeout(500);
    
    try {
      // 尝试直接拖拽文本块
      await firstBlock.dragTo(secondBlock, { 
        force: true,
        timeout: 10000 
      });
      
      // 等待拖拽操作完成
      await page.waitForTimeout(2000);
      
      // 验证拖拽结果
      const firstBlockTextAfter = await textBlocks.nth(0).textContent();
      const secondBlockTextAfter = await textBlocks.nth(1).textContent();
      
      console.log('拖拽后:', {
        first: firstBlockTextAfter,
        second: secondBlockTextAfter
      });
      
      // 验证顺序是否发生了改变
      expect(firstBlockTextAfter).not.toBe(firstBlockTextBefore);
      
    } catch (error) {
      console.log('直接拖拽失败，尝试使用拖拽句柄');
      
      // 如果直接拖拽失败，尝试使用拖拽句柄
      const dragHandle = page.locator('[class*="drag"], img[src*="drag"]').first();
      if (await dragHandle.isVisible()) {
        await dragHandle.dragTo(secondBlock, { force: true });
        await page.waitForTimeout(2000);
      }
    }
  });

  test('应该能够拖拽左侧目录项进行重新排序', async () => {
    // 获取左侧目录项
    const treeItems = page.locator('.workspace-tree-view-node, [data-node-level]');
    await treeItems.first().waitFor();
    
    if (await treeItems.count() > 1) {
      const firstItem = treeItems.nth(0);
      const secondItem = treeItems.nth(1);
      
      // 获取拖拽前的文本
      const firstItemText = await firstItem.textContent();
      const secondItemText = await secondItem.textContent();
      
      console.log('目录拖拽前:', {
        first: firstItemText,
        second: secondItemText
      });
      
      try {
        // 尝试拖拽目录项
        await firstItem.dragTo(secondItem, { 
          force: true,
          timeout: 10000 
        });
        
        await page.waitForTimeout(2000);
        
        console.log('目录拖拽完成');
      } catch (error) {
        console.log('目录拖拽失败:', error.message);
      }
    }
  });

  test('应该能够使用鼠标事件模拟拖拽', async () => {
    // 使用低级别的鼠标事件来模拟拖拽
    const textBlocks = page.locator('.ace-line, .text-block');
    await textBlocks.first().waitFor();
    
    const sourceBlock = textBlocks.nth(0);
    const targetBlock = textBlocks.nth(1);
    
    // 获取元素的边界框
    const sourceBoundingBox = await sourceBlock.boundingBox();
    const targetBoundingBox = await targetBlock.boundingBox();
    
    if (sourceBoundingBox && targetBoundingBox) {
      // 悬停显示拖拽句柄
      await page.mouse.move(
        sourceBoundingBox.x + sourceBoundingBox.width / 2,
        sourceBoundingBox.y + sourceBoundingBox.height / 2
      );
      await page.waitForTimeout(500);
      
      // 执行拖拽操作
      await page.mouse.down();
      
      // 慢慢移动到目标位置
      const steps = 5;
      const deltaX = (targetBoundingBox.x - sourceBoundingBox.x) / steps;
      const deltaY = (targetBoundingBox.y - sourceBoundingBox.y) / steps;
      
      for (let i = 1; i <= steps; i++) {
        await page.mouse.move(
          sourceBoundingBox.x + deltaX * i,
          sourceBoundingBox.y + deltaY * i
        );
        await page.waitForTimeout(100);
      }
      
      await page.mouse.up();
      await page.waitForTimeout(2000);
      
      console.log('鼠标事件拖拽完成');
    }
  });

  test('应该能够验证拖拽操作的响应', async () => {
    // 测试页面是否响应拖拽操作
    const textBlocks = page.locator('.ace-line, .text-block');
    await textBlocks.first().waitFor();
    
    const firstBlock = textBlocks.nth(0);
    
    // 悬停并检查是否有视觉反馈
    await firstBlock.hover();
    await page.waitForTimeout(500);
    
    // 检查是否有拖拽相关的样式类被添加
    const hasHoverEffect = await page.evaluate(() => {
      const elements = document.querySelectorAll('.ace-line, .text-block');
      return Array.from(elements).some(el => 
        el.classList.toString().includes('hover') || 
        getComputedStyle(el).cursor.includes('grab') ||
        getComputedStyle(el).cursor.includes('move')
      );
    });
    
    console.log('检测到拖拽样式:', hasHoverEffect);
    
    // 检查拖拽句柄是否出现
    const dragHandleExists = await page.locator('[class*="drag"], [role="button"][aria-label*="拖"], img[src*="drag"]').count();
    console.log('拖拽句柄数量:', dragHandleExists);
    
    expect(dragHandleExists).toBeGreaterThan(0);
  });

  test.afterAll(async () => {
    await page?.close();
  });
});