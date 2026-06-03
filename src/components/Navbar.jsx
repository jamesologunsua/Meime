import { useEffect, useRef, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { useDispatch } from "react-redux"
import { IoSearchOutline } from "react-icons/io5"
import { getMoviesByCategory } from "../redux/movieSlice"
import { searchMulti } from "../services/tmdb"

const navItems = [
  { label: "Home", to: "/" },
  { label: "TV Shows", to: "/tv-shows" },
  { label: "Movies", to: "/movies" },
  { label: "K-Drama", to: "/kdrama" },
]

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

  const getNavLinkClass = ({ isActive }) =>
    `whitespace-nowrap transition-colors hover:text-red-500 ${
      isActive ? "text-red-500" : "text-white"
    }`

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 
        ${scrolled ? "bg-black/90 backdrop-blur-md" : "bg-transparent"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-transparent"></div>
      <div className="relative z-10 flex flex-col gap-4 px-4 py-4 sm:px-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-bold tracking-wide text-red-600">
            MEIME
          </Link>

          {!isOpen && (
            <button
              type="button"
              className="text-white transition-colors hover:text-red-500 md:hidden"
              onClick={() => setIsOpen(true)}
              aria-label="Open search"
            >
              <IoSearchOutline size={28} />
            </button>
          )}
        </div>

        <ul className="flex gap-5 overflow-x-auto text-sm font-medium no-scrollbar sm:text-base md:gap-8 md:text-lg">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={getNavLinkClass}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="relative flex items-center">
          {!isOpen && (
            <button
              type="button"
              className="hidden text-white transition-colors hover:text-red-500 md:block"
              onClick={() => setIsOpen(true)}
              aria-label="Open search"
            >
              <IoSearchOutline size={32} />
            </button>
          )}

          {isOpen && (
            <form onSubmit={handleSearchSubmit} className="flex w-full items-center gap-2 md:w-auto">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search movies or TV..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="w-full bg-gray-800 px-3 py-2 text-sm text-white transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-white md:w-56"
              />
              <button
                type="submit"
                className="text-white transition-colors hover:text-red-500"
                aria-label="Search"
              >
                <IoSearchOutline size={24} />
              </button>
            </form>
          )}
        </div>
      </div>
    </nav>
  )
}
