import "./Modal.css"
import { useModal } from "../hooks/useModal"
import React from "react"
import { Button } from "./Button"
import ExitSVG from "../assets/x.svg?raw"

export const Modal: React.FC = () => {
  const { content, setContent } = useModal()
  const modalRef = React.useRef<HTMLDivElement>(null)

  return content && (
    <div id="modal" ref={modalRef} onClick={(e) => {
      if (e.target !== modalRef.current) {
        return
      }

      setContent(null)
    }}>
      <div className="content">
        <Button className="exit" svgXml={ExitSVG} onClick={() => setContent(null)} />
        {content}
      </div>
    </div>
  )
}
