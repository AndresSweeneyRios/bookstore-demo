import React from "react"
import "./Home.css"
import { Book, useSearch } from "../hooks/useSearch"
import { Link } from "react-router-dom"
import { SVG } from "../components/SVG"
import CalendarSVG from "../assets/calendar.svg?raw"
import StarSVG from "../assets/star.svg?raw"
import { useFavorites } from "../hooks/useFavorites"
import { Button } from "../components/Button"

const Home: React.FC = () => {
  const { favorites, addFavorite, removeFavorite, getIsFavorite } = useFavorites()
  const search = useSearch()

  const BookFC: React.FC<{
    book: Book
  }> = ({ book }) => {
    const isFavorite = getIsFavorite(book)

    return (
      <Link className="book" to={`/book/${book.id}`}>
        <h3>{book.title}</h3>
        <h4>{book.author}</h4>
        <p>{book.description}</p>
        <small><SVG xml={CalendarSVG} />{book.yearPublished}</small>

        <Button
          className="set-favorite"
          svgXml={StarSVG}
          is-favorite={isFavorite ? "true" : undefined}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()

            if (isFavorite) {
              removeFavorite(book)
            } else {
              addFavorite(book)
            }
          }}
        >{isFavorite ? 'Remove favorite' : 'Add favorite'}</Button>
      </Link>
    )
  }

  return (
    <section id="home">
      <h2>Books</h2>
      <div className="books">
        {(search.books.length > 0) ? search.books.map((book, i) => {
          return <BookFC book={book} key={i} />
        }) : <p>No books found</p>}
      </div>

      {favorites.length > 0 && <>
        <h2>Favorites</h2>
        <div className="books">
          {favorites.map((book, i) => {
            return <BookFC book={book} key={i} />
          })}
        </div>
      </>}
    </section>
  )
}

export default Home
