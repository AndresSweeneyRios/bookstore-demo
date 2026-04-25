import "./Footer.css"
import React from "react"

const YEAR = new Date().getFullYear()

export const Footer: React.FC = () => {
  return (
    <footer>
      <small className="copyright">
        © Example Inc. {YEAR} — All rights reserved
      </small>
    </footer>
  )
}
