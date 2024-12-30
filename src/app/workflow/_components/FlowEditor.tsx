"use client";

import { Workflow } from '@prisma/client'
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  getOutgoers
} from '@xyflow/react';
import "@xyflow/react/dist/style.css"
import NodeComponent from './nodes/NodeComponents';
import React, { useCallback, useEffect } from 'react';
import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskType } from '@/types/taskType';
import { AppNode } from '@/types/appNode';
import { DeleteEdges } from './edges/DeleteEdges';
import { TaskRegistry } from '@/lib/workflow/tasks/registry';


const edgeTypes = {
  default: DeleteEdges,
}
const nodeTypes = {
  SkyScrapeNode: NodeComponent,
};

const fitviewOption = { padding: 1 }

export const FlowEditor = ({ workflow }: { workflow: Workflow }) => {


  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
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
  }, [screenToFlowPosition, setNodes]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges(eds => addEdge({ ...connection, animated: true }, eds));

    if (!connection.targetHandle) return;

    setNodes(prevNodes => {
      return prevNodes.map(node => {
        if (node.id === connection.target) {
          const updatedInputs = { ...node.data.inputs };
          delete updatedInputs[connection.targetHandle as string];

          return {
            ...node,
            data: {
              ...node.data,
              inputs: updatedInputs
            }
          };
        }
        return node;
      });
    });
  }, [setEdges, setNodes]);

  const isValidConnection = useCallback((
    connection: Edge | Connection
  ) => {
    // Prevent self-connections
    if (connection.source === connection.target) {
      return false;
    }

    // Find source and target nodes in the flow
    const source = nodes.find((node) => node.id === connection.source);
    const target = nodes.find((node) => node.id === connection.target);

    // Return false if either node doesn't exist
    if (!source || !target) return false;

    // Get task definitions from registry
    const sourceTask = TaskRegistry[source.data.type];
    const targetTask = TaskRegistry[target.data.type];

    // Find matching output port from source node
    const output = sourceTask.outputs.find(output => output.name === connection.sourceHandle);
    // Find matching input port from target node
    const input = targetTask.inputs.find(input => input.name === connection.targetHandle);

    // Return false if:
    // 1. Either port doesn't exist
    // 2. Port types don't match
    if (!input || !output || input.type !== output.type) {
      return false;
    }

    // check for cycles

    const hasCycle = (node: AppNode, visited = new Set()) => {
      if (visited.has(node.id)) return false;

      visited.add(node.id);

      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === connection.source) return true;
        if (hasCycle(outgoer, visited)) return true;
      }
    };

    const detectedCycle = hasCycle(target);
    return !detectedCycle;

  }, [nodes, edges]);

  return (
    <main className='h-full w-full'>
      <ReactFlow nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitViewOptions={fitviewOption}
        fitView
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >

        <Controls position='bottom-right' fitViewOptions={fitviewOption} />
        <Background variant={BackgroundVariant.Lines} gap={250} size={1} color='currentColor' className='opacity-20' />

      </ReactFlow>
    </main>
  )
}

