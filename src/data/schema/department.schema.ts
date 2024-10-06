import { z } from "zod";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const departmentSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(0).max(255).optional(),
    managerId: z.coerce.number().optional(),
    managerName: z.string().min(0).max(255).optional()
});

export type Department = z.infer<typeof departmentSchema>;
export const departmentDefault: Department = {
    id: 0,
    name: "",
};

//Result
export type DepartmentUser = {
    id: number,
    name: string,
    email: string
}
