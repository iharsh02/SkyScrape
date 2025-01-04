"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { TaskRegistry } from "@/lib/workflow/tasks/registry";
import { TaskType } from "@/types/taskType";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskMenuBtnProps {
  taskType: TaskType;
}

interface TaskGroup {
  title: string;
  tasks: TaskType[];
}

export const TaskMenu = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const taskGroups: TaskGroup[] = useMemo(() => [
    {
      title: "User Interactions",
      tasks: [
        TaskType.FILL_INPUT,
        TaskType.CLICK_ELEMENT,
        TaskType.SCROLL_TO_ELEMENT,
        TaskType.NAVIGATE_URL,
      ],
    },
    {
      title: "Data Extraction",
      tasks: [
        TaskType.PAGE_TO_HTML,
        TaskType.EXTRACT_TEXT_FROM_ELEMENT,
      ],
    },
    {
      title: "AI",
      tasks: [TaskType.EXTRACT_DATA_WITH_AI],
    },
    {
      title: "Read & Write",
      tasks: [
        TaskType.READ_PROPERTY_FROM_JSON,
        TaskType.ADD_PROPERTY_TO_JSON,
      ],
    },
    {
      title: "Time Controlled",
      tasks: [TaskType.WAIT_FOR_ELEMENT],
    },
    {
      title: "Result",
      tasks: [TaskType.DELIVER_VIA_WEBHOOK],
    },
  ], []);

  return (
    <aside
      className={`transition-all duration-300 ease-in-out border-r-2 border-separate h-full p-2 overflow-auto ${
        isExpanded ? "w-[340px] min-w-[340px] max-w-[340px]" : "w-[60px] min-w-[60px] max-w-[60px]"
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleExpand}
        className="mb-4 w-full"
        aria-label={isExpanded ? "Collapse menu" : "Expand menu"}
      >
        {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
      {isExpanded ? (
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={taskGroups.map(group => group.title.toLowerCase().replace(/\s+/g, '_'))}
        >
          {taskGroups.map((group) => (
            <AccordionItem key={group.title} value={group.title.toLowerCase().replace(/\s+/g, '_')}>
              <AccordionTrigger className="font-bold">
                {group.title}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-1">
                {group.tasks.map((taskType) => (
                  <TaskMenuBtn key={taskType} taskType={taskType} />
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="flex flex-col items-center gap-2">
          {taskGroups.flatMap(group => group.tasks).map((taskType) => (
            <TaskMenuIconBtn key={taskType} taskType={taskType} />
          ))}
        </div>
      )}
    </aside>
  );
};

const TaskMenuBtn: React.FC<TaskMenuBtnProps> = ({ taskType }) => {
  const task = TaskRegistry[taskType];

  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, type: TaskType) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Button
      variant="secondary"
      className="flex justify-between items-center gap-2 border-2 w-full"
      draggable
      onDragStart={(event) => onDragStart(event, taskType)}
    >
      <task.icon size={20} />
      {task.label}
    </Button>
  );
};

const TaskMenuIconBtn: React.FC<TaskMenuBtnProps> = ({ taskType }) => {
  const task = TaskRegistry[taskType];

  const onDragStart = (event: React.DragEvent<HTMLButtonElement>, type: TaskType) => {
    event.dataTransfer.setData("application/reactflow", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-10 h-10"
      draggable
      onDragStart={(event) => onDragStart(event, taskType)}
      title={task.label}
    >
      <task.icon size={20} />
    </Button>
  );
};
