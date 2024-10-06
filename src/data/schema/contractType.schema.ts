import { z } from "zod";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const contractTypeSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(0).max(255).optional(),
});

export type ContractType = z.infer<typeof contractTypeSchema>;
export const contractTypeDefault: ContractType = {
  id: 0,
  name: ""
};
