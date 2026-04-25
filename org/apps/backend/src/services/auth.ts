import { ACCESS_TOKEN_LIFESPAN_MS, REFRESH_TOKEN_LIFESPAN_MS, ROLE_USER } from "../constants"
import * as jwt from "../jwt"
import { randomUUID } from "crypto"
import { prisma } from "../prisma"
import { LoginUserPayloadSchema, RegisterUserPayloadSchema } from "@libs/schema"
import argon2 from "argon2"
import { env } from "../env"

export const createAccessToken = async (userId: number, userRoles: string[]) => {
  const createdAtMs = Date.now()
  const expiresAtMs = createdAtMs + ACCESS_TOKEN_LIFESPAN_MS
  const jti = randomUUID()

  const token = await jwt.sign({
    userId,
    userRoles,
    jti,
  }, expiresAtMs)

  return token
}

export const createRefreshToken = async (userId: number, userRoles: string[]) => {
  const createdAtMs = Date.now()
  const expiresAtMs = createdAtMs + REFRESH_TOKEN_LIFESPAN_MS
  const jti = randomUUID()

  const token = await jwt.sign({
    userId,
    userRoles,
    jti,
  }, expiresAtMs)

  await prisma.refreshToken.create({
    data: {
      jti,
      createdAt: new Date(createdAtMs),
      expiresAt: new Date(expiresAtMs),
      user: {
        connect: { 
          id: userId
        }
      }
    }
  })

  return token
}

export const revokeRefreshToken = async (token: string) => {
  const payload = await jwt.verifySafe(token)

  if (!payload) {
    return
  }

  // deleteMany doesn't throw if the record doesn't exist
  await prisma.refreshToken.deleteMany({
    where: {
      jti: payload.jti
    }
  })
}

export const hashPassword = async (password: string) => {
  const hash = await argon2.hash(password, {
    secret: Buffer.from(env.ARGON2_SECRET)
  })

  return hash
}

export const verifyPassword = async (hash: string, password: string) => {
  return await argon2.verify(hash, password, {
    secret: Buffer.from(env.ARGON2_SECRET)
  })
}

export const createUser = async (payload: object) => {
  const schemaResult = RegisterUserPayloadSchema.safeParse(payload)

  if (!schemaResult.success) {
    throw schemaResult.error
  }

  const passwordHash = await hashPassword(schemaResult.data.password)

  const userRecord = await prisma.user.create({
    data: {
      email: schemaResult.data.email,
      displayName: schemaResult.data.displayName,
      passwordHash,
    },
    select: {
      id: true,
    },
  })

  await prisma.userRoles.create({
    data: {
      role: ROLE_USER,
      user: {
        connect: {
          id: userRecord.id
        }
      }
    }
  })

  return {
    userId: userRecord.id,
    userRoles: [ROLE_USER],
  }
}

export const loginUser = async (payload: object) => {
  const schemaResult = LoginUserPayloadSchema.safeParse(payload)

  if (!schemaResult.success) {
    throw schemaResult.error
  }

  const userRecord = await prisma.user.findUnique({
    select: {
      id: true,
      passwordHash: true,
    },
    where: {
      email: schemaResult.data.email,
    }
  })

  if (!userRecord) {
    console.log('Invalid login attempted: no userRecord')

    return null
  }

  const passwordVerified = await verifyPassword(userRecord.passwordHash, schemaResult.data.password)

  if (!passwordVerified) {
    console.log('Invalid login attempted: wrong password')

    return null
  }

  const roleRecords = await prisma.userRoles.findMany({
    select: {
      role: true,
    },
    where: {
      userId: userRecord.id
    },
  })

  if (!roleRecords) {
    console.log('Invalid login attempted: no roles')

    return null
  }

  const roles = roleRecords.map(({ role }) => role)

  return {
    userId: userRecord.id,
    userRoles: roles, 
  }
}
