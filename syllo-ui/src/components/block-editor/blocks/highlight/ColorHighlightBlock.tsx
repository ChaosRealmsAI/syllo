"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  Target,
  Zap,
  Heart,
  Palette,
  Edit3,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

export type HighlightType =
  | "info"
  | "warning"
  | "success"
  | "error"
  | "tip"
  | "note"
  | "important"
  | "custom";

export type HighlightColor =
  | "blue"
  | "green"
  | "yellow"
  | "red"
  | "purple"
  | "orange"
  | "pink"
  | "indigo"
  | "gray";

export interface HighlightBlockData {
  type: HighlightType;
  color?: HighlightColor;
  title?: string;
  content: string;
  icon?: string;
}

interface ColorHighlightBlockProps {
  data: HighlightBlockData;
  editable?: boolean;
  onChange?: (data: HighlightBlockData) => void;
}

const HIGHLIGHT_CONFIGS = {
  info: {
    icon: Info,
    defaultColor: "blue" as HighlightColor,
    label: "信息",
  },
  warning: {
    icon: AlertTriangle,
    defaultColor: "yellow" as HighlightColor,
    label: "警告",
  },
  success: {
    icon: CheckCircle,
    defaultColor: "green" as HighlightColor,
    label: "成功",
  },
  error: {
    icon: XCircle,
    defaultColor: "red" as HighlightColor,
    label: "错误",
  },
  tip: {
    icon: Lightbulb,
    defaultColor: "purple" as HighlightColor,
    label: "提示",
  },
  note: {
    icon: Target,
    defaultColor: "gray" as HighlightColor,
    label: "备注",
  },
  important: {
    icon: Zap,
    defaultColor: "orange" as HighlightColor,
    label: "重要",
  },
  custom: {
    icon: Heart,
    defaultColor: "pink" as HighlightColor,
    label: "自定义",
  },
};

const COLOR_STYLES = {
  blue: {
    background: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    icon: "text-blue-600 dark:text-blue-400",
    title: "text-blue-900 dark:text-blue-100",
    content: "text-blue-800 dark:text-blue-200",
  },
  green: {
    background: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
    icon: "text-green-600 dark:text-green-400",
    title: "text-green-900 dark:text-green-100",
    content: "text-green-800 dark:text-green-200",
  },
  yellow: {
    background: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-yellow-800",
    icon: "text-yellow-600 dark:text-yellow-500",
    title: "text-yellow-900 dark:text-yellow-100",
    content: "text-yellow-800 dark:text-yellow-200",
  },
  red: {
    background: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    icon: "text-red-600 dark:text-red-400",
    title: "text-red-900 dark:text-red-100",
    content: "text-red-800 dark:text-red-200",
  },
  purple: {
    background: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
    icon: "text-purple-600 dark:text-purple-400",
    title: "text-purple-900 dark:text-purple-100",
    content: "text-purple-800 dark:text-purple-200",
  },
  orange: {
    background: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800",
    icon: "text-orange-600 dark:text-orange-400",
    title: "text-orange-900 dark:text-orange-100",
    content: "text-orange-800 dark:text-orange-200",
  },
  pink: {
    background: "bg-pink-50 dark:bg-pink-950/30",
    border: "border-pink-200 dark:border-pink-800",
    icon: "text-pink-600 dark:text-pink-400",
    title: "text-pink-900 dark:text-pink-100",
    content: "text-pink-800 dark:text-pink-200",
  },
  indigo: {
    background: "bg-indigo-50 dark:bg-indigo-950/30",
    border: "border-indigo-200 dark:border-indigo-800",
    icon: "text-indigo-600 dark:text-indigo-400",
    title: "text-indigo-900 dark:text-indigo-100",
    content: "text-indigo-800 dark:text-indigo-200",
  },
  gray: {
    background: "bg-gray-50 dark:bg-gray-950/30",
    border: "border-gray-200 dark:border-gray-800",
    icon: "text-gray-600 dark:text-gray-400",
    title: "text-gray-900 dark:text-gray-100",
    content: "text-gray-800 dark:text-gray-200",
  },
};

export const ColorHighlightBlock: React.FC<ColorHighlightBlockProps> = ({
  data,
  editable = false,
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);

  const config = HIGHLIGHT_CONFIGS[data.type];
  const color = data.color || config.defaultColor;
  const styles = COLOR_STYLES[color];
  const IconComponent = config.icon;

  const handleSave = () => {
    onChange?.(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  const handleTypeChange = (newType: HighlightType) => {
    const newConfig = HIGHLIGHT_CONFIGS[newType];
    setEditData({
      ...editData,
      type: newType,
      color: newConfig.defaultColor,
    });
  };

  if (isEditing) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/30">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">类型</label>
              <Select
                value={editData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(HIGHLIGHT_CONFIGS).map(([type, config]) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <config.icon className="h-4 w-4" />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">颜色</label>
              <Select
                value={editData.color || config.defaultColor}
                onValueChange={(value: HighlightColor) =>
                  setEditData({ ...editData, color: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(COLOR_STYLES).map(([colorKey, colorStyle]) => (
                    <SelectItem key={colorKey} value={colorKey}>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded", colorStyle.background, colorStyle.border, "border")} />
                        {colorKey}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">标题（可选）</label>
            <Textarea
              value={editData.title || ""}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="输入标题..."
              rows={1}
              className="mt-1 resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">内容</label>
            <Textarea
              value={editData.content}
              onChange={(e) => setEditData({ ...editData, content: e.target.value })}
              placeholder="输入内容..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel} size="sm">
              取消
            </Button>
            <Button onClick={handleSave} size="sm">
              保存
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn(
      "relative group rounded-lg border-l-4 transition-all",
      styles.background,
      styles.border,
      "border-l-current"
    )}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("flex-shrink-0 mt-0.5", styles.icon)}>
            <IconComponent className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            {data.title && (
              <h4 className={cn("font-semibold mb-2 leading-tight", styles.title)}>
                {data.title}
              </h4>
            )}

            <div className={cn("text-sm leading-relaxed whitespace-pre-wrap", styles.content)}>
              {data.content}
            </div>
          </div>

          {editable && (
            <div className="flex items-center gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                  >
                    <Palette className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="end">
                  <div className="grid grid-cols-5 gap-1">
                    {Object.entries(COLOR_STYLES).map(([colorKey, colorStyle]) => (
                      <button
                        key={colorKey}
                        className={cn(
                          "w-6 h-6 rounded border-2 transition-all hover:scale-110",
                          colorStyle.background,
                          colorStyle.border,
                          color === colorKey && "ring-2 ring-offset-2 ring-current"
                        )}
                        onClick={() =>
                          onChange?.({ ...data, color: colorKey as HighlightColor })
                        }
                        title={colorKey}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};