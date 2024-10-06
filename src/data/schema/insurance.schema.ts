import { z } from "zod";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const insuranceSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(0).max(255).optional(),
  percentEmployee: z.coerce.number().positive("Percentage must be positive!").optional(),
  percentCompany: z.coerce.number().positive("Percentage must be positive!").optional(),
  parameterName: z.string().min(0).max(255).optional()
});

export type Insurance = z.infer<typeof insuranceSchema>;
export const insuranceDefault: Insurance = {
  id: 0,
  name: "",
  percentEmployee: 0,
  percentCompany: 0,
  parameterName: ""
};