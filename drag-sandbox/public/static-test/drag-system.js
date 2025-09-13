// Block拖拽系统 - 类Notion实现
// 包含：拖拽排序、多列布局、视觉反馈、自动滚动等功能

class DragSystem {
    constructor() {
        this.draggedElement = null;
        this.draggedClone = null;
        this.dropIndicator = null;
        this.autoScrollInterval = null;
        this.selectedBlock = null;
        this.blockIdCounter = 10;
        
        this.init();
    }

    init() {
        this.setupDragListeners();
        this.setupContextMenu();
        this.setupAutoScroll();
        this.setupColumnResizing();
    }

    // 设置拖拽监听器
    setupDragListeners() {
        const container = document.getElementById('blocksContainer');
        
        // 使用事件委托处理所有拖拽事件
        container.addEventListener('dragstart', this.handleDragStart.bind(this));
        container.addEventListener('dragend', this.handleDragEnd.bind(this));
        container.addEventListener('dragover', this.handleDragOver.bind(this));
        container.addEventListener('drop', this.handleDrop.bind(this));
        container.addEventListener('dragleave', this.handleDragLeave.bind(this));
        
        // 处理鼠标悬停显示拖拽手柄
        container.addEventListener('mouseover', (e) => {
            const block = e.target.closest('.block');
            if (block && !block.classList.contains('dragging')) {
                const handle = block.querySelector('.drag-handle');
                if (handle) {
                    handle.style.opacity = '0.5';
                }
            }
        });
        
        container.addEventListener('mouseout', (e) => {
            const block = e.target.closest('.block');
            if (block) {
                const handle = block.querySelector('.drag-handle');
                if (handle && !e.relatedTarget?.closest('.block')) {
                    handle.style.opacity = '0';
                }
            }
        });
    }

    // 拖拽开始
    handleDragStart(e) {
        const block = e.target.closest('.block');
        if (!block) return;
        
        this.draggedElement = block;
        block.classList.add('dragging');
        
        // 创建拖拽幽灵元素
        this.createDragGhost(block, e);
        
        // 创建拖拽指示器
        this.createDropIndicator();
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', block.innerHTML);
    }

