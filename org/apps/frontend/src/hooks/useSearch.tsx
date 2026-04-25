import { gql } from "@apollo/client"
import React from "react"
import { apolloClient } from "../graphql"
import { useAuth } from "./useAuth"

const DEBOUNCE_MS = 100

const BOOKS_QUERY = gql/*graphql*/`
  query Query($search: String!) {
    books(search: $search) {
      id
      title
      author
      description
      yearPublished
      uri
    }
  }
`

export interface Book {
  id: number
  title: string
  author: string
  description: string
  uri: string
  yearPublished: number
}

type SearchContextValue = {
  search: string
  books: Book[]
  setSearch: (search: string) => void
}

const SearchContext = React.createContext<SearchContextValue | null>(null)

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth()
  const [search, setSearch] = React.useState("")
  const [books, setBooks] = React.useState<Book[]>([])
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const query = React.useCallback(async () => {
    try {
      const { data } = await apolloClient.query<{
        books: Book[]
      }>({
        query: BOOKS_QUERY,
        variables: { search },
      })

      if (!data) return
      
      setBooks(data.books)
    } catch (error) {
      console.error(error)
    }
  }, [search])

  React.useEffect(() => {
    if (!auth.ready) return

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      void query()
    }, DEBOUNCE_MS)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [search, auth.ready, query])

  React.useEffect(() => {
    void query()
  }, [])

  return (
    <SearchContext.Provider value={{ search, setSearch, books }}>
      {children}
    </SearchContext.Provider>
  )
}


export const useSearch = () => {
  const context = React.useContext(SearchContext)

  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  
  return context
}
