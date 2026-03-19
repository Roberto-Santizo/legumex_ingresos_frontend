import { z } from "zod";

//login
export const loginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const loginResponseSchema = z.object({
  data: z.object({
    id: z.number(),
    name: z.string(),
    username: z.string(),
    role: z.string(),
    permissions: z.array(z.string()),
  }),
  token: z.string(),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;