import { z } from "zod";
export const webSchema = z.object({
    id: z.coerce.number().optional(),     
    name: z.string().min(0).max(255).optional(),
    webApi: z.string().min(0).max(255).optional()
});

export type Web = z.infer<typeof webSchema>;
export const webDefault: Web = {
    id: 0,
    name: "",
    webApi: ""
};