    // 拖拽结束
    handleDragEnd(e) {
        if (this.draggedElement) {
            this.draggedElement.classList.remove('dragging');
            this.draggedElement = null;
        }
        
        // 清理拖拽指示器
        this.hideDropIndicator();
        
        // 清理所有drag-over状态
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });
        
        // 停止自动滚动
        this.stopAutoScroll();
    }

    // 拖拽经过
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const target = e.target;
        const block = target.closest('.block:not(.dragging)');
        const column = target.closest('.column');
        const columnContainer = target.closest('.column-container');
        
        // 处理列容器的拖放
        if (column && this.draggedElement) {
            column.classList.add('drag-over');
            this.showDropIndicatorInColumn(column, e);
            return;
        }
        
        // 处理普通块的拖放 - 增强左右检测
        if (block && this.draggedElement) {
            const rect = block.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const width = rect.width;
            const height = rect.height;
            
            // 清除之前的指示器
            this.hideDropIndicator();
            
            // 边缘检测阈值
            const edgeThreshold = width * 0.2; // 左右各20%区域用于创建列
            
            if (x < edgeThreshold) {
                // 左边缘 - 创建左侧列
                this.dropPosition = 'left';
                this.showSideIndicator(block, 'left');
            } else if (x > width - edgeThreshold) {
                // 右边缘 - 创建右侧列
                this.dropPosition = 'right';
                this.showSideIndicator(block, 'right');
            } else if (y < height / 2) {
                // 上半部分 - 插入到前面
                this.dropPosition = 'before';
                this.showDropIndicator(block, 'before');
            } else {
                // 下半部分 - 插入到后面
                this.dropPosition = 'after';
                this.showDropIndicator(block, 'after');
            }
            
            this.dropTarget = block;
        }
        
        // 处理容器边缘的自动滚动
        this.checkAutoScroll(e);
    }

    // 处理拖放
    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!this.draggedElement) return;
        
        // 使用已经在dragOver中设置的dropTarget
        if (!this.dropTarget) {
            const target = e.target;
            const targetBlock = target.closest('.block:not(.dragging)');
            const targetColumn = target.closest('.column');
            
            // 处理拖放到列中
            if (targetColumn && !targetBlock) {
                this.dropInColumn(targetColumn);
                return;
            }
            
            this.dropTarget = targetBlock;
        }
        
        // 处理拖放到块上
        if (this.dropTarget) {
            // 根据dropPosition决定操作
            if (this.dropPosition === 'left' || this.dropPosition === 'right') {
                // 创建或添加到多列布局
                this.createOrAddToColumns(this.dropTarget);
            } else if (this.dropPosition === 'before' || this.dropPosition === 'after') {
                // 普通的上下拖拽
                if (this.dropPosition === 'before') {
                    this.dropTarget.parentNode.insertBefore(this.draggedElement, this.dropTarget);
                } else {
                    this.dropTarget.parentNode.insertBefore(this.draggedElement, this.dropTarget.nextSibling);
                }
                
                // 添加成功动画
                this.animateDropSuccess(this.draggedElement);
            }
        }
    }

    // 拖拽离开
    handleDragLeave(e) {
        const target = e.target;
        const column = target.closest('.column');
        
        if (column && !e.relatedTarget?.closest('.column')) {
            column.classList.remove('drag-over');
        }
    }

    // 创建拖拽幽灵元素
    createDragGhost(block, e) {
        const ghost = document.createElement('div');
        ghost.className = 'drag-ghost';
        ghost.innerHTML = block.querySelector('span').innerText;
        ghost.style.position = 'fixed';
        ghost.style.pointerEvents = 'none';
        ghost.style.zIndex = '1000';
        document.body.appendChild(ghost);
        
        // 设置拖拽图像
        e.dataTransfer.setDragImage(ghost, 0, 0);
        
        // 延迟移除幽灵元素
        setTimeout(() => ghost.remove(), 0);
    }

    // 创建拖拽指示器
    createDropIndicator() {
        if (!this.dropIndicator) {
            this.dropIndicator = document.createElement('div');
            this.dropIndicator.className = 'drop-indicator';
        }
    }

    // 显示拖拽指示器
    showDropIndicator(element, position) {
        if (!this.dropIndicator) return;
        
        // 重置样式
        this.dropIndicator.className = 'drop-indicator active';
        this.dropIndicator.style.position = '';
        this.dropIndicator.style.width = '';
        this.dropIndicator.style.height = '';
        this.dropIndicator.style.top = '';
        this.dropIndicator.style.left = '';
        this.dropIndicator.style.right = '';
        
        if (position === 'before') {
            element.parentNode.insertBefore(this.dropIndicator, element);
        } else {
            element.parentNode.insertBefore(this.dropIndicator, element.nextSibling);
        }
    }

    // 在列中显示拖拽指示器
    showDropIndicatorInColumn(column, e) {
        const blocks = column.querySelectorAll('.block:not(.dragging)');
        
        if (!this.dropIndicator) {
            this.createDropIndicator();
        }
        
        // 清除垂直类
        this.dropIndicator.classList.remove('vertical');
        this.dropIndicator.classList.add('active');
        
        if (blocks.length === 0) {
            // 列为空，显示在列中央
            this.dropIndicator.style.position = 'relative';
            this.dropIndicator.style.width = '100%';
            this.dropIndicator.style.height = '2px';
            column.appendChild(this.dropIndicator);
            return;
        }
        
        let targetBlock = null;
        let insertPosition = 'after';
        
        // 找到插入位置
        for (let block of blocks) {
            const rect = block.getBoundingClientRect();
            if (e.clientY < rect.top + rect.height / 2) {
                targetBlock = block;
                insertPosition = 'before';
                break;
            }
            targetBlock = block;
        }
        
        if (targetBlock) {
            this.showDropIndicator(targetBlock, insertPosition);
        }
    }

    // 隐藏拖拽指示器
    hideDropIndicator() {
        if (this.dropIndicator) {
            this.dropIndicator.classList.remove('active');
            if (this.dropIndicator.parentNode) {
                this.dropIndicator.parentNode.removeChild(this.dropIndicator);
            }
        }
    }

    // 显示侧边指示器（左右拖拽）
    showSideIndicator(element, side) {
        if (!this.dropIndicator) {
            this.createDropIndicator();
        }
        
        // 清除之前的类
        this.dropIndicator.className = 'drop-indicator active vertical';
        
        // 获取元素位置
        const rect = element.getBoundingClientRect();
        const containerRect = document.getElementById('blocksContainer').getBoundingClientRect();
        
        // 设置指示器样式
        this.dropIndicator.style.position = 'absolute';
        this.dropIndicator.style.height = rect.height + 'px';
        this.dropIndicator.style.top = (rect.top - containerRect.top) + 'px';
        
        if (side === 'left') {
            this.dropIndicator.style.left = (rect.left - containerRect.left - 2) + 'px';
        } else {
            this.dropIndicator.style.left = (rect.right - containerRect.left - 2) + 'px';
        }
        
        // 添加到容器中
        document.getElementById('blocksContainer').appendChild(this.dropIndicator);
    }

    // 创建或添加到多列布局
    createOrAddToColumns(targetBlock) {
        const targetParent = targetBlock.parentNode;
        
        // 检查目标是否已经在列中
        if (targetParent.classList.contains('column')) {
            // 已在列中，添加新列
            this.addColumnToContainer(targetParent.parentNode, targetBlock);
        } else {
            // 不在列中，创建新的多列容器
            this.createNewColumnContainer(targetBlock);
        }
    }

    // 创建新的多列容器
    createNewColumnContainer(targetBlock) {
        const container = document.createElement('div');
        container.className = 'column-container';
        container.setAttribute('data-block-id', Date.now());
        
        // 创建两个初始列
        const leftColumn = document.createElement('div');
        leftColumn.className = 'column';
        leftColumn.setAttribute('data-column', '1');
        
        const rightColumn = document.createElement('div');
        rightColumn.className = 'column';
        rightColumn.setAttribute('data-column', '2');
        
        // 根据拖拽位置决定块的位置
        if (this.dropPosition === 'left') {
            leftColumn.appendChild(this.draggedElement);
            rightColumn.appendChild(targetBlock);
        } else {
            leftColumn.appendChild(targetBlock);
            rightColumn.appendChild(this.draggedElement);
        }
        
        // 添加列分割线
        const divider = document.createElement('div');
        divider.className = 'column-divider';
        
        container.appendChild(leftColumn);
        container.appendChild(divider);
        container.appendChild(rightColumn);
        
        // 插入新容器到原位置
        const parent = targetBlock.parentNode;
        parent.insertBefore(container, targetBlock.nextSibling);
        
        // 删除原有的单独块（因为已经移动到列中了）
        if (targetBlock.parentNode === parent) {
            targetBlock.remove();
        }
        
        // 重新初始化事件
        this.setupColumnResizing();
        this.animateDropSuccess(this.draggedElement);
    }

    // 添加列到现有容器
    addColumnToContainer(columnContainer, targetBlock) {
        const targetColumn = targetBlock.parentNode;
        const columns = Array.from(columnContainer.querySelectorAll('.column'));
        const targetIndex = columns.indexOf(targetColumn);
        
        // 创建新列
        const newColumn = document.createElement('div');
        newColumn.className = 'column';
        newColumn.setAttribute('data-column', columns.length + 1);
        newColumn.appendChild(this.draggedElement);
        
        // 创建新的分割线
        const divider = document.createElement('div');
        divider.className = 'column-divider';
        
        // 根据位置插入新列
        if (this.dropPosition === 'left') {
            // 在目标列左边插入：新列 -> 分隔线 -> 目标列
            columnContainer.insertBefore(newColumn, targetColumn);
            columnContainer.insertBefore(divider, targetColumn);
        } else {
            // 在目标列右边插入：目标列 -> 分隔线 -> 新列
            const nextElement = targetColumn.nextElementSibling;
            if (nextElement) {
                columnContainer.insertBefore(divider, nextElement);
                columnContainer.insertBefore(newColumn, nextElement);
            } else {
                columnContainer.appendChild(divider);
                columnContainer.appendChild(newColumn);
            }
        }
        
        // 重新调整所有列的宽度
        this.redistributeColumns(columnContainer);
        
        // 重新初始化事件
        this.setupColumnResizing();
        this.animateDropSuccess(this.draggedElement);
    }

    // 重新分配列宽度
    redistributeColumns(container) {
        const columns = container.querySelectorAll('.column');
        const columnCount = columns.length;
        const flexValue = 1 / columnCount;
        
        columns.forEach(column => {
            column.style.flex = flexValue;
        });
    }

    // 拖放到列中
    dropInColumn(column) {
        if (this.draggedElement) {
            column.appendChild(this.draggedElement);
            this.animateDropSuccess(this.draggedElement);
        }
    }

    // 拖放成功动画
    animateDropSuccess(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'dragSuccess 1.2s ease-out';
        }, 10);
    }

    // 设置自动滚动
    setupAutoScroll() {
        const scrollZones = {
            top: document.getElementById('scrollZoneTop'),
            bottom: document.getElementById('scrollZoneBottom')
        };
        
        // 监听拖拽时的自动滚动
        document.addEventListener('dragover', (e) => {
            if (!this.draggedElement) return;
            
            const viewportHeight = window.innerHeight;
            const scrollThreshold = 100;
            
            if (e.clientY < scrollThreshold) {
                this.startAutoScroll('up');
            } else if (e.clientY > viewportHeight - scrollThreshold) {
                this.startAutoScroll('down');
            } else {
                this.stopAutoScroll();
            }
        });
    }

    // 开始自动滚动
    startAutoScroll(direction) {
        if (this.autoScrollInterval) return;
        
        const scrollSpeed = 5;
        this.autoScrollInterval = setInterval(() => {
            if (direction === 'up') {
                window.scrollBy(0, -scrollSpeed);
            } else {
                window.scrollBy(0, scrollSpeed);
            }
        }, 16);
    }

    // 停止自动滚动
    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }

    // 检查自动滚动
    checkAutoScroll(e) {
        const container = document.getElementById('blocksContainer');
        const rect = container.getBoundingClientRect();
        const scrollThreshold = 50;
        
        if (e.clientY - rect.top < scrollThreshold) {
            container.scrollTop -= 10;
        } else if (rect.bottom - e.clientY < scrollThreshold) {
            container.scrollTop += 10;
        }
    }

    // 设置右键菜单
    setupContextMenu() {
        const container = document.getElementById('blocksContainer');
        const contextMenu = document.getElementById('contextMenu');
        
        container.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            const block = e.target.closest('.block');
            if (!block) return;
            
            this.selectedBlock = block;
            
            contextMenu.style.left = e.pageX + 'px';
            contextMenu.style.top = e.pageY + 'px';
            contextMenu.classList.add('show');
        });
        
        document.addEventListener('click', () => {
            contextMenu.classList.remove('show');
        });
    }

    // 设置列宽调整
    setupColumnResizing() {
        const dividers = document.querySelectorAll('.column-divider');
        
        dividers.forEach(divider => {
            let isResizing = false;
            let startX = 0;
            let startWidths = [];
            
            divider.addEventListener('mousedown', (e) => {
                isResizing = true;
                startX = e.clientX;
                
                const container = divider.parentElement;
                const columns = container.querySelectorAll('.column');
                startWidths = Array.from(columns).map(col => col.offsetWidth);
                
                document.body.style.cursor = 'col-resize';
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isResizing) return;
                
                const dx = e.clientX - startX;
                const container = divider.parentElement;
                const columns = container.querySelectorAll('.column');
                
                if (columns.length >= 2) {
                    const leftColumn = columns[0];
                    const rightColumn = columns[1];
                    
                    leftColumn.style.flex = 'none';
                    rightColumn.style.flex = 'none';
                    
                    leftColumn.style.width = (startWidths[0] + dx) + 'px';
                    rightColumn.style.width = (startWidths[1] - dx) + 'px';
                }
            });
            
            document.addEventListener('mouseup', () => {
                if (isResizing) {
                    isResizing = false;
                    document.body.style.cursor = '';
                }
            });
        });
    }
}

