import "./Loading.css"
import React from "react"
import { useLoading } from "../hooks/useLoading"

export const Loading: React.FC = () => {
  const { loading } = useLoading()

  return loading && (
    <div id="loading">
      <p>Loading...</p>
    </div>
  )
}
