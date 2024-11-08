import { z } from 'zod'
import { TypeContract } from './contract.schema';


export const authSchema = z.object({
    email: z.string().min(1).max(255).email("Email không đúng định dạng"),
    password: z.string().min(1).max(255),
})
export type Auth = z.infer<typeof authSchema>;
export const authDefault: Auth = {
    email: "",
    password: "",
};

export type AccountInfo = {
    id: number,
    email: string,
    name: string,
    role: Role,
    typeContrat: TypeContract
}
export enum Role{
    Admin = 1,
    User = 2
}