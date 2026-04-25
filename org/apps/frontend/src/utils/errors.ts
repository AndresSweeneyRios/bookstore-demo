import { AxiosError } from "axios"
import { z } from "zod"
import { formatZodError } from "@libs/schema"

export const handleZodError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    throw formatZodError(error)
  }
}

export const handleAxiosError = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (error.status === 500) {
      throw "Internal server error"
    }

    if (error.status === 401) {
      throw "Invalid login. Please try again."
    }

    const message: string =
      ((typeof error.response?.data?.message === "string") && error.response?.data?.message)
      || (error.response?.data?.message && JSON.stringify(error.response?.data?.message, null, 2))
      || (error.response?.data && JSON.stringify(error.response?.data, null, 2)) 
      || error.message 
      || (error.status && String(error.status))
      || error.code 
      || "unknown error"

    throw message
  }
}

export const stringifyError = (error: unknown) => {
  if (typeof error === "string") {
    return error
  }

  return JSON.stringify(error, null, 2)
} 
