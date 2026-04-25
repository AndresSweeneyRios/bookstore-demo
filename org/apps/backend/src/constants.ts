const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

export const ACCESS_TOKEN_NAME = "access-token"
export const REFRESH_TOKEN_NAME = "refresh-token"

export const REFRESH_TOKEN_LIFESPAN_MS = DAY * 7
export const ACCESS_TOKEN_LIFESPAN_MS = HOUR

export const ROLE_USER = 'user'
export const ROLE_ADMIN = 'admin'
export const ROLES = [ROLE_USER, ROLE_ADMIN] as const

export const FRONTEND_ORIGIN = 'http://localhost:4200'

export const JWA = "ES256"
