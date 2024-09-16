import { z } from "zod";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const personSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(0).max(255).optional(),
  age: z.coerce.number().optional(),
  address: z.string().optional(),
});

export type Person = z.infer<typeof personSchema>;
export const personDefault: Person = {
  id: 0,
  name: "",
  age: 2,
  address: "",
};
