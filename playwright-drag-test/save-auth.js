import { chromium } from '@playwright/test';

async function saveAuth() {
  console.log('🚀 启动浏览器，请手动登录飞书...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100 // 稍微慢一点，方便操作
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 导航到飞书页面
  await page.goto('https://yqpgaaarht3.feishu.cn/wiki/LOBbw5AMTiG3CIkpclacK0tHnlh');
  
  console.log('📝 请在浏览器中完成登录...');
  console.log('🔍 等待检测到登录状态...');
  
  // 等待登录完成的标志（检查是否有编辑按钮或用户头像）
  try {
    await Promise.race([
      page.waitForSelector('[role="button"][aria-label*="编辑"]', { timeout: 60000 }),
      page.waitForSelector('button:has-text("编辑")', { timeout: 60000 }),
      page.waitForSelector('[class*="user"], [class*="avatar"]', { timeout: 60000 }),
      page.waitForText('编辑', { timeout: 60000 })
    ]);
    
    console.log('✅ 检测到登录成功！');
  } catch (error) {
    console.log('⏰ 超时，但继续保存当前状态...');
  }
  
  // 保存登录状态
  await context.storageState({ path: 'auth.json' });
  console.log('💾 登录状态已保存到 auth.json');
  
  // 等待一下让用户确认
  await page.waitForTimeout(2000);
  
  await browser.close();
  console.log('🎉 登录状态保存完成！现在可以运行测试了。');
}

saveAuth().catch(console.error);