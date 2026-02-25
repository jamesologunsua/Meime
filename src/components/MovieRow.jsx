import { useRef } from "react";
import MovieCard from "./MovieCard";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

export default function MovieRow({ title, movies = [], isLoading }) {
  const rowRef = useRef(null)

/*   useEffect(() => {
    const loadMovies = async () => {
      const response = await fetchFunction()
      setMovies(response.data.results)
    }

    loadMovies();
  }, [fetchFunction]) */

  const scrollLeft = () => {
    rowRef.current.scrollBy({
      left: -500,
      behavior: "smooth",
    })
  }

  const scrollRight = () => {
    rowRef.current.scrollBy({
      left: 500,
      behavior: "smooth",
    })
  }

  return (
    <div className="px-10 mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      <div className="relative group">
        {/* Left Button */}
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/50 opacity-0 group-hover:opacity-100 transition"
        >
          ◀
        </button>

        {/* Movies Container */}
        {/* <div 
          ref={rowRef}
          className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              image={`${IMAGE_BASE}${movie.poster_path}`}
              className="min-w-50 h-75 bg-gray-800 rounded cursor-pointer transform hover:scale-110 transition duration-300"
            />
          ))}
        </div> */}

        {isLoading ? (
          <div className="flex">
            {[...Array(50)].map((_, index) => (
              <div 
                key={index}
                className="min-w-50 h-75 bg-gray-800 rounded mr-4 animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div
            ref={rowRef}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
          >
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                image={`${IMAGE_BASE}${movie.poster_path}`}
                className="min-w-50 h-75 bg-gray-800 rounded cursor-pointer transform hover:scale-110 transition duration-300"
              />
            ))}
          </div>
        )}

        {/* Right Button */}
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/50 opacity-0 group-hover:opacity-100 transition"
        >
          ▶
        </button>
      </div>
    </div>
  )
}