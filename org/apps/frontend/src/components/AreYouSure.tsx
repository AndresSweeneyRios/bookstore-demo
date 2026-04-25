import "./AreYouSure.css"
import React from "react"
import { Button } from "./Button"
import CheckSVG from "../assets/check.svg?raw"
import ExitSVG from "../assets/x.svg?raw"

export const AreYouSure: React.FC<React.PropsWithChildren<{
  yes: () => void
  no: () => void
}>> = ({ children, yes, no }) => {
  return (
    <div id="are-you-sure">
      {children}
      <div className="controls">
        <Button svgXml={CheckSVG} onClick={() => yes()}>Yes</Button>
        <Button svgXml={ExitSVG} onClick={() => no()}>No</Button>
      </div>
    </div>
  )
}