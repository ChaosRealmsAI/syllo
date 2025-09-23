'use client'

import React from 'react';
import { Separator } from '@/components/ui/separator';
import FlattenIconGrid from './FlattenIconGrid';
import MenuItem from './MenuItem';
import TableGridSelector from './submenus/TableGridSelector';
import ColumnLayoutSelector from './submenus/ColumnLayoutSelector';
import { menuSections, flattenGridItems } from './menuData';
import { cn } from '@/lib/utils';
import { MenuSection, FlattenGridItem } from './types';

interface SlashMenuProps {
  sections?: MenuSection[];      // 可选的自定义菜单数据
  gridItems?: FlattenGridItem[]; // 可选的自定义网格项
  onItemClick?: (item: any) => void;
}

const SlashMenu: React.FC<SlashMenuProps> = ({
  sections = menuSections,
  gridItems = flattenGridItems,
  onItemClick
}) => {
  return (
    <div className="w-[280px] max-h-[400px] overflow-y-auto overflow-x-hidden rounded-lg bg-white dark:bg-neutral-900 shadow-lg border border-gray-200 dark:border-neutral-800 custom-scrollbar">
      {sections.map((section, index) => (
        <div key={section.id}>
          {index > 0 && <Separator className="my-1" />}

          {/* Section Title */}
          <div className="px-3 py-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            {section.title}
          </div>

          {/* Section Content */}
          {section.type === 'flatten-grid' ? (
            <FlattenIconGrid
              items={gridItems}
              onItemClick={onItemClick}
            />
          ) : (
            <div>
              {section.items.map((item) => {
                // Special handling for table submenu
                if (item.id === 'table') {
                  return (
                    <MenuItem
                      key={item.id}
                      item={item}
                      onItemClick={onItemClick}
                    >
                      <TableGridSelector
                        onSelect={(selection) => {
                          onItemClick?.({
                            ...item,
                            data: selection
                          });
                        }}
                      />
                    </MenuItem>
                  );
                }

                // Special handling for column layout submenu
                if (item.id === 'grid') {
                  return (
                    <MenuItem
                      key={item.id}
                      item={item}
                      onItemClick={onItemClick}
                    >
                      <ColumnLayoutSelector
                        onSelect={(option) => {
                          onItemClick?.({
                            ...item,
                            data: option.data
                          });
                        }}
                      />
                    </MenuItem>
                  );
                }

                // Regular menu items or items with standard submenus
                return (
                  <MenuItem
                    key={item.id}
                    item={item}
                    onItemClick={onItemClick}
                  />
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SlashMenu;