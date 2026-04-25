// @ts-check
/// <reference types="node" />

import * as Generated from '../prisma-client/index.js'

// TODO: DRY configureEnvironment with a shared script
const DEFAULT_POSTGRES_PORT = 5432

export const configureEnviroment = () => {
  const POSTGRES_HOSTNAME = process.env.NODE_ENV === "production" ? "postgres" : "localhost"

  process.env.POSTGRES_URL = `postgres://${
    process.env.POSTGRES_USER
  }:${
    process.env.POSTGRES_PASSWORD
  }@${
    POSTGRES_HOSTNAME
  }:${
    DEFAULT_POSTGRES_PORT
  }/${
    process.env.POSTGRES_DB
  }`
}

configureEnviroment()

export const prisma = new Generated.PrismaClient()
