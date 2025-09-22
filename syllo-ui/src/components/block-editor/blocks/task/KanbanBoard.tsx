"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
  SortableContext as SortableContextProvider,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard, TaskData } from "./TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface KanbanColumn {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done" | "archived";
  color?: string;
  tasks: TaskData[];
}

export interface KanbanBoardData {
  columns: KanbanColumn[];
}

interface KanbanBoardProps {
  data: KanbanBoardData;
  editable?: boolean;
  onChange?: (data: KanbanBoardData) => void;
}

interface DroppableColumnProps {
  column: KanbanColumn;
  tasks: TaskData[];
  editable?: boolean;
  onTaskChange?: (taskId: string, updates: Partial<TaskData>) => void;
}

function DroppableColumn({ column, tasks, editable, onTaskChange }: DroppableColumnProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getColumnColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700";
      case "in-progress":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700";
      case "done":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700";
      case "archived":
        return "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700";
      default:
        return "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "todo":
        return "secondary";
      case "in-progress":
        return "default";
      case "done":
        return "secondary";
      case "archived":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col min-h-[500px] flex-1 ${isDragging ? "opacity-50" : ""}`}
      {...attributes}
      {...listeners}
    >
      <Card className={`${getColumnColor(column.status)} h-full`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm font-medium">
            <span>{column.title}</span>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusBadgeColor(column.status) as any}>
                {tasks.length}
              </Badge>
              {editable && (
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Plus className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-2 max-h-[400px] overflow-y-auto">
          <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                editable={editable}
                onChange={(updates) => onTaskChange?.(task.id, updates)}
              />
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}

interface DraggableTaskCardProps {
  task: TaskData;
  editable?: boolean;
  onChange?: (updates: Partial<TaskData>) => void;
}

function DraggableTaskCard({ task, editable, onChange }: DraggableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? "opacity-50" : ""}
    >
      <TaskCard
        task={task}
        compact={true}
        editable={editable}
        draggable={false} // 不使用TaskCard自己的拖拽，因为我们用的是sortable
        onChange={onChange}
      />
    </div>
  );
}

export function KanbanBoard({ data, editable = false, onChange }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<TaskData | null>(null);
  const [kanbanData, setKanbanData] = useState<KanbanBoardData>(data);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findTaskColumn = (taskId: string) => {
    return kanbanData.columns.find(column =>
      column.tasks.some(task => task.id === taskId)
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (active.data.current?.type === "Task") {
      setActiveTask(active.data.current.task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    // 任务拖拽到另一个任务上（重新排序）
    if (isActiveTask && isOverTask) {
      const activeColumn = findTaskColumn(activeId as string);
      const overColumn = findTaskColumn(overId as string);

      if (!activeColumn || !overColumn) return;

      if (activeColumn.id !== overColumn.id) {
        // 跨列移动
        const activeTaskIndex = activeColumn.tasks.findIndex(t => t.id === activeId);
        const overTaskIndex = overColumn.tasks.findIndex(t => t.id === overId);

        if (activeTaskIndex !== -1) {
          const [movedTask] = activeColumn.tasks.splice(activeTaskIndex, 1);
          movedTask.status = overColumn.status as any;
          overColumn.tasks.splice(overTaskIndex, 0, movedTask);

          setKanbanData({ ...kanbanData });
          onChange?.({ ...kanbanData });
        }
      } else {
        // 同列重新排序
        const taskIndex = activeColumn.tasks.findIndex(t => t.id === activeId);
        const overTaskIndex = activeColumn.tasks.findIndex(t => t.id === overId);

        if (taskIndex !== -1 && overTaskIndex !== -1) {
          activeColumn.tasks = arrayMove(activeColumn.tasks, taskIndex, overTaskIndex);
          setKanbanData({ ...kanbanData });
          onChange?.({ ...kanbanData });
        }
      }
    }

    // 任务拖拽到列上（移动到列的末尾）
    if (isActiveTask && isOverColumn) {
      const activeColumn = findTaskColumn(activeId as string);
      const overColumn = kanbanData.columns.find(col => col.id === overId);

      if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return;

      const taskIndex = activeColumn.tasks.findIndex(t => t.id === activeId);
      if (taskIndex !== -1) {
        const [movedTask] = activeColumn.tasks.splice(taskIndex, 1);
        movedTask.status = overColumn.status as any;
        overColumn.tasks.push(movedTask);

        setKanbanData({ ...kanbanData });
        onChange?.({ ...kanbanData });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
  };

  const handleTaskChange = (taskId: string, updates: Partial<TaskData>) => {
    const newData = { ...kanbanData };

    for (const column of newData.columns) {
      const taskIndex = column.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        column.tasks[taskIndex] = { ...column.tasks[taskIndex], ...updates };
        break;
      }
    }

    setKanbanData(newData);
    onChange?.(newData);
  };

  return (
    <div className="w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 w-full">
          <SortableContext
            items={kanbanData.columns.map(col => col.id)}
            strategy={verticalListSortingStrategy}
          >
            {kanbanData.columns.map((column) => (
              <DroppableColumn
                key={column.id}
                column={column}
                tasks={column.tasks}
                editable={editable}
                onTaskChange={handleTaskChange}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              compact={true}
              draggable={false}
              editable={false}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}