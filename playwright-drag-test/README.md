# 飞书拖拽测试项目

这个项目用于测试飞书云文档的拖拽功能，使用 Playwright 自动化测试框架。

## 功能特性

- ✅ 文档内容块拖拽重新排序
- ✅ 左侧目录树拖拽重排
- ✅ 拖拽句柄检测和交互
- ✅ 多种拖拽方法（标准API、HTML5、鼠标事件）
- ✅ 拖拽能力自动检测
- ✅ 调试截图和日志

## 项目结构

```
playwright-drag-test/
├── tests/
│   ├── feishu-drag.spec.js      # 基础拖拽测试
│   ├── advanced-drag.spec.js    # 高级拖拽测试
│   └── utils/
│       └── drag-helper.js       # 拖拽辅助工具类
├── playwright.config.js         # Playwright 配置
├── package.json                 # 项目依赖
└── README.md                    # 项目说明
```

## 安装和运行

### 1. 安装依赖
\`\`\`bash
npm install
\`\`\`

### 2. 安装浏览器
\`\`\`bash
npm run install:browsers
# 或者
npx playwright install chromium
\`\`\`

### 3. 运行测试

#### 基本测试命令
\`\`\`bash
# 运行所有测试
npm test

# 运行基础拖拽测试
npm run test:feishu

# 运行高级拖拽测试  
npm run test:advanced

# 带界面运行测试（调试模式）
npm run test:headed

# 交互式调试
npm run test:debug

# UI模式运行
npm run test:ui
\`\`\`

#### 单独运行特定测试
\`\`\`bash
# 运行特定测试文件
npx playwright test feishu-drag.spec.js

# 运行特定测试用例
npx playwright test -g "应该能够显示拖拽句柄"
\`\`\`

### 4. 查看测试报告
\`\`\`bash
npm run report
\`\`\`

## 测试用例说明

### 基础测试 (`feishu-drag.spec.js`)
- **拖拽句柄显示测试**: 验证hover时拖拽句柄是否出现
- **内容块拖拽测试**: 测试文档内容块的拖拽重排序
- **目录拖拽测试**: 测试左侧目录树的拖拽功能
- **鼠标事件拖拽**: 使用低级鼠标事件模拟拖拽
- **响应验证测试**: 验证页面对拖拽操作的响应

### 高级测试 (`advanced-drag.spec.js`)
- **可拖拽元素检测**: 自动检测页面上的所有可拖拽元素
- **拖拽能力检测**: 判断元素是否支持拖拽
- **平滑拖拽**: 使用平滑的鼠标移动模拟真实用户操作
- **HTML5拖拽API**: 使用标准HTML5拖拽事件
- **综合测试**: 尝试多种拖拽方法，找到最有效的方式
- **复杂场景模拟**: 模拟复杂的用户拖拽行为

## 拖拽辅助工具 (`DragHelper`)

\`DragHelper\` 类提供了多种拖拽操作方法：

- **waitForDragHandle()**: 等待拖拽句柄出现
- **smoothDrag()**: 执行平滑拖拽操作
- **html5Drag()**: 使用HTML5拖拽API
- **isDraggable()**: 检测元素是否可拖拽
- **getAllDraggableElements()**: 获取页面所有可拖拽元素
- **verifyDragResult()**: 验证拖拽结果
- **debugScreenshot()**: 调试截图

## 使用示例

\`\`\`javascript
import { DragHelper } from './utils/drag-helper.js';

// 创建拖拽辅助实例
const dragHelper = new DragHelper(page);

// 执行平滑拖拽
await dragHelper.smoothDrag(sourceElement, targetElement, {
  steps: 15,
  delay: 30
});

// 检测元素是否可拖拽
const isDraggable = await dragHelper.isDraggable(element);

// 获取所有可拖拽元素
const draggableElements = await dragHelper.getAllDraggableElements();
\`\`\`

## 调试和故障排除

### 调试模式
\`\`\`bash
# 启用调试模式，逐步执行测试
npm run test:debug

# 带浏览器界面运行，观察实际操作
npm run test:headed
\`\`\`

### 截图调试
测试运行时会自动在关键步骤截图，截图文件保存在项目根目录：
- \`debug-*.png\`: 调试截图
- \`playwright-report/\`: 测试报告和失败截图

### 常见问题

1. **拖拽句柄不显示**: 确保在编辑模式下，并且正确hover到内容块
2. **拖拽操作无效**: 尝试不同的拖拽方法（标准API、HTML5、鼠标事件）
3. **权限问题**: 确保有编辑权限访问飞书文档
4. **元素定位失败**: 使用 \`getAllDraggableElements()\` 查看可用的拖拽元素

## 配置说明

### 浏览器配置
默认使用 Chromium 浏览器。如需使用其他浏览器，可在 \`playwright.config.js\` 中修改。

### 超时配置
拖拽操作可能需要较长时间，已配置适当的超时时间。如有需要可在配置文件中调整。

### 重试配置
配置了失败重试机制，提高测试稳定性。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个拖拽测试项目！