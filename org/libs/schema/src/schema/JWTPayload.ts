import { z } from "zod"

export const JWTPayloadSchema = z.object({
  jti: z.string(),
  userId: z.number(),
  userRoles: z.array(z.string()),
})

export type JWTPayload = z.infer<typeof JWTPayloadSchema>
