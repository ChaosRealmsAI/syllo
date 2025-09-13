# 飞书文档编辑器复刻需求

## 目标
请基于以下交互记录，复刻一个类似飞书文档的在线编辑器系统。

## 核心交互特性

### 1. 编辑器布局
- **左侧边栏**: 文档树形目录，支持展开/折叠
- **主编辑区**: 富文本编辑器，支持实时编辑
- **顶部工具栏**: 包含分享、编辑模式切换等按钮
- **自动保存提示**: "已经保存到云端"的实时反馈

### 2. 文本编辑行为
基于录制的操作，编辑器需要实现：

#### 点击定位
- 点击位置精确定位光标
- 支持在任意位置开始输入

#### 键盘输入处理
```javascript
// 捕获的键盘输入序列
输入: s -> d -> s -> f -> 空格
结果: "sdsf "
输入: Enter
结果: 创建新行
输入: s -> d -> f -> 空格  
结果: "sdf "
```

#### DOM更新机制
- 每次键盘输入触发DOM更新（46次DOM变化）
- 输入时实时更新页面内容
- Enter键创建新的文本块

### 3. 交互细节实现

#### 鼠标点击处理
```javascript
// 记录的点击操作
Click 1: {x: 237, y: 435} - 编辑区域内容块
Click 2: {x: 236, y: 360} - 空白行定位
Click 3: {x: 480, y: 746} - 页面底部区域
```

#### 输入事件监听
```javascript
// 输入类型
inputType: "insertCompositionText"
selector: "page-block root-block"
```

### 4. 页面结构要求

#### HTML结构
```html
<div class="container">
  <!-- 左侧边栏 -->
  <div class="sidebar">
    <div class="doc-tree">
      <!-- 文档列表 -->
    </div>
  </div>
  
  <!-- 主编辑区 -->
  <div class="editor-main">
    <div class="editor-header">
      <!-- 标题和工具栏 -->
    </div>
    <div class="editor-content">
      <div class="page-block root-block">
        <!-- 可编辑内容区 -->
        <div class="ace-line"></div>
      </div>
    </div>
  </div>
</div>
```

#### CSS类名参考
- `.render-unit-wrapper` - 渲染单元容器
- `.ace-line` - 编辑行
- `.page-block` - 页面块
- `.root-block` - 根块
- `.page-main-item` - 页面主要项

### 5. 实时保存机制
- 输入后自动触发保存
- 显示"已经保存到云端"提示
- 保存状态的视觉反馈

### 6. 性能优化要求
- 处理频繁的DOM更新（46次/分钟）
- 优化输入响应时间（<100ms）
- 流畅的光标移动和文本渲染

## 实现建议

### 使用技术栈
- **编辑器核心**: ContentEditable API 或 Draft.js/Slate.js
- **状态管理**: React/Vue + Redux/Vuex
- **实时同步**: WebSocket
- **虚拟滚动**: 处理大文档

### 关键代码示例

```javascript
// 编辑器初始化
class FeishuEditor {
  constructor(container) {
    this.container = container;
    this.initEventListeners();
    this.initAutoSave();
  }
  
  initEventListeners() {
    // 监听点击
    this.container.addEventListener('click', (e) => {
      this.setCursorPosition(e.clientX, e.clientY);
    });
    
    // 监听键盘输入
    this.container.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });
    
    // 监听输入
    this.container.addEventListener('input', (e) => {
      this.handleInput(e);
      this.triggerAutoSave();
    });
  }
  
  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.createNewLine();
    }
  }
  
  handleInput(e) {
    // 更新DOM
    this.updateDOM(e.target.value);
    // 触发自动保存
    this.scheduleAutoSave();
  }
  
  triggerAutoSave() {
    // 防抖保存
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      this.saveToCloud();
      this.showSaveStatus('已经保存到云端');
    }, 1000);
  }
}
```

## 测试用例

基于录制的操作序列，需要通过以下测试：

1. **输入测试**
   - 输入 "sdsf " → 显示 "sdsf "
   - 按 Enter → 创建新行
   - 输入 "sdf " → 在新行显示 "sdf "

2. **点击测试**
   - 点击坐标(237, 435) → 光标定位到对应位置
   - 点击坐标(236, 360) → 光标移动到新位置

3. **自动保存测试**
   - 输入文字后1秒 → 显示"已经保存到云端"

## 交付要求

1. 完整的HTML/CSS/JS实现
2. 支持基本的文本编辑功能
3. 实现点击定位和键盘输入
4. 包含自动保存机制
5. 响应时间 < 100ms
6. 支持中文输入

请基于以上需求和录制的交互数据，实现一个功能完整的飞书文档编辑器。