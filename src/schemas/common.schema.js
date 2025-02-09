//@ts-ignore
import { z } from "zod";

export const idValidation = z
  .string()
  .refine((data) => !Number.isNaN(Number(data)), "ID must be a numeric value")
  .transform(Number)
  .refine((num) => num > 0, "ID must be a positive number");

export const idSchema = z.object({
  params: z.object({ id: idValidation }),
});


const idSchema1 = z
  .string()
  .refine((data) => !Number.isNaN(Number(data)), "ID must be a numeric value")
  .transform(Number)
  .refine((num) => num > 0, "ID must be a positive number");