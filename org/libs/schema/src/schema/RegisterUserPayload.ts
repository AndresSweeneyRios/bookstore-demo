import { z } from "zod"
import { PASSWORD_REGEX } from "../constants"

export const RegisterUserPayloadSchema = z.object({
  email: z.email(),
  
  displayName: z
    .string()
    .min(1, "Display name must be at least 1 character long."),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(PASSWORD_REGEX, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."),
})

export type RegisterUserPayload = z.infer<typeof RegisterUserPayloadSchema>
