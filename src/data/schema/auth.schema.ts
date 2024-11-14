import { z } from 'zod'


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
}
export enum Role{
    Admin = 1,
    Partime = 2,
    Fulltime = 3
}
export type AccountUpdate = {
    userName: string,
    password: string,
    email: string
}