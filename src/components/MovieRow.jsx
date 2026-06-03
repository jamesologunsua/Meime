import { useRef } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import MovieCard from "./MovieCard"

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

export default function MovieRow({ title, movies = [], isLoading }) {
  const rowRef = useRef(null)

  const scrollLeft = () => {
    if (!rowRef.current) return

    rowRef.current.scrollBy({
      left: -500,
      behavior: "smooth",
    })
  }

  const scrollRight = () => {
    if (!rowRef.current) return

    rowRef.current.scrollBy({
      left: 500,
      behavior: "smooth",
    })
  }

  return (
    <section className="mb-8 px-4 sm:px-10">
      <h2 className="mb-4 text-xl font-bold sm:text-2xl">{title}</h2>

      <div className="group relative">
        <button
          type="button"
          onClick={scrollLeft}
          className="absolute bottom-0 left-0 top-0 z-10 hidden w-12 items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100 md:flex"
          aria-label={`Scroll ${title} left`}
        >
          <FaChevronLeft />
        </button>

        {isLoading ? (
          <div className="flex overflow-hidden">
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className="mr-4 h-[15rem] min-w-[10rem] animate-pulse rounded bg-gray-800 sm:h-[18.75rem] sm:min-w-[12.5rem]"
              />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="rounded border border-gray-800 bg-gray-900/60 px-4 py-8 text-sm text-gray-400">
            Nothing to show here right now.
          </div>
        ) : (
          <div
            ref={rowRef}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
          >
            {movies.map((movie) => (
              <MovieCard
                key={`${movie.media_type || "movie"}-${movie.id}`}
                movie={movie}
                image={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={scrollRight}
          className="absolute bottom-0 right-0 top-0 z-10 hidden w-12 items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100 md:flex"
          aria-label={`Scroll ${title} right`}
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  )
}
