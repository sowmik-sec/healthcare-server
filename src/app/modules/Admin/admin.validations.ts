import { z } from "zod";

const updateAdminZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});

export const AdminValidations = {
  updateAdminZodSchema,
};
