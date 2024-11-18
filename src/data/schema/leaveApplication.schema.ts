import { z } from "zod";

export enum StatusLeave {
    Draft = 1,
    Approved = 2,
    Refuse = 3
}

export const leaveApplicationSchema = z.object({
    id: z.coerce.number().optional(),
    employeeId: z.coerce.number().positive("Employee ID must be positive!").optional(),
    refuseReason: z.string().max(255).nullable().optional(),
    timeLeave: z.coerce.number().positive("Time leave must be positive!").optional(),
    statusLeave: z.nativeEnum(StatusLeave).optional(),
    description: z.string().max(255).nullable().optional(),
    replyMessage: z.string().max(255).nullable().optional()
});

export type leaveApplication = z.infer<typeof leaveApplicationSchema>;
export const leaveApplicationDefault: leaveApplication = {
    id: 0,
    employeeId: 0,
    refuseReason: "",
    timeLeave: 0,
    statusLeave: StatusLeave.Draft,
    description: "",
    replyMessage: ""
};


export type EmployeeData = {
    id:number,
    name: string
}