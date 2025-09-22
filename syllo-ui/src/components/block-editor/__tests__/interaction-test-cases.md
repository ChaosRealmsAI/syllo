# Block Editor 交互逻辑测试用例

## 1. 编辑器核心功能

### 1.1 块状态管理
```typescript
describe('Editor Block State Management', () => {
  test('应该初始化blocks和activeBlockId状态', () => {
    // Editor.tsx:399-400
    // const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);
    // const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  });

  test('应该渲染所有初始块', () => {
    // Editor.tsx:17-396 initialBlocks包含21个不同类型的块
    // 包括: heading1, paragraph, heading2, unorderedList, code, quote, divider,
    // heading3, columns, table, checkboxList, linkPreview, taskCard,
    // highlightBlock, kanbanBoard等
  });
});
```

### 1.2 鼠标交互逻辑
```typescript
describe('Mouse Interaction Logic', () => {
  test('鼠标移动应该设置activeBlockId', () => {
    // EditorContent.tsx:40-48
    // 当鼠标移动到块元素上时，应该设置activeBlockId为该块的ID
    // 只有当blockId与当前activeBlockId不同时才更新
  });

  test('鼠标离开编辑器区域应该清除activeBlockId', () => {
    // EditorContent.tsx:51-53
    // setActiveBlockId(null)
  });

  test('应该正确识别data-block-id属性', () => {
    // EditorContent.tsx:42-43
    // const blockElement = target.closest('[data-block-id]');
    // const blockId = blockElement?.getAttribute('data-block-id');
  });
});
```

## 2. 块包装器(BlockWrapper)交互

### 2.1 工具栏显示逻辑
```typescript
describe('BlockWrapper Toolbar Logic', () => {
  test('active状态下应该显示拖拽工具栏', () => {
    // BlockWrapper.tsx:42-50
    // {showToolbar && isActive && (<BlockDragToolbar />)}
  });

  test('divider和columns类型不应该显示工具栏', () => {
    // EditorContent.tsx:166
    // showToolbar={block.type !== "divider" && block.type !== "columns"}
  });

  test('工具栏应该有正确的菜单处理逻辑', () => {
    // BlockWrapper.tsx:31-34
    // const handleMenuItemClick = (item: any) => {
    //   console.log("Menu item clicked:", item);
    // };
  });
});
```

### 2.2 拖拽事件处理
```typescript
describe('BlockWrapper Drag Events', () => {
  test('应该处理onDragStart事件', () => {
    // BlockWrapper.tsx:46
    // onDragStart={(e) => onDragStart?.(id)}
  });

  test('应该处理onDragEnd事件', () => {
    // BlockWrapper.tsx:47
    // onDragEnd={onDragEnd}
  });

  test('应该处理onDragOver和onDrop事件', () => {
    // BlockWrapper.tsx:39-40
    // onDragOver={onDragOver} onDrop={onDrop}
  });
});
```

## 3. CheckboxList 复杂交互逻辑

### 3.1 编辑状态管理
```typescript
describe('CheckboxList Editing State', () => {
  test('应该管理editingId和editingText状态', () => {
    // CheckboxList.tsx:33-34
    // const [editingId, setEditingId] = useState<string | null>(null);
    // const [editingText, setEditingText] = useState("");
  });

  test('点击文本应该进入编辑模式', () => {
    // CheckboxList.tsx:134-138
    // const startEdit = (item: CheckboxItem) => {
    //   setEditingId(item.id);
    //   setEditingText(item.text);
    // };
  });

  test('失焦应该结束编辑', () => {
    // CheckboxList.tsx:203
    // onBlur={finishEdit}
  });
});
```

### 3.2 键盘事件处理
```typescript
describe('CheckboxList Keyboard Events', () => {
  test('Enter键应该完成编辑并添加新项', () => {
    // CheckboxList.tsx:149-155
    // if (e.key === "Enter") {
    //   finishEdit();
    //   if (editable) addItem(itemId);
    // }
  });

  test('Escape键应该取消编辑', () => {
    // CheckboxList.tsx:155-158
    // if (e.key === "Escape") {
    //   setEditingId(null);
    //   setEditingText("");
    // }
  });

  test('Tab键应该添加子项', () => {
    // CheckboxList.tsx:158-164
    // if (e.key === "Tab") {
    //   e.preventDefault();
    //   finishEdit();
    //   if (editable) addSubItem(itemId);
    // }
  });
});
```

