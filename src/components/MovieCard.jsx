import { useDispatch } from "react-redux"
import { openMovieModal } from "../redux/movieSlice"
import { useLocation, useNavigate } from "react-router-dom"

export default function MovieCard({ image, movie }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = () => {
    dispatch(openMovieModal(movie))
    navigate(`/movies/${movie.id}`, { state: { backgroundLocation: location } })
  }

  return (
    <div 
    onClick={handleClick}
    className="min-w-50 h-75 rounded overflow-hidden cursor-pointer transform hover:scale-110 transition duration-300"
  >
    <img 
      src={image}
      alt={movie}
      className="w-full h-full object-cover"
    />
  </div>
  )
}