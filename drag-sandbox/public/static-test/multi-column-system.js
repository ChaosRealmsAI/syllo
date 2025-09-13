/**
 * 飞书风格多列布局拖拽系统
 * 支持创建多列、调整列宽、列内拖拽
 */
class MultiColumnDragSystem {
  constructor(container = '.container') {
    this.container = document.querySelector(container);
    this.draggedElement = null;
    this.draggedBlock = null;
    this.dropTarget = null;
    this.dropPosition = null; // 'before' | 'after' | 'left' | 'right'
    this.resizing = false;
    this.resizeData = null;
    this.autoScrollTimer = null;
    this.scrollSpeed = 5;
    
    this.init();
  }
  
  init() {
    if (!this.container) {
      console.error('Container not found');
      return;
    }
    
    this.setupDragHandles();
    this.setupHoverZones();
    this.setupDropZones();
    this.setupColumnResizers();
    
    console.log('MultiColumnDragSystem initialized');
  }
  
  setupDragHandles() {
    const handles = this.container.querySelectorAll('.drag-handle-icon');
    
    handles.forEach(handle => {
      // 拖拽开始
      handle.addEventListener('dragstart', (e) => {
        const block = e.target.closest('.block');
        this.draggedElement = handle;
        this.draggedBlock = block;
        block.classList.add('dragging');
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', block.dataset.id);
        
        console.log('Drag started:', block.dataset.id);
      });
      
      // 拖拽结束
      handle.addEventListener('dragend', (e) => {
        if (this.draggedBlock) {
          this.draggedBlock.classList.remove('dragging');
        }
        
        this.clearDropIndicators();
        this.clearHighlights();
        this.stopAutoScroll(); // 停止自动滚动
        
        // 验证拖拽目标有效性
        if (this.dropTarget && this.dropPosition && 
            !this.shouldIgnoreDragTarget(this.draggedBlock, this.dropTarget)) {
          this.handleDrop();
        }
        
        // 重置状态
        this.draggedElement = null;
        this.draggedBlock = null;
        this.dropTarget = null;
        this.dropPosition = null;
        
        console.log('Drag ended');
      });
      
      // 句柄hover效果
      handle.addEventListener('mouseenter', (e) => {
        const block = e.target.closest('.block');
        block.classList.add('handle-hover');
      });
      
      handle.addEventListener('mouseleave', (e) => {
        const block = e.target.closest('.block');
        block.classList.remove('handle-hover');
      });
    });
  }
  
  setupHoverZones() {
    const blocks = this.container.querySelectorAll('.block');
    
    blocks.forEach(block => {
      const handle = block.querySelector('.drag-handle');
      const zone = block.querySelector('.hover-zone');
      
      // 块本身的hover
      block.addEventListener('mouseenter', (e) => {
        if (handle && !this.resizing) {
          handle.classList.add('show');
        }
      });
      
      block.addEventListener('mouseleave', (e) => {
        const relatedTarget = e.relatedTarget;
        if (!block.contains(relatedTarget) && handle) {
          handle.classList.remove('show');
        }
      });
      
      // 左侧热区
      if (zone) {
        zone.addEventListener('mouseenter', (e) => {
          if (handle && !this.resizing) {
            handle.classList.add('show');
          }
        });
      }
    });
  }
  
