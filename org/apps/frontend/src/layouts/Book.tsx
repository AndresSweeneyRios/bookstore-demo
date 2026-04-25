import { Footer } from "../components/Footer"
import "./Book.css"

const BookLayout: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <div id="book-layout">
      <div id="book-layout-content">
        {props.children}
      </div>
      <Footer/>
    </div>
  )
}

export default BookLayout
