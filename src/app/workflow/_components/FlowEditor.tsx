"use client";

import { Workflow } from '@prisma/client'
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react';
import "@xyflow/react/dist/style.css"
import NodeComponent from './nodes/NodeComponents';
import React, { useCallback, useEffect } from 'react';
import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskType } from '@/types/taskType';
import { AppNode } from '@/types/appNode';

const nodeTypes = {
  SkyScrapeNode: NodeComponent,
};

const fitviewOption = { padding: 1 }

export const FlowEditor = ({ workflow }: { workflow: Workflow }) => {


  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setViewport, screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;

      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);

      if (!flow.viewport) return;
      const { x = 0, y = 0, zoom = 1 } = flow.viewport
      setViewport({ x, y, zoom })
    } catch {
      throw new Error("Somthing went wrong")
    }
  }, [workflow.definition, setEdges, setNodes, setViewport]);


  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

  }, []);


  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const taskType = event.dataTransfer.getData("application/reactflow");
    if (typeof taskType === undefined || !taskType) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
    });

    const newNode = CreateFlowNode(taskType as TaskType, position);
    setNodes(nds => nds.concat(newNode));
  }, []);


  return (
    <main className='h-full w-full'>
      <ReactFlow nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitViewOptions={fitviewOption}
        fitView
        onDragOver={onDragOver}
        onDrop={onDrop}
      >

        <Controls position='bottom-right' fitViewOptions={fitviewOption} />
        <Background variant={BackgroundVariant.Lines} gap={100} size={1} color='currentColor' className='opacity-20' />

      </ReactFlow>
    </main>
  )
}

