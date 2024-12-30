import { z } from "zod";

export const createCredentialsSchema = z.object({
  name: z.string().min(3).max(50),
  value: z.string().max(500),
});

export type createCredentialsSchemaType = z.infer<
  typeof createCredentialsSchema
>;
