import { z } from "zod";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const jobPostingSchema = z.object({
    id: z.coerce.number().optional(),
    positionName: z.string().max(255).optional(),
    positionId: z.coerce.number().optional(),
    description: z.string().max(255).optional(),
    location: z.string().max(255).optional(),
    salaryRangeMin: z.coerce.number().optional(),
    salaryRangeMax: z.coerce.number().optional(),
    postingDate: z.coerce.date().optional(),  
    expirationDate: z.coerce.date().optional(),  
    experienceRequired: z.string().max(255).optional(),
    employeeName : z.string().max(255).optional(),
    employeeId: z.coerce.number().optional()
});;
export type JobPosting = z.infer<typeof jobPostingSchema>;
export const jobPostingDefault: JobPosting = {
    id: 0,
    positionName: "",
    positionId: 0,
    description: "",
    location: "",
    salaryRangeMin: 0,
    salaryRangeMax: 0,
    postingDate: new Date(),
    expirationDate: new Date(),  
    experienceRequired: "",
    employeeName : "",
    employeeId: 0
};
