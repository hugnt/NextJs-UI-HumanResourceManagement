import { z } from "zod";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const formulaSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(0).max(255).optional(),
  fomulaDetail: z.string().min(0).max(1440).optional(),
  note: z.string().optional()
});

export type Formula = z.infer<typeof formulaSchema>;
export const formulaDefault: Formula = {
  id: 0,
  name: "",
  fomulaDetail:"",
  note:""
};
