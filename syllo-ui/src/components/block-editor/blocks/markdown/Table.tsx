"use client";

import React, { useState } from "react";
import styles from "../../styles/editor.module.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus, MoreHorizontal } from "lucide-react";

export interface TableData {
  headers: string[];
  rows: string[][];
  alignments?: ("left" | "center" | "right")[];
}

interface EditorTableProps {
  data: TableData;
  editable?: boolean;
  onChange?: (data: TableData) => void;
}

export const EditorTable: React.FC<EditorTableProps> = ({
  data,
  editable = false,
  onChange,
}) => {
  const [editingCell, setEditingCell] = useState<{row: number, col: number} | null>(null);
  const [cellValue, setCellValue] = useState("");

  const handleCellEdit = (rowIndex: number, colIndex: number, value: string) => {
    if (!onChange) return;

    const newData = { ...data };
    if (rowIndex === -1) {
      // 编辑表头
      newData.headers[colIndex] = value;
    } else {
      // 编辑数据行
      newData.rows[rowIndex][colIndex] = value;
    }
    onChange(newData);
  };

  const addRow = () => {
    if (!onChange) return;
    const newRow = new Array(data.headers.length).fill("");
    onChange({
      ...data,
      rows: [...data.rows, newRow]
    });
  };

  const removeRow = (index: number) => {
    if (!onChange || data.rows.length <= 1) return;
    onChange({
      ...data,
      rows: data.rows.filter((_, i) => i !== index)
    });
  };

  const addColumn = () => {
    if (!onChange) return;
    onChange({
      headers: [...data.headers, "新列"],
      rows: data.rows.map(row => [...row, ""]),
      alignments: [...(data.alignments || []), "left"]
    });
  };

  const removeColumn = (index: number) => {
    if (!onChange || data.headers.length <= 1) return;
    onChange({
      headers: data.headers.filter((_, i) => i !== index),
      rows: data.rows.map(row => row.filter((_, i) => i !== index)),
      alignments: data.alignments?.filter((_, i) => i !== index)
    });
  };

  const setColumnAlignment = (colIndex: number, alignment: "left" | "center" | "right") => {
    if (!onChange) return;
    const newAlignments = [...(data.alignments || new Array(data.headers.length).fill("left"))];
    newAlignments[colIndex] = alignment;
    onChange({
      ...data,
      alignments: newAlignments
    });
  };

  const startEdit = (rowIndex: number, colIndex: number) => {
    if (!editable) return;
    const value = rowIndex === -1 ? data.headers[colIndex] : data.rows[rowIndex][colIndex];
    setCellValue(value);
    setEditingCell({ row: rowIndex, col: colIndex });
  };

  const finishEdit = () => {
    if (editingCell) {
      handleCellEdit(editingCell.row, editingCell.col, cellValue);
      setEditingCell(null);
      setCellValue("");
    }
  };

  const getTextAlign = (colIndex: number) => {
    return data.alignments?.[colIndex] || "left";
  };

  return (
    <div className={`${styles.tableWrapper} border border-border rounded-md overflow-hidden`}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {data.headers.map((header, colIndex) => (
              <TableHead
                key={colIndex}
                className={`relative group cursor-pointer`}
                style={{ textAlign: getTextAlign(colIndex) }}
                onClick={() => startEdit(-1, colIndex)}
              >
                {editingCell?.row === -1 && editingCell?.col === colIndex ? (
                  <Input
                    value={cellValue}
                    onChange={(e) => setCellValue(e.target.value)}
                    onBlur={finishEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") finishEdit();
                      if (e.key === "Escape") setEditingCell(null);
                    }}
                    className="h-8 text-sm"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <span>{header}</span>
                    {editable && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <Select
                          value={getTextAlign(colIndex)}
                          onValueChange={(value: "left" | "center" | "right") =>
                            setColumnAlignment(colIndex, value)
                          }
                        >
                          <SelectTrigger className="h-6 w-16 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">左对齐</SelectItem>
                            <SelectItem value="center">居中</SelectItem>
                            <SelectItem value="right">右对齐</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeColumn(colIndex);
                          }}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TableHead>
            ))}
            {editable && (
              <TableHead className="w-12">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addColumn}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="group">
              {row.map((cell, colIndex) => (
                <TableCell
                  key={colIndex}
                  className="cursor-pointer"
                  style={{ textAlign: getTextAlign(colIndex) }}
                  onClick={() => startEdit(rowIndex, colIndex)}
                >
                  {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                    <Input
                      value={cellValue}
                      onChange={(e) => setCellValue(e.target.value)}
                      onBlur={finishEdit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") finishEdit();
                        if (e.key === "Escape") setEditingCell(null);
                      }}
                      className="h-8 text-sm"
                      autoFocus
                    />
                  ) : (
                    cell || (editable ? "点击编辑" : "")
                  )}
                </TableCell>
              ))}
              {editable && (
                <TableCell className="w-12">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRow(rowIndex)}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editable && (
        <div className="p-2 border-t bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={addRow}
            className="w-full h-8 text-sm"
          >
            <Plus className="h-3 w-3 mr-1" />
            添加行
          </Button>
        </div>
      )}
    </div>
  );
};