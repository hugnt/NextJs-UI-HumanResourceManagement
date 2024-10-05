import { z } from "zod";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const contractSalarySchema = z.object({
  id: z.coerce.number().optional(),
  baseSalary: z.coerce.number().positive("Base salary percentage must be positive!").optional(),
  baseInsurance: z.coerce.number().positive("Base insurance percentage must be positive!").optional(),
  requiredDays: z.coerce.number().int().optional(),
  requiredHours: z.coerce.number().int().optional(),
  wageDaily: z.coerce.number().positive("Wage daily must be positive!").optional(),
  wageHourly: z.coerce.number().positive("Wage hourly must be positive!").optional(),
  factor: z.coerce.number().optional(),
});

export type ContractSalary = z.infer<typeof contractSalarySchema>;
export const contractSalaryDefault: ContractSalary = {
  id: 0,
  baseSalary: 0,
  baseInsurance: 0,
  requiredDays: 0,
  requiredHours: 0,
  wageDaily: 0,
  wageHourly: 0,
  factor: 0,
};