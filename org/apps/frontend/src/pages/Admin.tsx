import React from "react"
import "./Admin.css"
import { Input } from "../components/Input"
import { Button } from "../components/Button"
import { useAuth } from "../hooks/useAuth"
import { useLoading } from "../hooks/useLoading"
import { CreateBookPayloadSchema, formatZodError } from "@libs/schema"
import { stringifyError } from "../utils/errors"
import { useAdmin } from "../hooks/useAdmin"
import UploadSVG from "../assets/upload.svg?raw"
import UserSVG from "../assets/user.svg?raw"
import CalendarSVG from "../assets/calendar.svg?raw"
import BookOpenSVG from "../assets/book-open.svg?raw"
import AlignCenterSVG from "../assets/align-center.svg?raw"
import { useModal } from "../hooks/useModal"

const DEFAULT_YEAR = 1970

const Success = () => {
  return (
    <div id="admin-success">
      <h1>Success!</h1>
    </div>
  )
}

// TODO: refactor createBook UI into a separate component
export const Admin: React.FC = () => {
  const auth = useAuth()
  const modal = useModal()
  const admin = useAdmin()
  const { setLoading } = useLoading()

  const [title, setTitle] = React.useState("")
  const [author, setAuthor] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [yearPublished, setYearPublished] = React.useState(DEFAULT_YEAR)
  const [uri, _setUri] = React.useState("")
  const [error, setError] = React.useState("")
  const [valid, setValid] = React.useState(false)

  React.useEffect(() => {
    setValid(false)

    if (!title || !author || !description) {
      setError("")

      return
    }

    const schema = CreateBookPayloadSchema.safeParse({
      title,
      author,
      description,
      yearPublished,
      uri,
    })

    if (!schema.success) {
      setError(formatZodError(schema.error))

      return
    }

    setError("")
    setValid(true)
  }, [title, author, description, yearPublished])

  const submit = React.useCallback(async () => {
    if (!valid) {
      return
    }

    setLoading(true)

    try {
      await admin.createBook({
        title,
        author,
        description,
        yearPublished,
        uri,
      })

      setTitle("")
      setAuthor("")
      setDescription("")
      setYearPublished(DEFAULT_YEAR)

      modal.setContent(<Success />)
    } catch (error) {
      setError(stringifyError(error))
    }

    setLoading(false)
  }, [title, author, description, yearPublished, valid])

  // TODO: move ROLE_ADMIN to shared configuration so this isn't hardcoded
  const isAdmin = auth.userRoles.includes('admin')
  const show = auth.authenticated && isAdmin

  if (auth.authenticated && !isAdmin) {
    location.replace('/')

    return null
  }

  return show && (
    <section id="admin">
      <h2>Create Book</h2>
      <Input 
        type="string"
        placeholder="Title..." 
        svgXml={BookOpenSVG} 
        text={title} 
        setText={setTitle} 
      />
      <Input 
        type="string"
        placeholder="Author..." 
        svgXml={UserSVG} 
        text={author} 
        setText={setAuthor} 
      />
      {/* TODO: user a text area */}
      <Input 
        type="string"
        placeholder="Description..." 
        svgXml={AlignCenterSVG} 
        text={description} 
        setText={setDescription} 
      />
      <Input 
        type="string"
        placeholder="Year published..."
        svgXml={CalendarSVG} 
        text={String(yearPublished)} 
        setText={(text) => {
          const int = parseInt(text)

          if (isNaN(int)) {
            setYearPublished(0)
          } else {
            setYearPublished(int)
          }
        }} 
      />
      
      <Button svgXml={UploadSVG} disabled={!valid} onClick={() => submit()}>Submit</Button>
      {error && <small>{error}</small>}
    </section>
  )
}

export default Admin
