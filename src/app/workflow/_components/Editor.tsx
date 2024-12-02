'use client';

import { Workflow } from "@prisma/client"
import { ReactFlowProvider } from "@xyflow/react"
import { FlowEditor } from "./FlowEditor";
import { TopBar } from "./topbar/topBar";
import { TaskMenu } from "./taskMenu";

export const Editor = ({ workflow }: { workflow: Workflow }) => {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full w-full  overflow-hidden">
        <TopBar title="workflow editor" subtitle={workflow.name} workFlowId={workflow.id} />

        <section className="flex h-full overflow-auto">
          <TaskMenu />
          <FlowEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  )
}