  setupDropZones() {
    const blocks = this.container.querySelectorAll('.block');
    
    blocks.forEach(block => {
      // 拖拽经过
      block.addEventListener('dragover', (e) => {
        e.preventDefault();
        
        if (!this.draggedBlock || block === this.draggedBlock) {
          return;
        }
        
        const rect = block.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = rect.width;
        const height = rect.height;
        
        // 清除之前的指示器
        this.clearDropIndicators();
        
        // 判断拖拽位置
        const edgeThreshold = 40; // 边缘检测阈值
        
        if (x < edgeThreshold) {
          // 左边缘 - 创建左侧列
          this.dropPosition = 'left';
          block.querySelector('.drop-indicator.vertical.left').classList.add('show');
        } else if (x > width - edgeThreshold) {
          // 右边缘 - 创建右侧列
          this.dropPosition = 'right';
          block.querySelector('.drop-indicator.vertical.right').classList.add('show');
        } else if (y < height / 2) {
          // 上半部分 - 插入到前面
          this.dropPosition = 'before';
          block.querySelector('.drop-indicator.horizontal.before').classList.add('show');
        } else {
          // 下半部分 - 插入到后面
          this.dropPosition = 'after';
          block.querySelector('.drop-indicator.horizontal.after').classList.add('show');
        }
        
        this.dropTarget = block;
        block.classList.add('drag-over');
      });
      
      // 拖拽离开
      block.addEventListener('dragleave', (e) => {
        if (!block.contains(e.relatedTarget)) {
          block.classList.remove('drag-over');
          this.clearDropIndicators();
        }
      });
      
      // 放置
      block.addEventListener('drop', (e) => {
        e.preventDefault();
        console.log('Dropped on:', block.dataset.id, 'Position:', this.dropPosition);
      });
    });
  }
  
