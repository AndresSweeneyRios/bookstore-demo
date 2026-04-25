import * as Generated from '../../prisma-client'
import { configureEnviroment } from './configureEnvironment'

configureEnviroment()

export const prisma = new Generated.PrismaClient()

export interface Context {
  prisma: typeof prisma,
  userId: number | null
  userRoles: string[]
}

export {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
} from '../../prisma-client/runtime/library'
