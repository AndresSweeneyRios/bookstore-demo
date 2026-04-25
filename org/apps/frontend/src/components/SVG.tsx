import React from "react"

export const SVG: React.FC<{
  xml: string
}> = (props) => {
  return <span
    style={{ display: 'contents' }}
    dangerouslySetInnerHTML={{ __html: props.xml }}
  />
}
