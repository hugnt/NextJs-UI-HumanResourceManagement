import { z } from "zod";

export const deductionSchema = z.object({
  id: z.coerce.number().optional(),
  parameterName: z.string().optional(),
  amount: z.coerce.number().optional(),
  name: z.string().min(0).max(255).optional(),
});

export type Deduction = z.infer<typeof deductionSchema>;
export const deductionDefault: Deduction = {
  id: 0,
  parameterName: "",
  amount: 0,
  name: "",
};