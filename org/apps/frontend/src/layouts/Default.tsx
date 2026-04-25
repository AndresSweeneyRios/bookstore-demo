import { Auth } from "../components/Auth"
import { Footer } from "../components/Footer"
import { Nav } from "../components/Nav"
import "./Default.css"

const DefaultLayout: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <div id="default-layout">
      <Nav/>
      <Auth />
      <div id="default-layout-content">
        {props.children}
      </div>
      <Footer/>
    </div>
  )
}

export default DefaultLayout
