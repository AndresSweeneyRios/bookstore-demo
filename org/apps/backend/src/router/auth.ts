import { Router } from "express"
import { createAccessToken, createRefreshToken, createUser, loginUser, revokeRefreshToken } from "../services/auth"
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from "../constants"
import { PrismaClientKnownRequestError } from "../prisma"

export const auth = Router()

auth.post('/register', async (req, res, next) => {
  try {
    const { userId, userRoles } = await createUser(req.body)

    const accessToken = await createAccessToken(userId, userRoles)
    const refreshToken = await createRefreshToken(userId, userRoles)

    res.cookie(ACCESS_TOKEN_NAME, accessToken)
    res.cookie(REFRESH_TOKEN_NAME, refreshToken)

    res.status(200).end()
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        res.status(409).json({
          error: 'UniqueConstraintViolation',
          target: error.meta?.target,
          message: `Unique constraint failed on field(s): ${JSON.stringify(error.meta?.target)}`,
        })

        console.error(error)

        return
      }
    }

    next(error)
  }
})

auth.post('/login', async (req, res, next) => {
  try {
    const user = await loginUser(req.body)

    if (user === null) {
      res.status(401).end()

      return
    }

    const { userId, userRoles } = user

    const accessToken = await createAccessToken(userId, userRoles)
    const refreshToken = await createRefreshToken(userId, userRoles)

    res.cookie(ACCESS_TOKEN_NAME, accessToken)
    res.cookie(REFRESH_TOKEN_NAME, refreshToken)

    res.status(200).end()
  } catch (error) {
    next(error)
  }
})

auth.post('/logout', async (req, res, next) => {
  try {
    const refreshToken = req.cookies[REFRESH_TOKEN_NAME] as string | undefined

    if (!refreshToken) {
      res.status(200).end()

      return
    }

    res.clearCookie(ACCESS_TOKEN_NAME)
    res.clearCookie(REFRESH_TOKEN_NAME)

    res.status(200).end()
    
    // continue without blocking
    void revokeRefreshToken(refreshToken).catch(console.error)
  } catch (error) {
    next(error)
  }
})

auth.get('/authenticate', (req, res) => {
  const { userId, userRoles } = req
  
  res.status(200).json({
    userId,
    userRoles,
  })
})
