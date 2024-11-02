import { Allowance } from "@/data/schema/allowance.schema";
import { ContractSalary } from "@/data/schema/contractSalary.schema";
import { Insurance } from "@/data/schema/insurance.schema";
import { TaxDeduction } from "@/data/schema/taxDeduction.schema";
import { ReactNode } from "react";
import { z } from "zod";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const payrollSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(0).max(255).optional(),
  amount: z.coerce.number().positive("Amount must be positive!").optional(),
  terms: z.string().min(0).max(255).optional(),
  parameterName: z.string().min(0).max(255).optional(),
});

export type Payroll = z.infer<typeof payrollSchema>;
export const payrollDefault: Payroll = {
  id: 0,
  name: "",
  amount: 0,
  terms: "",
  parameterName: "",
};


export interface PayrollPeriod {
  month: number;
  year: number;
}
export interface PayrollListUpsert {
  period:PayrollPeriod;
  employeeIds: number[];
}

export interface ColumnMeta {
  field: string;
  header: string;
  frozen: boolean;
}



export interface DynamicTableObject {
  employeeId: number;
  employeeName: string;
  departmentName: string;
  [key: string]: boolean | number | string;
}

export interface PayrollSC {
  payrollId: number;
  employeeId: number;
  employeeName: string;
  departmentName: string;
  listSCIds: number[];
}

export interface PayrollOtherSC {
  payrollId: number;
  employeeName: string;
  otherBonus:number;
  otherDeduction:number;
  positionName: string;
  departmentName: string;
}

export interface PayrollFormula {
  payrollId: number;
  employeeName: string;
  formulaId: number;
}

export interface ColumnTableHeader {
  field: string;
  header: string;
  rowSpan:number;
  colSpan:number;
  id:number;
  listParentIds:number[]
}

export interface PayrollDataTable {
  payrollId: number,
  employeeId: number,
  contractId: number,
  employeeName: string,
  positionName: string,
  departmentName: string,
  dp: Record<string, number>;
}

export interface PayrollResult {
  id: number;
  month: number; // Cần định nghĩa MonthPeriod
  year: number;
  employeeId: number;
  contractId: number;
  employeeName: string;
  positionName: string;
  departmentName: string;
  otherDeduction: number;
  otherBonus: number;
  fomulaId: number;
  listBonusIds: number[];
  listDeductionIds: number[];
  contractSalary: ContractSalary; // Cần định nghĩa ContractSalaryResult
  listAllowance: Allowance[]; // Cần định nghĩa AllowanceResult
  listInsurance: Insurance[]; // Cần định nghĩa InsuranceResult
  listTaxDeduction: TaxDeduction[]; // Cần định nghĩa TaxDeductionResult
}

export interface PayrollUpsert {
  id?: number;
  month?: number;
  year?: number;
  employeeId?: number;
  contractId?: number;
  otherDeduction?: number;
  otherBonus?: number;
  fomulaId?: number;
  listBonusIds?: number[];
  listDeductionIds?: number[];
}