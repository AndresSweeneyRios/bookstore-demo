import { Router } from "express"
import { prisma } from "../prisma"
import { FavoriteBookPayloadSchema } from "@libs/schema"

export const books = Router()

books.post("/add-favorite", async (req, res, next) => {
  try {
    if (req.userId === null) {
      res.status(401).end()

      return
    }

    const payload = FavoriteBookPayloadSchema.parse(req.body)

    await prisma.favorite.create({
      data: {
        user: {
          connect: {
            id: req.userId
          }
        },

        book: {
          connect: {
            id: payload.bookId
          }
        }
      }
    })

    res.status(200).end()
  } catch (error) {
    next(error)
  }
})

books.post("/remove-favorite", async (req, res, next) => {
  try {
    if (req.userId === null) {
      res.status(401).end()

      return
    }

    const payload = FavoriteBookPayloadSchema.parse(req.body)

    await prisma.favorite.deleteMany({
      where: {
        bookId: payload.bookId,
        userId: req.userId,
      }
    })

    res.status(200).end()
  } catch (error) {
    next(error)
  }
})
