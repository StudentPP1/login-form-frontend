import { Home } from "./components/home"
import { Login } from "./components/login"
import { Profile } from "./components/profile"
import { Register } from "./components/register"
import { ThemeProvider } from "./components/theme-provider"
import { Routes, BrowserRouter, Route } from "react-router-dom"

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <>
          <BrowserRouter>
            <Routes>

              <Route path="/" element={<Home />} />

              <Route path="/auth/login" element={<Login />} />

              <Route path="/auth/register" element={<Register />} />

              <Route path="/profile" element={<Profile />} />

            </Routes>
          </BrowserRouter>
        </>
      </ThemeProvider>
    </>
  )
}

export default App
