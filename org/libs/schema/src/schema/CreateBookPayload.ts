import { z } from "zod"

export const CreateBookPayloadSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  description: z.string().min(1),
  yearPublished: z.int(),
  uri: z.string(),
})

export type CreateBookPayload = z.infer<typeof CreateBookPayloadSchema>
