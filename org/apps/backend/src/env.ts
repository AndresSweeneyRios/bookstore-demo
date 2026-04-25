import path from "path"

const DEFAULT_KEYS = [
  "POSTGRES_DB",
  "POSTGRES_PASSWORD",
  "POSTGRES_USER",
  "EXPRESS_PORT",
  "EXPRESS_HOSTNAME",
  "NODE_ENV",
  "PUBLIC_KEY",
  "PRIVATE_KEY",
  "ARGON2_SECRET",
  "UPLOADS_PATH",
] as const

type Env = Record<typeof DEFAULT_KEYS[number], string>

export const env = {} as Env

for (const key of DEFAULT_KEYS) {
  env[key] = process.env[key]!
}

const DEFAULT_UPLOADS_PATH = path.join(process.cwd(), 'uploads')

if (!env.UPLOADS_PATH) {
  env.UPLOADS_PATH = DEFAULT_UPLOADS_PATH
}
