import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { FaInfoCircle, FaPlay } from "react-icons/fa"

import { openMovieModal } from "../redux/movieSlice"
import { getMediaType } from "../services/tmdb"

const IMAGE_BASE = "https://image.tmdb.org/t/p/original"

export default function Hero() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const trending = useSelector((state) => state.movies.categories.trending)
  const loading = useSelector((state) => state.movies.loading.trending)

  const topTen = useMemo(() => (trending ? trending.slice(0, 10) : []), [trending])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (topTen.length === 0) return undefined

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === topTen.length - 1 ? 0 : prev + 1))
    }, 10000)

    return () => clearInterval(interval)
  }, [topTen])

  const featuredMovie = topTen[currentIndex]

  const handleOpenModal = () => {
    if (!featuredMovie) return

    const mediaType = getMediaType(featuredMovie)

    dispatch(openMovieModal(featuredMovie))
    navigate(`/${mediaType}/${featuredMovie.id}`, {
      state: { backgroundLocation: location },
    })
  }

  if (loading || !featuredMovie) {
    return (
      <div className="h-[80vh] bg-gray-900 animate-pulse"></div>
    )
  }

  const title = featuredMovie.title || featuredMovie.name || "Untitled"
  const imagePath = featuredMovie.backdrop_path || featuredMovie.poster_path
  const overview = featuredMovie.overview || "No overview available yet."

  return (
    <header
      className="relative flex h-[80vh] items-center bg-cover bg-center"
      style={{
        backgroundImage: imagePath ? `url('${IMAGE_BASE}${imagePath}')` : undefined,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

      <div className="relative z-10 max-w-2xl px-4 pt-24 sm:px-10">
        <h1 className="mb-6 text-4xl font-bold sm:text-5xl">
          {title}
        </h1>

        <p className="mb-6 max-w-xl text-base text-gray-300 line-clamp-3 sm:text-lg">
          {overview.length > 150 ? `${overview.substring(0, 150)}...` : overview}
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded bg-white px-5 py-2 font-semibold text-black transition hover:bg-gray-200"
            onClick={handleOpenModal}
          >
            <FaPlay size={14} />
            Trailer
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded bg-gray-700/80 px-5 py-2 font-semibold text-white transition hover:bg-gray-700"
            onClick={handleOpenModal}
          >
            <FaInfoCircle size={16} />
            More Info
          </button>
        </div>
      </div>
    </header>
  )
}
