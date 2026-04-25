import { Router } from "express"
import { admin } from "./admin"
import { auth } from "./auth"
import { books } from "./books"

export const router = Router()

router.use("/admin", admin)
router.use("/auth", auth)
router.use("/books", books)
