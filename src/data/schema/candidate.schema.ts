import { z } from "zod";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export enum CandidateStatus {
    Wait = 1,
    Decline = 2,
    Pass = 3
}

export const candidateSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().max(255).optional(),
    email: z.string().max(255).optional(),
    phone: z.string().max(255).optional(),      
    fileDataStore: z.string().max(255).optional(), 
    positionId: z.coerce.number().optional(),
    positionName: z.string().max(255).optional(),
    rate: z.coerce.number().optional(), 
    testId: z.coerce.number().optional(),
    testName: z.string().max(255).optional(),
    interviewerId: z.coerce.number().optional(),
    interviewerName: z.string().max(255).optional(),
    status: z.nativeEnum(CandidateStatus).optional()
});;
export type Candidate = z.infer<typeof candidateSchema>;
export const candidateDefault: Candidate = {
    id: 0,
    name: "",
    email: "",
    phone: "",     
    fileDataStore: "", 
    positionId: 0,
    positionName: "", 
    rate:  0,
    testId:  0,
    testName:  "",
    interviewerId: 0,
    interviewerName: "",
    status: CandidateStatus.Wait
};
