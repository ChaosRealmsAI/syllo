'use client'

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TableGridSelection } from '../types';

interface TableGridSelectorProps {
  onSelect?: (selection: TableGridSelection) => void;
}

const TableGridSelector: React.FC<TableGridSelectorProps> = ({ onSelect }) => {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const maxRows = 8;
  const maxCols = 8;

  const handleCellClick = (row: number, col: number) => {
    onSelect?.({ rows: row, cols: col });
  };

  return (
    <div className="p-2">
      <div
        className="grid grid-cols-8 gap-0.5"
        onMouseLeave={() => setHoveredCell(null)}
      >
        {Array.from({ length: maxRows * maxCols }).map((_, index) => {
          const row = Math.floor(index / maxCols) + 1;
          const col = (index % maxCols) + 1;
          const isHighlighted = hoveredCell && row <= hoveredCell.row && col <= hoveredCell.col;

          return (
            <div
              key={index}
              className={cn(
                "h-5 w-5 border border-gray-300 dark:border-neutral-700 cursor-pointer transition-all",
                isHighlighted ? "bg-blue-100 dark:bg-blue-950 border-blue-500 dark:border-blue-400" : "bg-white dark:bg-neutral-900 hover:border-gray-400 dark:hover:border-neutral-600"
              )}
              onMouseEnter={() => setHoveredCell({ row, col })}
              onClick={() => handleCellClick(row, col)}
            />
          );
        })}
      </div>
      <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
        {hoveredCell ? `${hoveredCell.row} × ${hoveredCell.col} 表格` : '插入表格'}
      </div>
    </div>
  );
};

export default TableGridSelector;