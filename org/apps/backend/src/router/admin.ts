import { Router } from "express"
import { ROLE_ADMIN } from "../constants"
import { CreateBookPayloadSchema } from "@libs/schema"
import { prisma } from "../prisma"

export const admin = Router()

admin.post('/create-book', async (req, res, next) => {
  try {
    if (!req.userRoles.includes(ROLE_ADMIN)) {
      res.status(401).end()

      return
    }

    const payload = CreateBookPayloadSchema.parse(req.body)

    await prisma.book.create({
      data: payload
    })

    res.status(200).end()
  } catch (error) {
    next(error)
  }
})
