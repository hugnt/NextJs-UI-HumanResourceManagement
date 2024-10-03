import { z } from "zod";

export const deductionSchema = z.object({
  id: z.coerce.number().optional(),
  parameterName: z.string().optional(),
  amount: z.coerce.number(),
  name: z.string().min(1).max(255),
});

export type Deduction = z.infer<typeof deductionSchema>;

export const deductionDefault: Deduction = {
  id: 0,
  parameterName: "",
  amount: 0,
  name: "",
};