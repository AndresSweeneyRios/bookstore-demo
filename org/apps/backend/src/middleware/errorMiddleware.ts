import { z } from "zod"
import type { ErrorRequestHandler } from "express"
import { formatZodError } from "@libs/schema"

export const errorMiddleware: ErrorRequestHandler = async (error, req, res, next) => {
  console.error(error)

  if (error instanceof z.ZodError) {
    const message = formatZodError(error)

    res.status(400).json({
      error: "ValidationError",
      message,
    })

    return
  }

  res.status(500)
  res.end()

  return
}
