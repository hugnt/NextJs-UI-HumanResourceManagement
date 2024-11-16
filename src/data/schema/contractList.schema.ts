import { z } from "zod";

export const contractListSchema = z.object({
  id: z.coerce.number().optional(), // Primary key
  contractSalaryId: z.coerce.number().optional(), // Foreign key to contractSalary
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  fileURL: z.string().url("Invalid URL").optional(),
  employeeSignStatus: z.enum(["signed", "not_signed"]),
  companySignStatus: z.enum(["signed", "not_signed"]),
  contractStatus: z.enum(["expired", "valid", "terminated", "pending", "approved", "declined"]),
  IsFulltime: z.enum(["Yes", "No"]),
});

export type Contract = z.infer<typeof contractListSchema>;
export const contractListDefault: Contract = {
  id: 0,
  contractSalaryId: 0,
  startDate: new Date(),
  endDate: new Date(),
  fileURL: "",
  employeeSignStatus: "not_signed",
  companySignStatus: "not_signed",
  contractStatus: "pending",
  IsFulltime: "Yes",
};
