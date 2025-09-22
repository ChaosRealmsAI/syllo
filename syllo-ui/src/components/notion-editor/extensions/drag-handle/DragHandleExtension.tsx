import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

const dragHandlePluginKey = new PluginKey('dragHandle');

interface DragHandleOptions {
  handleWidth?: number;
}

export const DragHandleExtension = Extension.create<DragHandleOptions>({
  name: 'dragHandle',

  addOptions() {
    return {
      handleWidth: 24,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: dragHandlePluginKey,
        props: {
          handleDOMEvents: {
            mousemove(view, event) {
              const { clientX, clientY } = event;
              const editorElement = view.dom as HTMLElement;
              const pos = view.posAtCoords({ left: clientX, top: clientY });

              if (!pos) return false;

              // Find the block element at cursor position
              const target = event.target as HTMLElement;
              const blockElement = target.closest('.ProseMirror > *') as HTMLElement;

              // Remove all existing handles
              const existingHandles = editorElement.querySelectorAll('.notion-drag-handle');
              existingHandles.forEach(handle => handle.remove());

              if (blockElement && editorElement.contains(blockElement)) {
                // Create drag handle
                const dragHandle = document.createElement('div');
                dragHandle.className = 'notion-drag-handle';
                dragHandle.draggable = true;
                dragHandle.contentEditable = 'false';
                dragHandle.innerHTML = `
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2" cy="2" r="0.8" fill="currentColor" />
                    <circle cx="6" cy="2" r="0.8" fill="currentColor" />
                    <circle cx="10" cy="2" r="0.8" fill="currentColor" />
                    <circle cx="2" cy="6" r="0.8" fill="currentColor" />
                    <circle cx="6" cy="6" r="0.8" fill="currentColor" />
                    <circle cx="10" cy="6" r="0.8" fill="currentColor" />
                    <circle cx="2" cy="10" r="0.8" fill="currentColor" />
                    <circle cx="6" cy="10" r="0.8" fill="currentColor" />
                    <circle cx="10" cy="10" r="0.8" fill="currentColor" />
                  </svg>
                `;

                // Style the drag handle
                dragHandle.style.position = 'absolute';
                dragHandle.style.left = '-35px';
                dragHandle.style.top = '0px';
                dragHandle.style.width = '24px';
                dragHandle.style.height = '24px';
                dragHandle.style.display = 'flex';
                dragHandle.style.alignItems = 'center';
                dragHandle.style.justifyContent = 'center';
                dragHandle.style.cursor = 'grab';
                dragHandle.style.opacity = '0';
                dragHandle.style.transition = 'opacity 0.2s';
                dragHandle.style.color = 'rgba(55, 53, 47, 0.45)';
                dragHandle.style.borderRadius = '3px';
                dragHandle.style.zIndex = '10';

                // Make it visible on hover
                setTimeout(() => {
                  dragHandle.style.opacity = '1';
                }, 10);

                // Ensure the block element is positioned relatively
                if (getComputedStyle(blockElement).position === 'static') {
                  blockElement.style.position = 'relative';
                }

                blockElement.appendChild(dragHandle);

                // Handle hover effect
                dragHandle.addEventListener('mouseenter', () => {
                  dragHandle.style.backgroundColor = 'rgba(55, 53, 47, 0.08)';
                });

                dragHandle.addEventListener('mouseleave', () => {
                  dragHandle.style.backgroundColor = 'transparent';
                });

                // Drag functionality
                let draggedElement: HTMLElement | null = null;

                dragHandle.addEventListener('dragstart', (e) => {
                  e.stopPropagation();
                  draggedElement = blockElement;
                  blockElement.style.opacity = '0.5';
                  e.dataTransfer!.effectAllowed = 'move';
                  e.dataTransfer!.setData('text/plain', ''); // Required for Firefox
                });

                dragHandle.addEventListener('dragend', () => {
                  if (draggedElement) {
                    draggedElement.style.opacity = '1';
                    draggedElement = null;
                  }
                  // Clean up drag-over indicators
                  editorElement.querySelectorAll('.drag-indicator').forEach(el => el.remove());
                });

                // Set up drop zones on all blocks
                const blocks = editorElement.querySelectorAll('.ProseMirror > *');
                blocks.forEach((block) => {
                  const blockEl = block as HTMLElement;

                  blockEl.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Remove existing indicators
                    editorElement.querySelectorAll('.drag-indicator').forEach(el => el.remove());

                    // Add drop indicator
                    const indicator = document.createElement('div');
                    indicator.className = 'drag-indicator';
                    indicator.style.position = 'absolute';
                    indicator.style.left = '0';
                    indicator.style.right = '0';
                    indicator.style.height = '2px';
                    indicator.style.backgroundColor = 'rgb(46, 170, 220)';
                    indicator.style.zIndex = '100';

                    const rect = blockEl.getBoundingClientRect();
                    const y = e.clientY - rect.top;

                    if (y < rect.height / 2) {
                      indicator.style.top = '-1px';
                    } else {
                      indicator.style.bottom = '-1px';
                    }

                    blockEl.style.position = 'relative';
                    blockEl.appendChild(indicator);
                  });

                  blockEl.addEventListener('drop', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (draggedElement && draggedElement !== blockEl) {
                      const rect = blockEl.getBoundingClientRect();
                      const y = e.clientY - rect.top;

                      if (y < rect.height / 2) {
                        blockEl.parentNode?.insertBefore(draggedElement, blockEl);
                      } else {
                        blockEl.parentNode?.insertBefore(draggedElement, blockEl.nextSibling);
                      }
                    }

                    // Clean up
                    editorElement.querySelectorAll('.drag-indicator').forEach(el => el.remove());
                  });
                });
              }

              return false;
            },

            mouseleave(view, event) {
              const editorElement = view.dom as HTMLElement;
              const relatedTarget = event.relatedTarget as HTMLElement;

              // Only remove handles if we're leaving the editor
              if (!editorElement.contains(relatedTarget)) {
                setTimeout(() => {
                  const handles = editorElement.querySelectorAll('.notion-drag-handle');
                  handles.forEach(handle => handle.remove());
                }, 200);
              }

              return false;
            },
          },
        },
      }),
    ];
  },
});