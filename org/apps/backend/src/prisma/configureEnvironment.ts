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

