import React from "react"

type LoadingContextValue = {
  loading: boolean
  setLoading: (value: boolean) => void
}

const LoadingContext = React.createContext<LoadingContextValue | null>(null)

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = React.useState(false)

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const context = React.useContext(LoadingContext)

  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }

  return context
}
