import { z } from "zod"
import { PASSWORD_REGEX } from "../constants"

export const LoginUserPayloadSchema = z.object({
  email: z.email(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(PASSWORD_REGEX, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."),
})

export type LoginUserPayload = z.infer<typeof LoginUserPayloadSchema>
