"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Edit3,
  Globe,
  Calendar,
  User,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface LinkPreviewData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
  publishedTime?: string;
  author?: string;
  type?: "website" | "article" | "video" | "image";
}

interface LinkPreviewProps {
  data: LinkPreviewData;
  editable?: boolean;
  variant?: "compact" | "full" | "card";
  onChange?: (data: LinkPreviewData) => void;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({
  data,
  editable = false,
  variant = "full",
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEditData(data);
  }, [data]);

  const handleSave = () => {
    onChange?.(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
  };

  const fetchPreview = async (url: string) => {
    setIsLoading(true);
    try {
      // 这里可以接入真实的链接预览API
      // 暂时用模拟数据
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData: LinkPreviewData = {
        ...editData,
        url,
        title: "示例网页标题",
        description: "这是一个示例网页的描述内容，展示链接预览的效果。",
        siteName: "示例网站",
        type: "website",
        favicon: "🌐",
      };

      setEditData(mockData);
      onChange?.(mockData);
    } catch (error) {
      console.error("Failed to fetch link preview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = () => {
    switch (data.type) {
      case "article":
        return <FileText className="h-3 w-3" />;
      case "video":
        return <ImageIcon className="h-3 w-3" />;
      case "image":
        return <ImageIcon className="h-3 w-3" />;
      default:
        return <Globe className="h-3 w-3" />;
    }
  };

  const getTypeColor = () => {
    switch (data.type) {
      case "article":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "video":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "image":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  if (isEditing) {
    return (
      <Card className="p-4 space-y-3">
        <div>
          <label className="text-sm font-medium">链接地址</label>
          <div className="flex gap-2 mt-1">
            <Input
              value={editData.url}
              onChange={(e) => setEditData({ ...editData, url: e.target.value })}
              placeholder="https://example.com"
            />
            <Button
              onClick={() => fetchPreview(editData.url)}
              disabled={isLoading}
              size="sm"
            >
              {isLoading ? "获取中..." : "获取预览"}
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">标题</label>
          <Input
            value={editData.title || ""}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="网页标题"
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">描述</label>
          <Input
            value={editData.description || ""}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            placeholder="网页描述"
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
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <div className="group flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
        {data.favicon && (
          <div className="text-lg">{data.favicon}</div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">
              {data.title || data.url}
            </h4>
            {data.type && (
              <Badge variant="secondary" className={cn("text-xs", getTypeColor())}>
                {getTypeIcon()}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {data.description || new URL(data.url).hostname}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {editable && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(data.url, "_blank")}
            className="h-6 w-6 p-0"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="group overflow-hidden">
      {data.image && (
        <div className="aspect-video bg-muted relative overflow-hidden">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {data.favicon && (
                <span className="text-sm">{data.favicon}</span>
              )}
              <span className="text-xs text-muted-foreground">
                {data.siteName || new URL(data.url).hostname}
              </span>
              {data.type && (
                <Badge variant="secondary" className={cn("text-xs", getTypeColor())}>
                  {getTypeIcon()}
                  <span className="ml-1 capitalize">{data.type}</span>
                </Badge>
              )}
            </div>

            <h3 className="font-semibold text-lg leading-tight mb-2">
              {data.title || "无标题"}
            </h3>

            {data.description && (
              <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                {data.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {data.author && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {data.author}
                </div>
              )}
              {data.publishedTime && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {data.publishedTime}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {editable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(data.url, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};