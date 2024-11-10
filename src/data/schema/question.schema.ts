import { z } from "zod";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const questionSchema = z.object({
  id: z.coerce.number().optional(),
  testId: z.coerce.number().optional(),
  testName: z.string().min(0).max(255).optional(),
  questionText: z.string().min(0).max(255).optional()
});

export type Question = z.infer<typeof questionSchema>;
export const questionDefault: Question = {
  id: 0,
  testId: 0,
  testName: "",
  questionText: ""
};

