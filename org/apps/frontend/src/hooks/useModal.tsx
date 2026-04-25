import React from "react"

type ModalContextValue = {
  content: React.ReactNode
  setContent: (content: React.ReactNode) => void
}

const ModalContext = React.createContext<ModalContextValue | null>(null)

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = React.useState<React.ReactNode>(null)

  return (
    <ModalContext.Provider value={{ content, setContent }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = React.useContext(ModalContext)

  if (!context) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  
  return context
}
