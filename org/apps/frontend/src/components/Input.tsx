import React from "react"
import "./Input.css"
import { SVG } from "./SVG"

export const Input: React.FC<{
  svgXml?: string
  text: string
  setText: (text: string) => void
} & React.InputHTMLAttributes<HTMLInputElement>> = ({
  svgXml,
  text,
  setText,

  ...inputProps
}) => {
  const input = React.useRef<HTMLInputElement>(null)

  return (
    <div className="input" onClick={() => input.current?.focus()}>
      {svgXml && <SVG xml={svgXml} />}
      
      <input
        {...inputProps}
        ref={input}
        value={text}
        onChange={(e) => {
          setText(e.target.value)
        }}
      />
    </div>
  )
}
