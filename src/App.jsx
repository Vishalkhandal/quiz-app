import { Outlet } from "react-router"
import { Header } from "./components/Header"
import Container from "./components/Container"
import Footer from "./components/Footer"

// import { Categories } from "./pages/Categories.jsx"

function App() {

  return (
    <>
      <Container>
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </Container>
    </>
  )
}

export default App