// 全局函数

// 添加新块
function addNewBlock() {
    const container = document.getElementById('blocksContainer');
    const blockId = Date.now();
    
    const newBlock = document.createElement('div');
    newBlock.className = 'block block-text';
    newBlock.draggable = true;
    newBlock.setAttribute('data-block-id', blockId);
    newBlock.innerHTML = `
        <div class="drag-handle"></div>
        <span>新的文本块</span>
        <div class="block-actions">
            <button class="action-btn" onclick="deleteBlock(this)">🗑</button>
            <button class="action-btn" onclick="convertToColumn(this)">⊞</button>
        </div>
    `;
    
    container.appendChild(newBlock);
    
    // 添加动画效果
    newBlock.style.animation = 'dragSuccess 0.5s ease-out';
}

// 删除块
function deleteBlock(button) {
    const block = button.closest('.block');
    if (!block) return;
    
    const parent = block.parentNode;
    
    // 添加删除动画
    block.style.animation = 'fadeOut 0.3s ease-out';
    
    setTimeout(() => {
        block.remove();
        
        // 如果块在列中，检查列是否为空
        if (parent.classList.contains('column')) {
            const columnContainer = parent.parentNode;
            const remainingBlocks = parent.querySelectorAll('.block');
            
            if (remainingBlocks.length === 0) {
                // 列为空，检查是否需要删除整个多列容器
                const columns = columnContainer.querySelectorAll('.column');
                
                if (columns.length <= 2) {
                    // 只剩一列了，将另一列的内容移出并删除容器
                    const otherColumn = Array.from(columns).find(c => c !== parent);
                    const blocks = otherColumn.querySelectorAll('.block');
                    const containerParent = columnContainer.parentNode;
                    
                    // 将剩余的块移出
                    blocks.forEach(b => {
                        containerParent.insertBefore(b, columnContainer);
                    });
                    
                    // 删除整个容器
                    columnContainer.remove();
                } else {
                    // 还有多列，只删除当前空列和相邻的分隔线
                    const prevSibling = parent.previousElementSibling;
                    const nextSibling = parent.nextElementSibling;
                    
                    if (prevSibling && prevSibling.classList.contains('column-divider')) {
                        prevSibling.remove();
                    } else if (nextSibling && nextSibling.classList.contains('column-divider')) {
                        nextSibling.remove();
                    }
                    
                    parent.remove();
                    
                    // 重新分配列宽
                    dragSystem.redistributeColumns(columnContainer);
                }
            }
        }
    }, 300);
}

