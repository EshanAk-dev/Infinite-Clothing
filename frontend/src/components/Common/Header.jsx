import Topbar from "../Layout/Topbar"
import Navbar from "./Navbar"


const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-lg">
      {/* Topbar */}
      <Topbar />

      {/* Navbar */}
      <Navbar />

      {/* Cart Drawer */}
    </header>
  )
}

export default Header
