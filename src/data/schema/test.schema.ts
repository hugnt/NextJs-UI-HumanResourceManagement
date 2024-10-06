import { z } from "zod";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const testSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(0).max(255).optional(),
  description: z.string().min(0).max(255).optional(),
});

export type Test = z.infer<typeof testSchema>;
export const testDefault: Test = {
  id: 0,
  name: "",
  description: ""
};
