import { CreateBookPayload, CreateBookPayloadSchema } from "@libs/schema"
import React from "react"
import { handleAxiosError, handleZodError } from "../utils/errors"
import { api } from "../utils/api"

type AdminContextValue = {
  createBook: (payload: CreateBookPayload) => Promise<void>
}

const AdminContext = React.createContext<AdminContextValue | null>(null)

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const createBook = React.useCallback(async (payload: CreateBookPayload) => {
    try {
      await api.post("/admin/create-book", CreateBookPayloadSchema.parse(payload))
    } catch (error) {
      console.error(error)
    
      handleZodError(error)
      handleAxiosError(error)
    
      throw JSON.stringify(error)
    }
  }, [])

  return (
    <AdminContext.Provider value={{ createBook }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = React.useContext(AdminContext)

  if (!context) {
    throw new Error("useAdmin must be used within a AdminProvider")
  }
  
  return context
}

export default AdminProvider