  setupColumnResizers() {
    const resizers = this.container.querySelectorAll('.column-resizer');
    
    resizers.forEach(resizer => {
      resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.startColumnResize(e, resizer);
      });
    });
  }
  
  startColumnResize(e, resizer) {
    this.resizing = true;
    const container = resizer.closest('.column-container');
    const columns = container.querySelectorAll('.column');
    const leftColumn = columns[0];
    const rightColumn = columns[1];
    
    this.resizeData = {
      container,
      leftColumn,
      rightColumn,
      startX: e.clientX,
      startLeftFlex: parseFloat(leftColumn.style.flex || 1),
      startRightFlex: parseFloat(rightColumn.style.flex || 1),
      containerWidth: container.offsetWidth
    };
    
    document.addEventListener('mousemove', this.handleColumnResize);
    document.addEventListener('mouseup', this.endColumnResize);
    
    // 隐藏所有拖拽句柄
    const handles = this.container.querySelectorAll('.drag-handle');
    handles.forEach(handle => handle.classList.remove('show'));
  }
  
  handleColumnResize = (e) => {
    if (!this.resizing || !this.resizeData) return;
    
    const deltaX = e.clientX - this.resizeData.startX;
    const deltaRatio = deltaX / this.resizeData.containerWidth;
    const totalFlex = this.resizeData.startLeftFlex + this.resizeData.startRightFlex;
    
    const newLeftFlex = Math.max(0.2, Math.min(
      totalFlex - 0.2,
      this.resizeData.startLeftFlex + deltaRatio * totalFlex
    ));
    const newRightFlex = totalFlex - newLeftFlex;
    
    this.resizeData.leftColumn.style.flex = newLeftFlex;
    this.resizeData.rightColumn.style.flex = newRightFlex;
    
    // 更新resizer位置
    const resizer = this.resizeData.container.querySelector('.column-resizer');
    const leftPercent = (newLeftFlex / totalFlex) * 100;
    resizer.style.left = `calc(${leftPercent}% - 4px)`;
  }
  
  endColumnResize = (e) => {
    this.resizing = false;
    this.resizeData = null;
    document.removeEventListener('mousemove', this.handleColumnResize);
    document.removeEventListener('mouseup', this.endColumnResize);
  }
  
  clearDropIndicators() {
    const indicators = this.container.querySelectorAll('.drop-indicator');
    indicators.forEach(indicator => {
      indicator.classList.remove('show');
    });
  }
  
  clearHighlights() {
    const blocks = this.container.querySelectorAll('.block');
    blocks.forEach(block => {
      block.classList.remove('drag-over', 'handle-hover');
    });
  }
  
  handleDrop() {
    if (!this.draggedBlock || !this.dropTarget) {
      return;
    }
    
    console.log('Handling drop:', {
      from: this.draggedBlock.dataset.id,
      to: this.dropTarget.dataset.id,
      position: this.dropPosition
    });
    
    if (this.dropPosition === 'left' || this.dropPosition === 'right') {
      // 创建多列布局
      this.createColumnLayout();
    } else {
      // 普通重排序
      this.reorderBlocks();
    }
  }
  
  createColumnLayout() {
    // 检查目标块是否已在列中
    const targetInColumn = this.dropTarget.closest('.column');
    
    if (targetInColumn) {
      // 目标已在列中，添加到同一列或创建新列
      console.log('Target already in column, handling column drop');
      // TODO: 实现列内操作
      this.reorderBlocks();
    } else {
      // 创建新的列布局
      const container = document.createElement('div');
      container.className = 'column-container';
      container.dataset.id = `column-${Date.now()}`;
      
      // 创建左列
      const leftColumn = document.createElement('div');
      leftColumn.className = 'column';
      leftColumn.style.flex = '1';
      
      // 创建右列
      const rightColumn = document.createElement('div');
      rightColumn.className = 'column';
      rightColumn.style.flex = '1';
      
      // 创建列调整手柄
      const resizer = document.createElement('div');
      resizer.className = 'column-resizer';
      resizer.style.left = 'calc(50% - 4px)';
      
      // 保存目标块的父节点
      const targetParent = this.dropTarget.parentNode;
      
      // 根据位置决定哪个块在哪一列
      if (this.dropPosition === 'left') {
        leftColumn.appendChild(this.draggedBlock);
        rightColumn.appendChild(this.dropTarget);
      } else {
        leftColumn.appendChild(this.dropTarget);
        rightColumn.appendChild(this.draggedBlock);
      }
      
      // 组装列容器
      container.appendChild(leftColumn);
      container.appendChild(resizer);
      container.appendChild(rightColumn);
      
      // 将列容器插入到原目标块的位置
      targetParent.insertBefore(container, this.dropTarget.nextSibling);
      
      // 重新初始化新创建的元素
      this.reinitializeElements(container);
      
      // 重新分配列比例并更新调整手柄位置
      this.redistributeColumnRatios(container, true);
      
      // 添加成功动画
      if (this.draggedBlock) {
        this.draggedBlock.classList.add('drag-success');
        setTimeout(() => {
          if (this.draggedBlock) {
            this.draggedBlock.classList.remove('drag-success');
          }
        }, 1200);
      }
    }
  }
  
  reorderBlocks() {
    if (!this.draggedBlock || !this.dropTarget) {
      return;
    }
    
    // 执行DOM重排序
    if (this.dropPosition === 'before') {
      this.dropTarget.parentNode.insertBefore(this.draggedBlock, this.dropTarget);
    } else {
      const nextSibling = this.dropTarget.nextSibling;
      if (nextSibling) {
        this.dropTarget.parentNode.insertBefore(this.draggedBlock, nextSibling);
      } else {
        this.dropTarget.parentNode.appendChild(this.draggedBlock);
      }
    }
    
    // 添加成功动画
    if (this.draggedBlock) {
      this.draggedBlock.classList.add('drag-success');
      setTimeout(() => {
        if (this.draggedBlock) {
          this.draggedBlock.classList.remove('drag-success');
        }
      }, 1200);
    }
    
    // 触发自定义事件
    this.container.dispatchEvent(new CustomEvent('blocksReordered', {
      detail: {
        from: this.draggedBlock.dataset.id,
        to: this.dropTarget.dataset.id,
        position: this.dropPosition
      }
    }));
  }
  
  reinitializeElements(container) {
    // 重新绑定新元素的事件
    const blocks = container.querySelectorAll('.block');
    blocks.forEach(block => {
      // 重新设置hover zones
      const handle = block.querySelector('.drag-handle');
      const zone = block.querySelector('.hover-zone');
      const dragIcon = block.querySelector('.drag-handle-icon');
      
      // 重新绑定hover事件
      if (handle) {
        // 块本身的hover
        block.addEventListener('mouseenter', () => {
          if (!this.resizing) handle.classList.add('show');
        });
        
        block.addEventListener('mouseleave', (e) => {
          if (!block.contains(e.relatedTarget)) {
            handle.classList.remove('show');
          }
        });
        
        // 左侧热区
        if (zone) {
          zone.addEventListener('mouseenter', () => {
            if (!this.resizing) handle.classList.add('show');
          });
        }
      }
      
      // 重新绑定拖拽事件
      if (dragIcon) {
        this.setupSingleDragHandle(dragIcon);
      }
      
      // 重新绑定drop zone事件
      this.setupSingleDropZone(block);
    });
    
    // 重新绑定列调整手柄
    const resizer = container.querySelector('.column-resizer');
    if (resizer) {
      resizer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        this.startColumnResize(e, resizer);
      });
    }
  }
  
  setupSingleDragHandle(handle) {
    handle.addEventListener('dragstart', (e) => {
      const block = e.target.closest('.block');
      this.draggedElement = handle;
      this.draggedBlock = block;
      block.classList.add('dragging');
      
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', block.dataset.id);
    });
    
    handle.addEventListener('dragend', (e) => {
      if (this.draggedBlock) {
        this.draggedBlock.classList.remove('dragging');
      }
      
      this.clearDropIndicators();
      this.clearHighlights();
      
      if (this.dropTarget && this.dropPosition) {
        this.handleDrop();
      }
      
      this.draggedElement = null;
      this.draggedBlock = null;
      this.dropTarget = null;
      this.dropPosition = null;
    });
  }
  
  setupSingleDropZone(block) {
    // 拖拽经过
    block.addEventListener('dragover', (e) => {
      e.preventDefault();
      
      if (!this.draggedBlock || block === this.draggedBlock) {
        return;
      }
      
      const rect = block.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
      
      // 清除之前的指示器
      this.clearDropIndicators();
      
      // 判断拖拽位置 - 基于AppFlowy的精确算法
      const leftThreshold = 88; // 左侧区域固定88px (AppFlowy标准)
      const rightThreshold = width * 4.0 / 5.0; // 右侧1/5区域
      const verticalThird = height / 3; // 垂直三等分
      
      let horizontalPosition = 'center';
      let verticalPosition = 'middle';
      
      // 水平位置检测
      if (x < leftThreshold) {
        horizontalPosition = 'left';
      } else if (x > rightThreshold) {
        horizontalPosition = 'right';
      } else {
        horizontalPosition = 'center';
      }
      
      // 垂直位置检测
      if (y < verticalThird) {
        verticalPosition = 'top';
      } else if (y < verticalThird * 2) {
        verticalPosition = 'middle';
      } else {
        verticalPosition = 'bottom';
      }
      
      // 根据位置组合决定拖拽行为
      if (horizontalPosition === 'right') {
        // 右边缘 - 创建右侧列
        this.dropPosition = 'right';
        const rightIndicator = block.querySelector('.drop-indicator.vertical.right');
        if (rightIndicator) rightIndicator.classList.add('show');
      } else if (horizontalPosition === 'left' && verticalPosition === 'middle') {
        // 左边缘中央 - 创建左侧列
        this.dropPosition = 'left';
        const leftIndicator = block.querySelector('.drop-indicator.vertical.left');
        if (leftIndicator) leftIndicator.classList.add('show');
      } else if (verticalPosition === 'top') {
        // 上三分之一 - 插入到前面
        this.dropPosition = 'before';
        const beforeIndicator = block.querySelector('.drop-indicator.horizontal.before');
        if (beforeIndicator) beforeIndicator.classList.add('show');
      } else {
        // 下三分之一 - 插入到后面
        this.dropPosition = 'after';
        const afterIndicator = block.querySelector('.drop-indicator.horizontal.after');
        if (afterIndicator) afterIndicator.classList.add('show');
      }
      
      this.dropTarget = block;
      block.classList.add('drag-over');
      
      // 自动滚动处理 - 基于AppFlowy的实现
      this.handleAutoScroll(e);
    });
    
    // 拖拽离开
    block.addEventListener('dragleave', (e) => {
      if (!block.contains(e.relatedTarget)) {
        block.classList.remove('drag-over');
        this.clearDropIndicators();
      }
    });
    
    // 放置
    block.addEventListener('drop', (e) => {
      e.preventDefault();
      console.log('Dropped on:', block.dataset.id, 'Position:', this.dropPosition);
    });
  }
  
  // 公开方法
  onReorder(callback) {
    this.container.addEventListener('blocksReordered', (e) => {
      callback(e.detail);
    });
  }
  
  getBlockOrder() {
    const blocks = this.container.querySelectorAll('.block');
    return Array.from(blocks).map(block => block.dataset.id);
  }
  
  // 自动滚动功能 - 基于AppFlowy实现
  handleAutoScroll(event) {
    const scrollZone = 50; // 边缘滚动区域
    const viewportHeight = window.innerHeight;
    const clientY = event.clientY;
    
    // 清除之前的滚动定时器
    if (this.autoScrollTimer) {
      clearInterval(this.autoScrollTimer);
      this.autoScrollTimer = null;
    }
    
    // 检查是否在上边缘
    if (clientY < scrollZone) {
      this.startAutoScroll(-this.scrollSpeed);
    } 
    // 检查是否在下边缘
    else if (clientY > viewportHeight - scrollZone) {
      this.startAutoScroll(this.scrollSpeed);
    }
  }
  
  startAutoScroll(direction) {
    this.autoScrollTimer = setInterval(() => {
      window.scrollBy(0, direction);
    }, 16); // 约60fps
  }
  
  stopAutoScroll() {
    if (this.autoScrollTimer) {
      clearInterval(this.autoScrollTimer);
      this.autoScrollTimer = null;
    }
  }
  
  // 改进的列比例重新分配 - 基于AppFlowy算法
  redistributeColumnRatios(columnsContainer, isAddingColumn = false) {
    const columns = columnsContainer.querySelectorAll('.column');
    const length = columns.length;
    
    if (isAddingColumn) {
      // 添加新列时，重新分配所有列的比例
      const ratios = Array.from(columns).map(column => {
        const currentRatio = parseFloat(column.style.flex || (1.0 / (length - 1)));
        return currentRatio * (length - 1) / length;
      });
      
      // 为新列分配1/length的比例
      ratios.push(1.0 / length);
      
      columns.forEach((column, index) => {
        column.style.flex = ratios[index];
      });
      
      // 更新调整手柄位置
      this.updateResizerPositions(columnsContainer);
    }
  }
  
  // 更新列调整手柄位置
  updateResizerPositions(columnsContainer) {
    const resizers = columnsContainer.querySelectorAll('.column-resizer');
    const columns = columnsContainer.querySelectorAll('.column');
    
    let cumulativeRatio = 0;
    resizers.forEach((resizer, index) => {
      if (index < columns.length - 1) {
        const columnRatio = parseFloat(columns[index].style.flex || 1);
        cumulativeRatio += columnRatio;
        const percentage = cumulativeRatio * 100;
        resizer.style.left = `calc(${percentage}% - 4px)`;
      }
    });
  }
  
  // 验证拖拽目标有效性 - 基于AppFlowy的shouldIgnoreDragTarget
  shouldIgnoreDragTarget(dragNode, targetNode) {
    if (!dragNode || !targetNode) {
      return true;
    }
    
    // 不能拖拽到自己身上
    if (dragNode === targetNode) {
      return true;
    }
    
    // 不能拖拽到自己的子节点
    if (targetNode.contains(dragNode)) {
      return true;
    }
    
    // 不能在表格内部拖拽（如果有表格支持的话）
    const dragInTable = dragNode.closest('.simple-table');
    const targetInTable = targetNode.closest('.simple-table');
    if (dragInTable && targetInTable && dragInTable !== targetInTable) {
      return true;
    }
    
    return false;
  }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
  const dragSystem = new MultiColumnDragSystem('.container');
  
  dragSystem.onReorder((detail) => {
    console.log('Blocks reordered:', detail);
  });
  
  window.multiColumnDragSystem = dragSystem;
});