### 3.3 项目管理逻辑
```typescript
describe('CheckboxList Item Management', () => {
  test('应该能添加新项目', () => {
    // CheckboxList.tsx:54-84
    // 生成唯一ID: `checkbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    // 自动开始编辑新项目，延迟100ms
  });

  test('应该能删除项目', () => {
    // CheckboxList.tsx:86-99
    // 递归删除，包括嵌套项目
  });

  test('应该能添加子项目', () => {
    // CheckboxList.tsx:101-132
    // 添加到父项目的children数组
  });

  test('应该能更新项目状态', () => {
    // CheckboxList.tsx:36-52
    // 递归更新，支持嵌套结构
  });
});
```

### 3.4 嵌套渲染逻辑
```typescript
describe('CheckboxList Nested Rendering', () => {
  test('应该支持嵌套子项目渲染', () => {
    // CheckboxList.tsx:259-267
    // 递归渲染children，depth + 1
  });

  test('应该有正确的缩进计算', () => {
    // CheckboxList.tsx:178
    // style={{ marginLeft: `${depth * 24}px` }}
  });

  test('空列表应该显示添加提示', () => {
    // CheckboxList.tsx:275-285
    // {editable && items.length === 0 && (...)}
  });
});
```

## 4. TaskCard 交互逻辑

### 4.1 编辑模式切换
```typescript
describe('TaskCard Edit Mode', () => {
  test('应该管理isEditing状态', () => {
    // TaskCard.tsx:70
    // const [isEditing, setIsEditing] = useState(false);
  });

  test('编辑模式应该显示表单', () => {
    // TaskCard.tsx:137-218
    // 完整的编辑表单，包括标题、描述、状态、优先级、截止日期
  });

  test('应该有保存和取消按钮', () => {
    // TaskCard.tsx:208-215
    // 保存: handleSave, 取消: handleCancel
  });
});
```

### 4.2 显示模式逻辑
```typescript
describe('TaskCard Display Modes', () => {
  test('compact模式应该简化显示', () => {
    // TaskCard.tsx:221-279
    // 只显示基本信息，更紧凑的布局
  });

  test('完整模式应该显示所有信息', () => {
    // TaskCard.tsx:282-389
    // 显示描述、元数据、负责人等完整信息
  });

  test('完成状态应该有视觉效果', () => {
    // TaskCard.tsx:224, 284, 236, 296
    // opacity-60/75, line-through效果
  });
});
```

### 4.3 状态和样式计算
```typescript
describe('TaskCard Status and Styling', () => {
  test('应该有正确的状态颜色映射', () => {
    // TaskCard.tsx:73-84
    // todo: gray, in-progress: blue, review: yellow, done: green
  });

  test('应该有正确的优先级颜色', () => {
    // TaskCard.tsx:86-97
    // low: green, medium: yellow, high: orange, urgent: red
  });

  test('过期任务应该有特殊样式', () => {
    // TaskCard.tsx:135, 247-252, 346-351
    // 红色文字表示过期
  });
});
```

## 5. 拖拽系统(DragContext)

### 5.1 状态管理
```typescript
describe('DragContext State Management', () => {
  test('应该管理blocks, dragState, dropIndicator状态', () => {
    // DragContext.tsx:38-44
    // blocks, dragState, dropIndicator三个主要状态
  });

  test('dragState应该包含activeId, overId, dropPosition', () => {
    // DragContext.tsx:39-43
    // { activeId: null, overId: null, dropPosition: "after" }
  });
});
```

### 5.2 块查找逻辑
```typescript
describe('DragContext Block Finding', () => {
  test('应该能递归查找块', () => {
    // DragContext.tsx:47-56
    // findBlock支持嵌套结构查找
  });

  test('应该能查找块的父级', () => {
    // DragContext.tsx:59-70
    // findBlockParent查找直接父级
  });
});
```

### 5.3 块移动逻辑
```typescript
describe('DragContext Block Movement', () => {
  test('应该能移动块到before位置', () => {
    // DragContext.tsx:73-114
    // position: "before" | "after"
  });

  test('移动应该保持数据完整性', () => {
    // DragContext.tsx:75 深拷贝
    // const newBlocks = JSON.parse(JSON.stringify(prevBlocks));
  });

  test('应该能处理嵌套结构的移动', () => {
    // DragContext.tsx:83-86, 99-102
    // 递归处理children
  });
});
```

## 6. 块类型渲染逻辑

### 6.1 基础块类型
```typescript
describe('Basic Block Types Rendering', () => {
  test('应该正确渲染heading块', () => {
    // EditorContent.tsx:57-62
    // heading1, heading2, heading3对应level 1, 2, 3
  });

  test('应该正确渲染列表块', () => {
    // EditorContent.tsx:65-68
    // unorderedList, orderedList
  });

  test('应该正确渲染代码块', () => {
    // EditorContent.tsx:69-70
    // 默认language="javascript"
  });
});
```

### 6.2 高级块类型
```typescript
describe('Advanced Block Types Rendering', () => {
  test('应该渲染表格并处理onChange', () => {
    // EditorContent.tsx:78-88
    // EditorTable with editable=true and onChange handler
  });

  test('应该渲染任务卡片', () => {
    // EditorContent.tsx:113-124
    // TaskCard with editable=true and draggable=true
  });

  test('应该渲染看板', () => {
    // EditorContent.tsx:125-135
    // KanbanBoard with editable=true
  });

  test('所有onChange都是TODO状态', () => {
    // EditorContent.tsx:84, 95, 108, 121, 131, 143
    // 所有组件的onChange都只是console.log，标记为TODO
  });
});
```

## 7. 样式和主题系统

### 7.1 CSS模块使用
```typescript
describe('CSS Module Usage', () => {
  test('应该正确应用编辑器样式', () => {
    // Editor.tsx:4, EditorContent.tsx:20
    // styles.editorWrapper, styles.editorContent
  });

  test('应该正确应用块样式', () => {
    // Block.tsx:19, BlockWrapper.tsx:38
    // styles.contentBlock, styles.blockContainerWithHotZone
  });
});
```

### 7.2 条件样式逻辑
```typescript
describe('Conditional Styling Logic', () => {
  test('CheckboxList应该有正确的编辑状态样式', () => {
    // CheckboxList.tsx:174-177
    // hover:bg-muted/50, isEditing && "bg-muted/50"
  });

  test('TaskCard应该有正确的状态样式', () => {
    // TaskCard.tsx:223-225, 283-285
    // 完成状态的opacity和line-through效果
  });
});
```

## 8. 事件处理边界情况

### 8.1 空值处理
```typescript
describe('Null/Undefined Handling', () => {
  test('应该安全处理空的block内容', () => {
    // EditorContent.tsx:149 default case返回null
  });

  test('应该安全处理undefined的onChange', () => {
    // CheckboxList.tsx:37 if (!onChange) return;
    // TaskCard.tsx:125 onChange?.(editData);
  });
});
```

### 8.2 边界条件
```typescript
describe('Edge Cases', () => {
  test('空的CheckboxList应该显示添加按钮', () => {
    // CheckboxList.tsx:275-285
  });

  test('非编辑模式下点击应该无效', () => {
    // CheckboxList.tsx:135 if (!editable) return;
  });

  test('拖拽组件应该有可见的拖拽手柄', () => {
    // CheckboxList.tsx:181-185, TaskCard.tsx:288-293
    // opacity-0 group-hover:opacity-100 transition-opacity
  });
});
```

## 9. 性能相关逻辑

### 9.1 回调优化
```typescript
describe('Callback Optimization', () => {
  test('鼠标事件应该使用useCallback', () => {
    // EditorContent.tsx:40, 51
    // React.useCallback with dependencies
  });

  test('应该避免不必要的重渲染', () => {
    // 依赖数组: [activeBlockId, setActiveBlockId]
  });
});
```

### 9.2 数据更新策略
```typescript
describe('Data Update Strategy', () => {
  test('拖拽移动应该使用深拷贝', () => {
    // DragContext.tsx:75
    // JSON.parse(JSON.stringify(prevBlocks))
  });

  test('CheckboxList更新应该使用递归映射', () => {
    // CheckboxList.tsx:39-51
    // 递归更新嵌套结构
  });
});
```