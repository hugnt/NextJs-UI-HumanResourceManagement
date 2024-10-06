import { z } from "zod";

export const bonusSchema = z.object({
  id: z.coerce.number().optional(),
  parameterName: z.string().optional(),
  amount: z.coerce.number().optional(),
  name: z.string().min(0).max(255),
});

export type Bonus = z.infer<typeof bonusSchema>;
export const bonusDefault: Bonus = {
  id: 0,
  parameterName: "",
  amount: 0,
  name: "",
};