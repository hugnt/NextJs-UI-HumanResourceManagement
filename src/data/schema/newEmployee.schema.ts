
import { z } from "zod";

/*const isDateInPast = (date: Date) => {
  const today = new Date();
  return date < today;
};*/

export const newEmployeeSchema = z.object({
  id: z.coerce.number().optional(),  
  name: z.string().min(1).max(255).optional(),  
  dateOfBirth: z.date().optional(),
  gender: z.boolean().optional(),  
  address: z.string().min(1).max(255).optional(),  
  countrySide: z.string().min(1).max(255).optional(),  
  nationalID: z.string().min(1).max(255).optional(),  
  nationalStartDate: z.date().optional(),  
  nationalAddress: z.string().min(1).max(255).optional(),  
  level: z.string().min(1).max(255).optional(),  
  major: z.string().min(1).max(255).optional(),  
});

export type newEmployee = z.infer<typeof newEmployeeSchema>;
export const newEmployeeDefault: newEmployee = {
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
  };
  
