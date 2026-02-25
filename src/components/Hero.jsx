import { useSelector } from "react-redux"
import { useMemo } from "react"
import { useEffect, useState } from "react";

const IMAGE_BASE = "https://image.tmdb.org/t/p/original";

export default function Hero() {
  const trending = useSelector((state) => state.movies.categories.trending)
  const loading = useSelector((state) => state.movies.loading.trending)

  const topTen = useMemo(() => trending ? trending.slice(0, 10) : [], [trending])
  const [currentIndex, setCurrentIndex] = useState(0)

  //Auto change featured movie every 10 seconds
  useEffect(() => {
    if (topTen.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev === topTen.length - 1 ? 0 : prev + 1)}, 10000)

    return () => clearInterval(interval)
  }, [topTen])

  /* if (loading || topTen.length === 0) {
    return (
      <div className="h-[80vh] bg-gray-900 animate-pulse"></div>
    )
  } */

    /* const featuredMovie = useMemo(() => {
      if (!trending || trending.length === 0) return null
      const randomIndex = Math.floor(Math.random() * trending.length)
      return trending[randomIndex]
    }, [trending]) */

  const featuredMovie = topTen[currentIndex]

  if (loading || !featuredMovie) {
    return (
      <div className="h-[80vh] bg-gray-900 animate-pulse"></div>
    )
  }

  return (
    <header className="relative h-[80vh] bg-cover bg-center flex items-center"
      style={{
        backgroundImage: `url('${IMAGE_BASE}${featuredMovie.backdrop_path}')`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black vai-black/60 to transparent"></div>

      <div className="relative z-10 px-10 max-w-2xl">
        <h1 className="text-5xl font-extra-gray-300 mb-6">
          {featuredMovie.title || featuredMovie.name}
        </h1>

        <p className="max-w-xl text-lg text-gray-300 mb-6 line-clamp-3">
          {featuredMovie.overview.length > 150
            ? featuredMovie.overview.substring(0, 150) + "..."
            : featuredMovie.overview
          }
        </p>

        <div className="flex gap-4">
          <button 
            className="bg-white text-black px-6 py-2 rounded font-semibold"
            onClick={() => alert("Play movie")}
          >
            ▶ Play
          </button>

          <button 
            className="bg-gray-700/80 px-6 py-2 rounded font-semibold hover:bg-gray-700"
            onClick={() => alert("Details")}
          >
            More Info
          </button>
        </div>
      </div>
    </header>
  )
}