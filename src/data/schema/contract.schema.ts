import { z } from "zod";

export const calendarUpsertHRSchema = z.object({
    id: z.coerce.number().optional(),
    timeStart: z.string().min(1).max(255).optional(),
    timeEnd: z.string().min(1).max(255).optional(),
    shiftTime: z.number().min(0).max(255).optional(),
    day: z.number().min(0).max(255).optional()
});
export type Calendar = z.infer<typeof calendarUpsertHRSchema>;

// Enum
export enum SignStatus {
  Signed = 1,
  NotSigned = 2,
}

export enum ContractStatus {
  Expired = 1,
  Valid = 2,
  Terminated = 3,
  Pending = 4,
  Approved = 5,
  Declined = 6,
}

export enum TypeContract {
  Fulltime = 2,
  Partime = 1,
}

export const contractSchema = z.object({
  id: z.coerce.number().optional(), // Primary Key
  contractSalaryId: z.coerce.number().optional(), // Foreign Key to contractSalary
  contractTypeId: z.coerce.number().optional(), // Foreign Key to contractType
  departmentId: z.coerce.number().optional(),
  positionId: z.coerce.number().optional(),
  allowanceIds: z.array(z.coerce.number()).optional(),
  insuranceIds: z.array(z.coerce.number()).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  fileURL: z.string().url("Invalid URL").optional(),
  employeeSignStatus: z.nativeEnum(SignStatus).optional(), // Enum for Employee Sign Status
  companySignStatus: z.nativeEnum(SignStatus).optional(), // Enum for Company Sign Status
  contractStatus: z.nativeEnum(ContractStatus).optional(), // Enum for Contract Status
  typeContract: z.nativeEnum(TypeContract).optional(), // Enum for Full-time Status
  //contract salary
  baseSalary: z.coerce.number().optional(),
  baseInsurance: z.coerce.number().optional(),
  requiredDays: z.coerce.number().optional(),
  wageDaily: z.coerce.number().optional(),
  requiredHours: z.coerce.number().optional(),
  wageHourly: z.coerce.number().optional(),
  factor: z.coerce.number().optional(),
  //contract type
  contractTypeName: z.string().optional(),
  //department
  departmentName: z.string().optional(),
  //position
  positionName: z.string().optional(),
  //allowance
  allowanceResults: z.array(
    z.object({
      id: z.coerce.number().optional(),
      name: z.string().optional(),
      amount: z.coerce.number().optional(),
      terms: z.string().optional(),
    })
  ).optional(),
  allowanceName: z.string().optional(),
  amount : z.coerce.number().optional(),
  terms : z.string().optional(),
  //insurance
  insuranceName: z.string().optional(),
  percentCompany: z.coerce.number().optional(),
  percentEmployee: z.coerce.number().optional(),
  insuranceResults: z.array(
    z.object({
      id: z.coerce.number().optional(),
      name: z.string().optional(),
      percentCompany: z.coerce.number().optional(),
      percentEmployee: z.coerce.number().optional(),
    })
  ).optional(),
  //
  name: z.string().optional(),
  dateOfBirth: z.date().optional(),
  gender: z.boolean().optional(),
  address: z.string().optional(),
  countrySide: z.string().optional(),
  nationalID: z.string().optional(),
  nationalStartDate: z.date().optional(),
  nationalAddress: z.string().optional(),
  level: z.string().optional(),
  major: z.string().optional(),

  fireUrlBase: z.string().optional(),
  fileUrlSigned: z.string().optional(),
});

export type Contract = z.infer<typeof contractSchema>;

export const contractDefault: Contract = {
  id: 0,
  contractSalaryId: 0,
  contractTypeId: 0,
  departmentId: 0,
  positionId: 0,
  allowanceIds: [],
  insuranceIds: [],
  startDate: new Date(),
  endDate: new Date(),
  fileURL: "",
  employeeSignStatus: SignStatus.NotSigned,
  companySignStatus: SignStatus.NotSigned,
  contractStatus: ContractStatus.Pending,
  typeContract: TypeContract.Fulltime,
  baseSalary: 0,
  baseInsurance: 0,
  requiredDays: 0,
  wageDaily: 0,
  requiredHours: 0,
  wageHourly: 0,
  factor: 0,
  contractTypeName: "",
  departmentName: "",
  positionName: "",
  allowanceResults: [],
  insuranceResults: [], 
  name: "",
  dateOfBirth: new Date(),
  gender: true,
  address: "",
  countrySide: "",
  nationalID: "",
  nationalStartDate: new Date(),
  nationalAddress: "",
  level: "",
  major: "",

  fireUrlBase:"",
  fileUrlSigned:""
};


export const contractSchemaForm = z.object({
  id: z.coerce.number().optional(), // Primary Key
  contractSalaryId: z.coerce.number().optional(), // Foreign Key to contractSalary
  contractTypeId: z.coerce.number().optional(), // Foreign Key to contractType
  typeContract: z.nativeEnum(TypeContract).optional(), // Enum for Full-time Status,
  departmentId: z.coerce.number().optional(),
  positionId: z.coerce.number().optional(),
  allowanceIds: z.array(z.coerce.number()).optional(),
  insuranceIds: z.array(z.coerce.number()).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
 
  name: z.string().optional(),
  dateOfBirth: z.coerce.date().optional(),
  gender: z.boolean().optional(),
  address: z.string().optional(),
  countrySide: z.string().optional(),
  nationalID: z.string().optional(),
  nationalStartDate: z.coerce.date().optional(),
  nationalAddress: z.string().optional(),
  level: z.string().optional(),
  major: z.string().optional(),
});
export type ContractForm = z.infer<typeof contractSchemaForm>;
