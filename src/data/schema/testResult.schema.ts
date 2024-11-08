
import { z } from "zod";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const testResultSchema = z.object({
    id: z.coerce.number().optional(),
    questionId: z.coerce.number().optional(),
    applicantId: z.coerce.number().optional(),
    applicantTestId: z.coerce.number().optional(),
    point: z.coerce.number().optional(),
    comment: z.string().max(255).optional()
});;
export type TestResult = z.infer<typeof testResultSchema>;
export const testResultDefault: TestResult = {
    id: 0,
    questionId: 0,
    applicantId: 0,
    applicantTestId: 0,
    point: 0,
    comment: ""
};
