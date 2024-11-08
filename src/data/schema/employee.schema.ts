import { z } from "zod";

export const employeeSchema = z.object({
  id: z.coerce.number().optional(),
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
  positionId: z.coerce.number().optional(),
  positionName: z.string().optional(),
  departmentId: z.coerce.number().optional(),
  departmentName: z.string().optional(),
  avatar: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
});

export type Employee = z.infer<typeof employeeSchema>;
export const employeeDefault: Employee = {
  id: 0,
  name: "",
  dateOfBirth: new Date(),
  gender: false,
  address: "",
  countrySide: "",
  nationalID: "",
  nationalStartDate: new Date(),
  nationalAddress: "",
  level: "",
  major: "",
  positionId: 0,
  positionName: "",
  departmentId: 0,
  departmentName: "",
  avatar: "",
  phoneNumber: "",
  email: ""
};

export type FaceRegisResult = {
  url: string,
  statusFaceTurn: number,
  descriptor: string
}