import React from "react"
import { useAuth } from "./useAuth"
import { gql } from "@apollo/client"
import { apolloClient } from "../graphql"

const USER_QUERY = gql/*graphql*/`
  query Query {
    me {
      displayName,
    }
  }
`

type UserContextValue = {
  displayName: string,
}

const UserContext = React.createContext<UserContextValue | null>(null)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth()
  const [displayName, setDisplayName] = React.useState("")

  const query = React.useCallback(async () => {
    try {
      const { data } = await apolloClient.query<{
        me: {
          displayName: string
        }
      }>({
        query: USER_QUERY
      })

      if (!data) {
        return
      }

      setDisplayName(data.me.displayName)
    } catch (error) {
      console.error(error)
    }
  }, [])

  React.useEffect(() => {
    if (!auth.authenticated || displayName) {
      return
    }

    void query()
  }, [auth.authenticated, displayName])

  return (
    <UserContext.Provider value={{
      displayName,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = React.useContext(UserContext)

  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return context
}
