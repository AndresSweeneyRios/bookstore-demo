import * as jwt from "./jwt"
import { env } from "./env"
import { JWTPayload, JWTPayloadSchema } from "@libs/schema"
import * as jose from "jose-node-cjs-runtime"

const generateAndAssignKeyPair = async () => {
  const {
    privateKey,
    publicKey,
  } = await jwt.generateKeyPair()

  console.log('GENERATED KEYPAIR\n\n', privateKey, '\n\n', publicKey)
  
  env['PRIVATE_KEY'] = privateKey
  env['PUBLIC_KEY'] = publicKey
}

const PAYLOAD: JWTPayload = {
  userId: 0,
  userRoles: ['admin', 'user'],
  jti: "TEST_JWT"
}

const INVALID_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"

const LIFESPAN = 1_000_000

describe('JWT Suite', () => {
  beforeAll(async () => {
    await generateAndAssignKeyPair()
  })

  it('generates valid keypairs', async () => {
    expect(env['PRIVATE_KEY']).toBeDefined()
    expect(env['PUBLIC_KEY']).toBeDefined()

    await expect(jose.importJWK(JSON.parse(env.PRIVATE_KEY))).resolves.toBeTruthy()
    await expect(jose.importJWK(JSON.parse(env.PUBLIC_KEY))).resolves.toBeTruthy()
  })

  it('signs & verifies valid tokens', async () => {
    const expiresAtMs =  Date.now() + LIFESPAN

    const token = await jwt.sign(PAYLOAD, expiresAtMs)

    expect(token).toEqual(expect.any(String))

    const verifyPromise = jwt.verify(token)

    await expect(verifyPromise).resolves.toMatchObject(PAYLOAD)

    const payload = await verifyPromise

    const parsed = JWTPayloadSchema.safeParse(payload)

    expect(parsed?.success).toBe(true)
  })

  it('throws when verifying invalid tokens', async () => {
    const verifyPromise = jwt.verify(INVALID_JWT)

    await expect(verifyPromise).rejects.toThrow()
  })

  it('throws on expired tokens', async () => {
    const expiresAtMs = 0

    const token = await jwt.sign(PAYLOAD, expiresAtMs)

    const verifyPromise = jwt.verify(token)

    await expect(verifyPromise).rejects.toThrow()
  })

  it('throws attempting to sign invalid payloads', async () => {
    await expect(jwt.sign({ blah: "asdasd" } as any, LIFESPAN)).rejects.toThrow()
    await expect(jwt.sign("a98sduj9asdj" as any, LIFESPAN)).rejects.toThrow()
    await expect(jwt.sign(undefined as any, LIFESPAN)).rejects.toThrow()
    await expect(jwt.sign(Infinity as any, LIFESPAN)).rejects.toThrow()
  })
})
