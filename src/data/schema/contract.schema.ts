import { z } from "zod";

export const calendarUpsertHRSchema = z.object({
    id: z.coerce.number().optional(),
    timeStart: z.string().min(1).max(255).optional(),
    timeEnd: z.string().min(1).max(255).optional(),
    shiftTime: z.number().min(0).max(255).optional(),
    day: z.number().min(0).max(255).optional()
});
export type Calendar = z.infer<typeof calendarUpsertHRSchema>;

export enum TypeContract{
    Partime = 1,
    FullTime = 2
}

