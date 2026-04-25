import { env } from "./env"
import * as jose from "jose"
import { JWA } from "./constants";
import { JWTPayload, JWTPayloadSchema } from "@libs/schema"

let privateJWK: jose.KeyObject | null = null
let publicJWK: jose.KeyObject | null = null

export const getEnvironmentKeypair = async () => {
  if (privateJWK === null) {
    privateJWK = await jose.importJWK(JSON.parse(env.PRIVATE_KEY), JWA) as jose.KeyObject
  }

  if (publicJWK === null) {
    publicJWK = await jose.importJWK(JSON.parse(env.PUBLIC_KEY), JWA) as jose.KeyObject
  }

  return {
    privateJWK,
    publicJWK,
  }
}

export const generateKeyPair = async () => {
  const {
    privateKey,
    publicKey,
  } = await jose.generateKeyPair(JWA)

  return {
    privateKey: JSON.stringify(await jose.exportJWK(privateKey)),
    publicKey: JSON.stringify(await jose.exportJWK(publicKey)),
  }
}

export const verify = async (token: string) => {
  const { publicJWK } = await getEnvironmentKeypair()

  const { payload } = await jose.jwtVerify<JWTPayload>(token, publicJWK)

  return JWTPayloadSchema.parse(payload)
}

export const verifySafe = async (token: string) => {
  try {
    if (!token) {
      return null
    }

    return await verify(token)
  } catch {
    return null
  }
}

export const sign = async (payload: JWTPayload, expiresAtMs: number) => {
  const safePayload = JWTPayloadSchema.parse(payload)

  const { privateJWK } = await getEnvironmentKeypair()

  return await new jose.SignJWT(safePayload)
    .setProtectedHeader({ alg: JWA })
    .setExpirationTime(Math.floor(expiresAtMs / 1000))
    .setIssuedAt(Math.floor(Date.now() / 1000))
    .sign(privateJWK)
}
