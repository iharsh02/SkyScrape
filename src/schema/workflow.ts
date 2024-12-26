import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(80),
})

export type createWorkflowSchemaType = z.infer<typeof createWorkflowSchema>

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}
