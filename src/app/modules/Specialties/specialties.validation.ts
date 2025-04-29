import { z } from "zod";

const createSpecialtiesZodSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
});

export const SpecialtiesValidation = {
  createSpecialtiesZodSchema,
};
