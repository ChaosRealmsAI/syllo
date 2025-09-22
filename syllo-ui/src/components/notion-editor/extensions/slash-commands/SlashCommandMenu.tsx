import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { CommandItem } from './commands';

interface SlashCommandMenuProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

export const SlashCommandMenu = forwardRef<any, SlashCommandMenuProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = items[index];
      if (item) {
        command(item);
      }
    };

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }

        if (event.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }

        if (event.key === 'Enter') {
          selectItem(selectedIndex);
          return true;
        }

        return false;
      },
    }));

    return (
      <div className="slash-command-menu">
        {items.length ? (
          items.map((item, index) => (
            <button
              className={`slash-command-item ${
                index === selectedIndex ? 'is-selected' : ''
              }`}
              key={index}
              onClick={() => selectItem(index)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="slash-command-icon">{item.icon}</span>
              <div className="slash-command-content">
                <div className="slash-command-title">{item.title}</div>
                <div className="slash-command-description">{item.description}</div>
              </div>
            </button>
          ))
        ) : (
          <div className="slash-command-empty">没有找到命令</div>
        )}
      </div>
    );
  }
);

SlashCommandMenu.displayName = 'SlashCommandMenu';