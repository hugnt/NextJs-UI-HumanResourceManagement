import { z } from "zod";

export const calendarSchema = z.object({
    id: z.coerce.number().optional(),
    timeStart: z.string().min(1).max(255).optional(),
    timeEnd: z.string().min(1).max(255).optional(),
    shiftTime: z.number().min(0).max(255).optional(),
    day: z.number().min(0).max(255).optional()
});
export type Calendar = z.infer<typeof calendarSchema>;

export type ShiftGroup = {
    shiftTime: ShiftTime,
    calendarResult : Calendar[]
}

//Enum
export enum Day {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}
export enum ShiftTime {
    Morning = 1,
    Afternoon = 2,
    Evening = 3
}