// 转换为多列
function convertToColumn(button) {
    const block = button.closest('.block');
    if (!block) return;
    
    const parent = block.parentNode;
    
    // 如果已经在列中，添加新列
    if (parent.classList.contains('column')) {
        const columnContainer = parent.parentNode;
        const newColumn = document.createElement('div');
        newColumn.className = 'column';
        newColumn.setAttribute('data-column', columnContainer.querySelectorAll('.column').length + 1);
        
        const newBlock = document.createElement('div');
        newBlock.className = 'block block-text';
        newBlock.draggable = true;
        newBlock.setAttribute('data-block-id', Date.now());
        newBlock.innerHTML = `
            <div class="drag-handle"></div>
            <span>新列内容</span>
            <div class="block-actions">
                <button class="action-btn" onclick="deleteBlock(this)">🗑</button>
            </div>
        `;
        
        newColumn.appendChild(newBlock);
        
        // 添加分割线
        const divider = document.createElement('div');
        divider.className = 'column-divider';
        
        columnContainer.appendChild(divider);
        columnContainer.appendChild(newColumn);
        
        // 重新分配列宽
        dragSystem.redistributeColumns(columnContainer);
    } else {
        // 不在列中，创建新的多列容器
        const container = document.createElement('div');
        container.className = 'column-container';
        container.setAttribute('data-block-id', Date.now());
        
        const leftColumn = document.createElement('div');
        leftColumn.className = 'column';
        leftColumn.setAttribute('data-column', '1');
        leftColumn.appendChild(block);
        
        const rightColumn = document.createElement('div');
        rightColumn.className = 'column';
        rightColumn.setAttribute('data-column', '2');
        
        const newBlock = document.createElement('div');
        newBlock.className = 'block block-text';
        newBlock.draggable = true;
        newBlock.setAttribute('data-block-id', Date.now() + 1);
        newBlock.innerHTML = `
            <div class="drag-handle"></div>
            <span>新列内容</span>
            <div class="block-actions">
                <button class="action-btn" onclick="deleteBlock(this)">🗑</button>
            </div>
        `;
        rightColumn.appendChild(newBlock);
        
        const divider = document.createElement('div');
        divider.className = 'column-divider';
        
        container.appendChild(leftColumn);
        container.appendChild(divider);
        container.appendChild(rightColumn);
        
        parent.insertBefore(container, block.nextSibling);
    }
    
    // 重新初始化列宽调整
    dragSystem.setupColumnResizing();
}

