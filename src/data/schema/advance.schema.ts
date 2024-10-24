import { z } from "zod";

export const advanceSchema = z.object({
  id: z.coerce.number().optional(),
  amount: z.coerce.number().positive("Advance must be positive!"),
  payPeriod: z.string().min(0).max(255),
  employeeId: z.coerce.number().positive("EmployeeId is not valid"),
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
  payPeriod: "",
  employeeId:0,
  reason:"",
  note:"",
  status:0,
  employeeName:"",
  statusName:"Chờ duyệt"
};