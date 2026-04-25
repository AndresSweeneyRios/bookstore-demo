import React from "react"
import "./Nav.css"
import SearchSVG from "../assets/search.svg?raw"
import { Input } from "./Input"
import { useSearch } from "../hooks/useSearch"

export const Nav: React.FC = () => {
  const search = useSearch()
  
  return (
    <nav>
      <Input
        placeholder="Search..."
        svgXml={SearchSVG}
        text={search.search}
        setText={(text) => {
          search.setSearch(text.trimStart())
        }}
      />
    </nav>
  )
}
