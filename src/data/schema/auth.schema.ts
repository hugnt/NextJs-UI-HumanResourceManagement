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