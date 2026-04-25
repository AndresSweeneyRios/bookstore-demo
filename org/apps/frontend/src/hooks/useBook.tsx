import React from "react"
import { apolloClient } from "../graphql"
import { gql } from "@apollo/client"
import { Book } from "./useSearch"
import { useLoading } from "./useLoading"

const BOOK_QUERY = gql/*graphql*/`
  query Query($id: Int!) {
    book(id: $id) {
      id
      title
      author
      description
      yearPublished
      uri
    }
  }
`

export const useBook = (id: number) => {
  const { setLoading } = useLoading()
  const [book, setBook] = React.useState<Book | null>(null)

  const query = React.useCallback(async () => {
    try {
      setLoading(true)

      const { data } = await apolloClient.query<{
        book: Book
      }>({
        query: BOOK_QUERY,
        variables: { id },
      })

      if (!data) return
      
      setBook(data.book)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void query()
  }, [])

  return {
    book
  }
}
