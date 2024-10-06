import { z } from "zod";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taxDeductionSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(0).max(255).optional(),
  parameterName: z.string().min(0).max(255).optional(),
  fomulaType: z.coerce.number().optional(),
  terms: z.string().optional()
});

export type TaxDeduction = z.infer<typeof taxDeductionSchema>;
export const taxDeductionDefault: TaxDeduction = {
  id: 0,
  name: "",
  parameterName:"",
  fomulaType:1,
  terms:""
};
