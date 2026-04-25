import type { Request, Response, NextFunction } from "express"
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from "../constants"
import * as jwt from "../jwt"
import { prisma } from "../prisma"
import { createAccessToken, createRefreshToken } from "../services/auth"

export const authenticateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.userId = null
    req.userRoles = []

    const accessToken = await jwt.verifySafe(req.cookies[ACCESS_TOKEN_NAME])

    if (accessToken !== null) {
      req.userId = accessToken.userId
      req.userRoles = accessToken.userRoles

      next()

      return
    }

    // TODO: delete expired refresh token revocation references from the database
    const refreshToken = await jwt.verifySafe(req.cookies[REFRESH_TOKEN_NAME])

    if (refreshToken === null) {
      next()

      return
    }
    
    const refreshTokenRecord = await prisma.refreshToken.findUnique({
      where: {
        jti: refreshToken.jti
      }
    })

    const hasTokenBeenRevoked = !Boolean(refreshTokenRecord)

    if (hasTokenBeenRevoked) {
      next()

      return
    }

    const newAccessToken = await createAccessToken(refreshToken.userId, refreshToken.userRoles)
    const newRefreshToken = await createRefreshToken(refreshToken.userId, refreshToken.userRoles)

    req.userId = refreshToken.userId
    req.userRoles = refreshToken.userRoles

    res.cookie(ACCESS_TOKEN_NAME, newAccessToken)
    res.cookie(REFRESH_TOKEN_NAME, newRefreshToken)

    next()
  } catch (error) {
    next(error)
  }
}
