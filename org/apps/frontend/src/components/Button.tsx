import React from "react"
import "./Button.css"
import { SVG } from "./SVG"

export const Button: React.FC<{
  svgXml?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  svgXml,
  children,
  className,
  
  ...buttonProps
}) => {
  return (
    <button 
      className={
        className ? `${className} button` : `button`
      }
      
      {...buttonProps}
    >
      {svgXml && <SVG xml={svgXml} />}
  
      {children && <span>
        {children}
      </span>}
    </button>
  )
}
