import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { MdAccountCircle } from "react-icons/md"
import { IoSearchOutline } from "react-icons/io5"
import { getMoviesByCategory } from "../redux/movieSlice"
import { searchMulti } from "../services/tmdb"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const inputRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const trimmedQuery = query.trim()

    if (!trimmedQuery) return

    dispatch(
      getMoviesByCategory({
        category: "searchResults",
        fetchFunction: () => searchMulti(trimmedQuery),
      }),
    )
    setIsOpen(false)
  }

  const handleInputKeyDown = (e) => {
    if (e.key === "Escape") setIsOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 
        ${scrolled ? "bg-black/90 backdrop-blur-md" : "bg-transparent"}`}
    >
      <div className="absolute inset-0 bg-linear-to-b from-black/60 to-transparent"></div>
      <div className="flex items-center justify-between px-10 py-5 relative z-10">
        <h1 className="text-2xl font-bold text-red-600 tracking-wide">MEIME</h1>

        <ul className="hidden md:flex gap-8 text-lg font-medium">
          <Link to="/"><li className="hover:text-red-500 cursor-pointer">Home</li></Link>
          <Link to="/tv-shows"><li className="hover:text-red-500 cursor-pointer">TV Shows</li></Link>
          <Link to="/movies"><li className="hover:text-red-500 cursor-pointer">Movies</li></Link>
          <Link to="/my-list"><li className="hover:text-red-500 cursor-pointer">My List</li></Link>
          <Link to="/kdrama"><li className="hover:text-red-500 cursor-pointer">K-Drama</li></Link>
        </ul>

        <div className="relative flex items-center">
          {!isOpen && (
            <IoSearchOutline
              size={35}
              className="text-white cursor-pointer hover:text-red-500 text-9xl"
              onClick={() => setIsOpen(true)}
            />
          )}

          {isOpen && (
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="bg-gray-800 focus:outline-none focus:ring-1 focus:ring-white px-3 py-2 text-sm text-white w-48 transition-all duration-300"
              />
              <button
                type="submit"
                className="text-white cursor-pointer hover:text-red-500"
                aria-label="Search movies"
              >
                <IoSearchOutline size={24} />
              </button>
            </form>
          )}
        </div>

        <MdAccountCircle size={32} className="text-red-600 cursor-pointer hover:text-red-500" />
      </div>
    </nav>
  )
}
