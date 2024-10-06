import { z } from "zod";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taxRateSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(0).max(255).optional(),
  parameterName: z.string().min(0).max(255).optional(),
  percent: z.coerce.number().min(0).max(1).optional(),
  condition: z.string().optional()
});

export type TaxRate = z.infer<typeof taxRateSchema>;
export const taxRateDefault: TaxRate = {
  id: 0,
  name: "",
  parameterName:"",
  percent:0,
  condition:""
};
