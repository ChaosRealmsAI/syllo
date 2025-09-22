"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Flag,
  MessageSquare,
  Paperclip,
  User,
  Edit3,
  MoreHorizontal,
  GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TaskStatus = "todo" | "in-progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface TaskData {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: string;
  estimatedTime?: number; // in hours
  tags?: string[];
  comments?: number;
  attachments?: number;
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: TaskData;
  editable?: boolean;
  draggable?: boolean;
  compact?: boolean;
  onChange?: (task: TaskData) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  editable = false,
  draggable = false,
  compact = false,
  onChange,
  onStatusChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(task);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "low":
        return "text-green-600 dark:text-green-400";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "high":
        return "text-orange-600 dark:text-orange-400";
      case "urgent":
        return "text-red-600 dark:text-red-400";
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return "待办";
      case "in-progress":
        return "进行中";
      case "review":
        return "待审核";
      case "done":
        return "已完成";
    }
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case "low":
        return "低";
      case "medium":
        return "中";
      case "high":
        return "高";
      case "urgent":
        return "紧急";
    }
  };

  const handleSave = () => {
    onChange?.(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(task);
    setIsEditing(false);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  if (isEditing) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <Input
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="任务标题"
            className="font-semibold"
          />
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={editData.description || ""}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            placeholder="任务描述..."
            rows={3}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">状态</label>
              <Select
                value={editData.status}
                onValueChange={(value: TaskStatus) =>
                  setEditData({ ...editData, status: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">待办</SelectItem>
                  <SelectItem value="in-progress">进行中</SelectItem>
                  <SelectItem value="review">待审核</SelectItem>
                  <SelectItem value="done">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">优先级</label>
              <Select
                value={editData.priority}
                onValueChange={(value: TaskPriority) =>
                  setEditData({ ...editData, priority: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">低</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="urgent">紧急</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">截止日期</label>
            <Input
              type="date"
              value={editData.dueDate || ""}
              onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
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

  if (compact) {
    return (
      <Card className={cn("group cursor-pointer hover:shadow-md transition-all",
        task.status === "done" && "opacity-60"
      )}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {draggable && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "font-medium text-sm truncate",
                task.status === "done" && "line-through"
              )}>
                {task.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={cn("text-xs", getStatusColor(task.status))}>
                  {getStatusLabel(task.status)}
                </Badge>
                <Flag className={cn("h-3 w-3", getPriorityColor(task.priority))} />
                {task.dueDate && (
                  <span className={cn(
                    "text-xs",
                    isOverdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                  )}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {task.assignee && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatar} />
                <AvatarFallback className="text-xs">
                  {task.assignee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}

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
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("group cursor-pointer hover:shadow-md transition-all",
      task.status === "done" && "opacity-75"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {draggable && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <h3 className={cn(
              "font-semibold leading-tight",
              task.status === "done" && "line-through"
            )}>
              {task.title}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <Flag className={cn("h-4 w-4", getPriorityColor(task.priority))} />
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
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn("text-xs cursor-pointer", getStatusColor(task.status))}
            onClick={() => onStatusChange?.(task.id, task.status)}
          >
            {getStatusLabel(task.status)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {getPriorityLabel(task.priority)}
          </Badge>
          {task.tags?.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {task.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-1",
                isOverdue && "text-red-600 dark:text-red-400"
              )}>
                <Calendar className="h-3 w-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
            {task.estimatedTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {task.estimatedTime}h
              </div>
            )}
            {task.comments && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {task.comments}
              </div>
            )}
            {task.attachments && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                {task.attachments}
              </div>
            )}
          </div>

          {task.assignee && (
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <Avatar className="h-5 w-5">
                <AvatarImage src={task.assignee.avatar} />
                <AvatarFallback className="text-xs">
                  {task.assignee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span>{task.assignee.name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};