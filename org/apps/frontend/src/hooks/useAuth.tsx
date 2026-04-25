import React from "react"
import { api } from "../utils/api"
import { LoginUserPayload, LoginUserPayloadSchema, RegisterUserPayload, RegisterUserPayloadSchema } from "@libs/schema"
import { handleAxiosError, handleZodError } from "../utils/errors"

const handleAuthError = (error: unknown) => {
  console.error(error)

  handleZodError(error)
  handleAxiosError(error)

  throw JSON.stringify(error)
}

type AuthContextValue = {
  ready: boolean
  authenticated: boolean
  userId: number | null
  userRoles: string[]
  register: (payload: RegisterUserPayload) => Promise<void>
  login: (payload: LoginUserPayload) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = React.useState(false)
  const [ready, setReady] = React.useState(false)
  const [userId, setUserId] = React.useState<number | null>(null)
  const [userRoles, setUserRoles] = React.useState<string[]>([])

  const authenticate = React.useCallback(async () => {
    try {
      const { data } = await api.get<{
        userId: number | null
        userRoles: string[]
      }>("/auth/authenticate")

      setUserId(data.userId)
      setUserRoles(data.userRoles)
      setAuthenticated(data.userId !== null)
      setReady(true)
    } catch (error) {
      setAuthenticated(false)

      console.error(error)
    }
  }, [])

  const register = React.useCallback(async (payload: RegisterUserPayload) => {
    try {
      await api.post("/auth/register", RegisterUserPayloadSchema.parse(payload))

      setAuthenticated(true)
    } catch (error) {
      handleAuthError(error)
    }
  }, [])

  const login = React.useCallback(async (payload: LoginUserPayload) => {
    try {
      await api.post("/auth/login", LoginUserPayloadSchema.parse(payload))

      setAuthenticated(true)
    } catch (error) {
      handleAuthError(error)
    }
  }, [])

  const logout = React.useCallback(async () => {
    try {
      await api.post("/auth/logout")

      location.reload()
    } catch (error) {
      handleAuthError(error)
    }
  }, [])

  React.useEffect(() => {
    void authenticate()
  }, [authenticate])

  return (
    <AuthContext.Provider value={{
      ready,
      authenticated,
      userId,
      userRoles,
      register,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)

  if (!context) throw new Error("useAuth must be used within an AuthProvider")

  return context
}
