import { z } from "zod";
const currentMonth: number = new Date().getMonth() + 1;
const currenYear: number = new Date().getFullYear();

export const advanceSchema = z.object({
  id: z.coerce.number().optional(),
  amount: z.coerce.number().positive("Advance must be positive!"),
  month: z.coerce.number().optional(),
  year: z.coerce.number().optional(),
  payPeriod: z.string().optional(),
  employeeId: z.coerce.number().positive("EmployeeId is not valid").optional(),
  reason: z.string().optional(),
  note: z.string().optional(),
  status: z.number().int().min(0).max(2),
  employeeName: z.string().optional(),
  statusName: z.string().optional(),
});

export type Advance = z.infer<typeof advanceSchema>;
export const advanceDefault: Advance = {
  id: 0,
  amount: 0,
  month:currentMonth,
  year:currenYear,
  employeeId:0,
  reason:"",
  note:"",
  status:0,
  employeeName:"",
  statusName:"Chờ duyệt"
};
