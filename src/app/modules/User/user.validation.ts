import { z } from "zod";

const createAdmin = z.object({
  password: z.string({ required_error: "Password is required" }),
  admin: z.object({
    name: z.string({ required_error: "Name required" }),
    email: z.string({ required_error: "Email required" }),
    contactNumber: z.string({ required_error: "Contact Number is required!" }),
  }),
});

export const UserValidation = {
  createAdmin,
};
