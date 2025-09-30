"use client";

import React from "react";
import { TaskType } from "./types/task";
import { TaskRegistry } from "./workflow/task/registry";
import { Button } from "@/components/buttons/Button";

export const TaskMenuBtn = ({ taskType }: { taskType: TaskType }) => {
  const task = TaskRegistry[taskType];
  const onDragStart = (event: React.DragEvent, type: TaskType) => {
    event.dataTransfer.setData("application/reactflow", type);

    event.dataTransfer.effectAllowed = "move";
  };
  return (
    <Button
      variant="outline"
      className="h-9"
      draggable
      onDragStart={(event) => onDragStart(event, taskType)}
    >
      {taskType}
    </Button>
  );
};
