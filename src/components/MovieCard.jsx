import { useDispatch } from "react-redux"
import { openMovieModal } from "../redux/movieSlice"
import { useLocation, useNavigate } from "react-router-dom"
import { getMediaType } from "../services/tmdb"

export default function MovieCard({ image, movie }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const title = movie.title || movie.name || "Untitled"

  const handleClick = () => {
    const mediaType = getMediaType(movie)

    dispatch(openMovieModal(movie))
    navigate(`/${mediaType}/${movie.id}`, { state: { backgroundLocation: location } })
  }

  return (
    <div 
      onClick={handleClick}
      className="h-[15rem] min-w-[10rem] cursor-pointer overflow-hidden rounded bg-gray-800 transition duration-300 hover:scale-105 sm:h-[18.75rem] sm:min-w-[12.5rem]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {image ? (
        <img 
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-gray-400">
          {title}
        </div>
      )}
    </div>
  )
}
