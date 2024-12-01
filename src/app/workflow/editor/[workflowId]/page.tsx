import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Editor } from "../../_components/Editor";

export default async function EditorPage({ params }: { params: { workflowId: string } }) {
  const { workflowId } = params;
  const { userId } = await auth();

  if (!userId) {
    throw new Error('unauthorized');
  }

  const workflow = await db.workflow.findUnique({
    where: {
      id: workflowId,
      userId
    }
  });

  if (!workflow) {
    throw new Error("Workflow does not exist");
  }

  return (<Editor workflow={workflow} />);
}
