import { gql } from "@apollo/client"
import React from "react"
import { apolloClient } from "../graphql"
import { useAuth } from "./useAuth"
import { Book } from "./useSearch"
import { api } from "../utils/api"
import { FavoriteBookPayload, FavoriteBookPayloadSchema } from "@libs/schema"

const BOOKS_QUERY = gql/*graphql*/`
  query Query {
    favorites {
      book {
        id
        title
        author
        description
        yearPublished
        uri
      }
    }
  }
`

type FavoritesContextValue = {
  favorites: Book[]
  addFavorite: (book: Book) => void
  removeFavorite: (book: Book) => void
  getIsFavorite: (book: Book) => boolean
}

const FavoritesContext = React.createContext<FavoritesContextValue | null>(null)

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth()
  const [favorites, setFavorites] = React.useState<Book[]>([])
  const [ready, setReady] = React.useState<boolean>()

  const query = React.useCallback(async () => {
    try {
      const { data } = await apolloClient.query<{
        favorites: {
          book: Book
        }[]
      }>({
        query: BOOKS_QUERY,
      })

      if (!data) return
      
      setFavorites(data.favorites.map(({ book }) => book))
    } catch (error) {
      console.error(error)
    }
  }, [])

  const addFavorite = React.useCallback(async (book: Book) => {
    setFavorites([...favorites, book])

    try {
      await api.post('/books/add-favorite', FavoriteBookPayloadSchema.parse({
        bookId: book.id
      } satisfies FavoriteBookPayload))
    } catch (error) {
      console.error(error)
    }
  }, [favorites])

  const removeFavorite = React.useCallback(async (book: Book) => {
    setFavorites(favorites.filter(({ id }) => id !== book.id))

    try {
      await api.post('/books/remove-favorite', FavoriteBookPayloadSchema.parse({
        bookId: book.id
      } satisfies FavoriteBookPayload))
    } catch (error) {
      console.error(error)
    }
  }, [favorites])

  const getIsFavorite = React.useCallback((book: Book) => {
    return favorites.some(({ id }) => book.id === id)
  }, [favorites])

  React.useEffect(() => {
    if (ready || !auth.ready || !auth.authenticated) return

    setReady(true)

    query()
  }, [auth.ready, auth.authenticated, ready, query])

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, getIsFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}


export const useFavorites = () => {
  const context = React.useContext(FavoritesContext)

  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  
  return context
}
