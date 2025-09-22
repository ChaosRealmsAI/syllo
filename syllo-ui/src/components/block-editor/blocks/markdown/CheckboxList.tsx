"use client";

import React, { useState } from "react";
import styles from "../../styles/editor.module.css";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxItem {
  id: string;
  text: string;
  checked: boolean;
  children?: CheckboxItem[];
}

interface CheckboxListProps {
  items: CheckboxItem[];
  editable?: boolean;
  onChange?: (items: CheckboxItem[]) => void;
  className?: string;
  depth?: number;
}

export const CheckboxList: React.FC<CheckboxListProps> = ({
  items,
  editable = false,
  onChange,
  className,
  depth = 0,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const updateItem = (id: string, updates: Partial<CheckboxItem>) => {
    if (!onChange) return;

    const updateInItems = (items: CheckboxItem[]): CheckboxItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        if (item.children) {
          return { ...item, children: updateInItems(item.children) };
        }
        return item;
      });
    };

    onChange(updateInItems(items));
  };

  const addItem = (afterId?: string) => {
    if (!onChange) return;

    const newItem: CheckboxItem = {
      id: `checkbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: "",
      checked: false,
    };

    if (!afterId) {
      onChange([...items, newItem]);
    } else {
      const insertAfter = (items: CheckboxItem[]): CheckboxItem[] => {
        const result: CheckboxItem[] = [];
        for (const item of items) {
          result.push(item);
          if (item.id === afterId) {
            result.push(newItem);
          }
        }
        return result;
      };
      onChange(insertAfter(items));
    }

    // 自动开始编辑新项目
    setTimeout(() => {
      setEditingId(newItem.id);
      setEditingText("");
    }, 100);
  };

  const removeItem = (id: string) => {
    if (!onChange) return;

    const removeFromItems = (items: CheckboxItem[]): CheckboxItem[] => {
      return items.filter(item => item.id !== id).map(item => {
        if (item.children) {
          return { ...item, children: removeFromItems(item.children) };
        }
        return item;
      });
    };

    onChange(removeFromItems(items));
  };

  const addSubItem = (parentId: string) => {
    if (!onChange) return;

    const newItem: CheckboxItem = {
      id: `checkbox-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: "",
      checked: false,
    };

    const addToParent = (items: CheckboxItem[]): CheckboxItem[] => {
      return items.map(item => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), newItem]
          };
        }
        if (item.children) {
          return { ...item, children: addToParent(item.children) };
        }
        return item;
      });
    };

    onChange(addToParent(items));

    // 自动开始编辑新子项目
    setTimeout(() => {
      setEditingId(newItem.id);
      setEditingText("");
    }, 100);
  };

  const startEdit = (item: CheckboxItem) => {
    if (!editable) return;
    setEditingId(item.id);
    setEditingText(item.text);
  };

  const finishEdit = () => {
    if (editingId) {
      updateItem(editingId, { text: editingText });
      setEditingId(null);
      setEditingText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, itemId: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      finishEdit();
      if (editable) {
        addItem(itemId);
      }
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditingText("");
    } else if (e.key === "Tab") {
      e.preventDefault();
      finishEdit();
      if (editable) {
        addSubItem(itemId);
      }
    }
  };

  const renderItem = (item: CheckboxItem, index: number) => {
    const isEditing = editingId === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="group">
        <div
          className={cn(
            "flex items-center gap-2 py-1 hover:bg-muted/50 rounded px-2 -mx-2 transition-colors",
            isEditing && "bg-muted/50"
          )}
          style={{ marginLeft: `${depth * 24}px` }}
        >
          {/* 拖拽手柄 */}
          {editable && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
              <GripVertical className="h-3 w-3 text-muted-foreground" />
            </div>
          )}

          {/* 复选框 */}
          <Checkbox
            id={item.id}
            checked={item.checked}
            onCheckedChange={(checked) =>
              updateItem(item.id, { checked: Boolean(checked) })
            }
            className="flex-shrink-0"
          />

          {/* 文本内容 */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onBlur={finishEdit}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                className="h-6 text-sm border-none shadow-none bg-transparent p-0 focus-visible:ring-0"
                placeholder="输入任务内容..."
                autoFocus
              />
            ) : (
              <label
                htmlFor={item.id}
                className={cn(
                  "text-sm cursor-pointer block truncate",
                  item.checked && "line-through text-muted-foreground",
                  !item.text && editable && "text-muted-foreground italic"
                )}
                onClick={() => startEdit(item)}
              >
                {item.text || (editable ? "点击编辑任务..." : "")}
              </label>
            )}
          </div>

          {/* 操作按钮 */}
          {editable && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => addItem(item.id)}
                title="添加下一项"
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => addSubItem(item.id)}
                title="添加子项"
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                onClick={() => removeItem(item.id)}
                title="删除"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* 子项目 */}
        {hasChildren && (
          <CheckboxList
            items={item.children!}
            editable={editable}
            onChange={(children) => updateItem(item.id, { children })}
            depth={depth + 1}
          />
        )}
      </div>
    );
  };

  return (
    <div className={cn("space-y-1", className)}>
      {items.map((item, index) => renderItem(item, index))}

      {editable && items.length === 0 && (
        <div className="text-center py-4">
          <Button
            variant="ghost"
            onClick={() => addItem()}
            className="text-muted-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            添加第一个任务
          </Button>
        </div>
      )}

      {editable && items.length > 0 && (
        <div className="pt-2">
          <Button
            variant="ghost"
            onClick={() => addItem()}
            className="text-muted-foreground text-sm h-6"
          >
            <Plus className="h-3 w-3 mr-1" />
            添加任务
          </Button>
        </div>
      )}
    </div>
  );
};