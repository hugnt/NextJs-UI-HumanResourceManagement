import { z } from "zod";
export const recruitmentWebSchema = z.object({
    webId: z.coerce.number().optional(), 
    jobPostingId: z.coerce.number().optional(),
});

export type RecruitmentWeb = z.infer<typeof recruitmentWebSchema>;
export const recruitmentWebDefault: RecruitmentWeb = {
    webId: 0,
    jobPostingId: 0,
};
