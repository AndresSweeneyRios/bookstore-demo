import { z } from "zod"

export const FavoriteBookPayloadSchema = z.object({
  bookId: z.int()
})

export type FavoriteBookPayload = z.infer<typeof FavoriteBookPayloadSchema>