// 改变块类型
function changeBlockType(type) {
    if (!dragSystem.selectedBlock) return;
    
    const block = dragSystem.selectedBlock;
    const content = block.querySelector('span').innerText;
    
    // 移除所有类型类
    block.classList.remove('block-text', 'block-heading', 'block-todo', 'block-quote');
    
    // 根据类型添加相应的类和内容
    switch(type) {
        case 'heading':
            block.classList.add('block-heading');
            block.innerHTML = `
                <div class="drag-handle"></div>
                <span>${content}</span>
                <div class="block-actions">
                    <button class="action-btn" onclick="deleteBlock(this)">🗑</button>
                    <button class="action-btn" onclick="convertToColumn(this)">⊞</button>
                </div>
            `;
            break;
        case 'todo':
            block.classList.add('block-todo');
            block.innerHTML = `
                <div class="drag-handle"></div>
                <input type="checkbox">
                <span>${content}</span>
                <div class="block-actions">
                    <button class="action-btn" onclick="deleteBlock(this)">🗑</button>
                    <button class="action-btn" onclick="convertToColumn(this)">⊞</button>
                </div>
            `;
            break;
        case 'quote':
            block.classList.add('block-quote');
            block.innerHTML = `
                <div class="drag-handle"></div>
                <span>"${content}"</span>
                <div class="block-actions">
                    <button class="action-btn" onclick="deleteBlock(this)">🗑</button>
                    <button class="action-btn" onclick="convertToColumn(this)">⊞</button>
                </div>
            `;
            break;
        default:
            block.classList.add('block-text');
            block.innerHTML = `
                <div class="drag-handle"></div>
                <span>${content}</span>
                <div class="block-actions">
                    <button class="action-btn" onclick="deleteBlock(this)">🗑</button>
                    <button class="action-btn" onclick="convertToColumn(this)">⊞</button>
                </div>
            `;
    }
}

// 复制块
function duplicateBlock() {
    if (!dragSystem.selectedBlock) return;
    
    const block = dragSystem.selectedBlock;
    const clone = block.cloneNode(true);
    const newId = Date.now();
    clone.setAttribute('data-block-id', newId);
    
    block.parentNode.insertBefore(clone, block.nextSibling);
    
    // 添加动画效果
    clone.style.animation = 'dragSuccess 0.5s ease-out';
}

// 删除选中的块
function deleteSelectedBlock() {
    if (!dragSystem.selectedBlock) return;
    deleteBlock(dragSystem.selectedBlock);
}

// 添加淡出动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
    
    @keyframes dragSuccess {
        0% {
            background-color: #e6f4ff;
            transform: scale(1.02);
        }
        50% {
            background-color: #e6f4ff;
        }
        100% {
            background-color: transparent;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// 初始化拖拽系统
let dragSystem;
document.addEventListener('DOMContentLoaded', () => {
    dragSystem = new DragSystem();
    console.log('🚀 拖拽系统已初始化');
});