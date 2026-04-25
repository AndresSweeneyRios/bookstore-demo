import { env } from "../env"
import { hashPassword, verifyPassword } from "./auth"

const PASSWORD = "a90sdd90kASKDA12!@"

env.ARGON2_SECRET = "q089uja9sjdfkasdfjakq2eq1e878qawdjasdj,"

describe('Auth suite', () => {
  test('can verify passwords', async () => {
    const hash = await hashPassword(PASSWORD)

    const passwordVerified = await verifyPassword(hash, PASSWORD)

    expect(passwordVerified).toBe(true)
  })

  test('detects invalid passwords', async () => {
    const hash = await hashPassword(PASSWORD)

    const passwordVerified = await verifyPassword(hash, "98ajsd9asjdkasldkasjdl")

    expect(passwordVerified).toBe(false)
  })

  test('throws on invalid hash', async () => {
    await expect(verifyPassword("a8s9djas9dua", PASSWORD)).rejects.toThrow()
  })
})
