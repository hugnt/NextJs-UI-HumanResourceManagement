import { z } from "zod";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const allowanceSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(0).max(255).optional(),
  amount: z.coerce.number().positive("Amount must be positive!").optional(),
  terms: z.string().min(0).max(255).optional(),
  parameterName: z.string().min(0).max(255).optional()
});

export type Allowance = z.infer<typeof allowanceSchema>;
export const allowanceDefault: Allowance = {
  id: 0,
  name: "",
  amount: 0,
  terms: "",
  parameterName: ""
};