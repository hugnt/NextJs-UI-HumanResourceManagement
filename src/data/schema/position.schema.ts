import { z } from "zod";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const positionSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(0).max(255).optional(),
});

export type Position = z.infer<typeof positionSchema>;
export const positionDefault: Position = {
  id: 0,
  name: ""
};
