import "./Book.css"
import React from "react"
import { useBook } from "../hooks/useBook"
import { useParams } from "react-router-dom"
import { SVG } from "../components/SVG"
import CalendarSVG from "../assets/calendar.svg?raw"

export const Book: React.FC = () => {
  const { id } = useParams()
  const { book } = useBook(parseInt(id || "0"))

  return book && (
    <section id="book">
      <h2>{book.title}</h2>
      <h3>{book.author}</h3>
      <small><SVG xml={CalendarSVG} />{book.yearPublished}</small>
      <p>{book.description}</p>
    </section>
  )
}

export default Book
