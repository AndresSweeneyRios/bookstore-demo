import { z } from "zod"

export const formatZodError = (error: z.ZodError) => {
  const formatted = error.issues.map(e => "• " + e.message)

  const message: string = formatted.join("\n\n")

  return message
}
