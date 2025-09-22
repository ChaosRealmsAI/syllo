"use client";

import React, { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// 导入新组件
import { EditorTable, TableData } from "@/components/block-editor/blocks/markdown/Table";
import { CheckboxList, CheckboxItem } from "@/components/block-editor/blocks/markdown/CheckboxList";
import { LinkPreview, LinkPreviewData } from "@/components/block-editor/blocks/reference/LinkPreview";
import { TaskCard, TaskData } from "@/components/block-editor/blocks/task/TaskCard";
import { ColorHighlightBlock, HighlightBlockData } from "@/components/block-editor/blocks/highlight/ColorHighlightBlock";

import styles from "@/components/block-editor/styles/editor.module.css";

export default function ModernBlocksPage() {
  // 表格数据
  const [tableData, setTableData] = useState<TableData>({
    headers: ["功能", "状态", "优先级", "负责人"],
    rows: [
      ["表格组件", "✅ 完成", "高", "开发团队"],
      ["任务卡片", "🚧 进行中", "中", "UI 团队"],
      ["高亮块", "✅ 完成", "高", "设计团队"],
    ],
    alignments: ["left", "center", "center", "left"],
  });

  // 复选框列表数据
  const [checkboxItems, setCheckboxItems] = useState<CheckboxItem[]>([
    {
      id: "1",
      text: "设计编辑器组件架构",
      checked: true,
      children: [
        { id: "1-1", text: "分析需求", checked: true },
        { id: "1-2", text: "设计接口", checked: true },
        { id: "1-3", text: "制定规范", checked: false },
      ],
    },
    {
      id: "2",
      text: "实现核心功能",
      checked: false,
      children: [
        { id: "2-1", text: "表格组件", checked: true },
        { id: "2-2", text: "任务管理", checked: false },
        { id: "2-3", text: "高亮块", checked: true },
      ],
    },
    {
      id: "3",
      text: "测试和优化",
      checked: false,
    },
  ]);

  // 链接预览数据
  const [linkData, setLinkData] = useState<LinkPreviewData>({
    url: "https://ui.shadcn.com",
    title: "shadcn/ui - Beautifully designed components",
    description: "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
    siteName: "shadcn/ui",
    type: "website",
    favicon: "⚡",
    publishedTime: "2024-01-15",
    author: "shadcn",
  });

  // 任务数据
  const [taskData, setTaskData] = useState<TaskData>({
    id: "task-1",
    title: "实现编辑器拖拽功能",
    description: "基于 @dnd-kit 实现编辑器块的拖拽排序功能，支持纵向和横向布局。",
    status: "in-progress",
    priority: "high",
    assignee: {
      id: "user-1",
      name: "张三",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    },
    dueDate: "2024-02-01",
    estimatedTime: 8,
    tags: ["前端", "拖拽", "UI"],
    comments: 3,
    attachments: 2,
    createdAt: "2024-01-20",
    updatedAt: "2024-01-22",
  });

  // 高亮块数据
  const [highlightBlocks, setHighlightBlocks] = useState<HighlightBlockData[]>([
    {
      type: "info",
      title: "提示信息",
      content: "这是一个信息提示块，用于展示重要的提示信息。",
    },
    {
      type: "warning",
      content: "请注意：这个功能还在开发中，可能会有一些不稳定的表现。",
    },
    {
      type: "success",
      title: "成功",
      content: "所有组件都已经成功实现并通过测试！",
    },
    {
      type: "error",
      content: "遇到错误：无法连接到服务器，请检查网络连接。",
    },
    {
      type: "tip",
      color: "purple",
      title: "💡 专业提示",
      content: "使用 Ctrl+D 可以快速复制当前块，提高编辑效率。",
    },
    {
      type: "custom",
      color: "pink",
      title: "自定义块",
      content: "你可以创建任何颜色和样式的自定义高亮块。",
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            现代化编辑器组件
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            基于 shadcn/ui 构建的现代化编辑器组件集合，支持 Markdown 语法、任务管理、文档引用和丰富的视觉效果。
          </p>
        </div>

        <Tabs defaultValue="markdown" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="markdown">Markdown 扩展</TabsTrigger>
            <TabsTrigger value="reference">文档引用</TabsTrigger>
            <TabsTrigger value="task">任务管理</TabsTrigger>
            <TabsTrigger value="highlight">高亮块</TabsTrigger>
          </TabsList>

          <TabsContent value="markdown" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 表格组件
                  <Badge variant="secondary">可编辑</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EditorTable
                  data={tableData}
                  editable={true}
                  onChange={setTableData}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ✅ 复选框列表
                  <Badge variant="secondary">支持嵌套</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CheckboxList
                  items={checkboxItems}
                  editable={true}
                  onChange={setCheckboxItems}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reference" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔗 链接预览
                  <Badge variant="secondary">完整版</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LinkPreview
                  data={linkData}
                  editable={true}
                  onChange={setLinkData}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔗 紧凑链接预览
                  <Badge variant="secondary">紧凑版</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LinkPreview
                  data={{
                    url: "https://github.com/shadcn-ui/ui",
                    title: "shadcn-ui/ui - GitHub",
                    description: "Beautifully designed components built with Radix UI and Tailwind CSS.",
                    favicon: "🐙",
                    siteName: "GitHub",
                  }}
                  variant="compact"
                  editable={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="task" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📋 任务卡片
                  <Badge variant="secondary">完整版</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TaskCard
                  task={taskData}
                  editable={true}
                  draggable={true}
                  onChange={setTaskData}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📋 紧凑任务卡片
                  <Badge variant="secondary">紧凑版</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <TaskCard
                  task={{
                    ...taskData,
                    id: "task-2",
                    title: "设计用户界面",
                    status: "todo",
                    priority: "medium",
                  }}
                  compact={true}
                  draggable={true}
                />
                <TaskCard
                  task={{
                    ...taskData,
                    id: "task-3",
                    title: "编写单元测试",
                    status: "done",
                    priority: "low",
                  }}
                  compact={true}
                  draggable={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="highlight" className="space-y-6">
            <div className="grid gap-4">
              {highlightBlocks.map((block, index) => (
                <ColorHighlightBlock
                  key={index}
                  data={block}
                  editable={true}
                  onChange={(newData) => {
                    const newBlocks = [...highlightBlocks];
                    newBlocks[index] = newData;
                    setHighlightBlocks(newBlocks);
                  }}
                />
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>🎨 颜色展示</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {["blue", "green", "yellow", "red", "purple", "orange", "pink", "indigo"].map((color) => (
                    <ColorHighlightBlock
                      key={color}
                      data={{
                        type: "custom",
                        color: color as any,
                        title: `${color} 主题`,
                        content: `这是 ${color} 颜色主题的高亮块示例。`,
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>🚀 功能特性</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 text-left">
                <div className="space-y-2">
                  <h4 className="font-semibold">Markdown 支持</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 可编辑表格</li>
                    <li>• 嵌套复选框列表</li>
                    <li>• 实时预览</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">任务管理</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 可拖拽任务卡片</li>
                    <li>• 多种状态和优先级</li>
                    <li>• 团队协作功能</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">视觉效果</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 9种颜色主题</li>
                    <li>• 自定义图标</li>
                    <li>• 响应式设计</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">交互体验</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 实时编辑</li>
                    <li>• 悬停效果</li>
                    <li>• 无障碍访问</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}