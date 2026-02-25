import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { closeMovieModal, getMoviesByCategory } from "../redux/movieSlice"
import { fetchMovieVideos, fetchSimilarMovies, fetchMovieDetails } from "../services/tmdb"
import { openMovieModal } from "../redux/movieSlice";
import {
  startPlayback,
  stopPlayback,
  setSeason,
  setEpisode,
} from "../redux/movieSlice"

const IMAGE_BASE = "https://image.tmdb.org/t/p/original"

export default function MovieModal() {
  const { player } = useSelector((state) => state.movies)
  const dispatch = useDispatch()
  const { selectedMovie, isModalOpen, categories } = useSelector((state) => state.movies)

  const [trailerKey, setTrailerKey] = useState(null)
  const modalRef = useRef()

  //Closes modal when clicking outside of it
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      dispatch(closeMovieModal())
    }
  }

  //fetch trailer and similar movies when modal opens
  useEffect(() => {
    if (!selectedMovie) return

    const loadTrailer = async () => {
      const response = await fetchMovieVideos(selectedMovie.id)

      const trailer = response.data.results.find((vid) => vid.type === "Trailer" && vid.site === "YouTube")

      if (trailer) {
        setTrailerKey(trailer.key)
      }
    }

    loadTrailer()

    const loadDetails = async () => {
      const response = await fetchMovieDetails(selectedMovie.id)
      console.log("This is ", response.data)
    }

    //fetch similar movies using generic system
    dispatch(
      getMoviesByCategory({
        category: "similar",
        fetchFunction: () => fetchSimilarMovies(selectedMovie.id),
      })
    )
  }, [selectedMovie, dispatch])

  if (!isModalOpen || !selectedMovie) return null

  return (
    <div 
      className="fixed inset-0  z-50 flex items-center justify-center bg-black/80 animate-fadeIn"
      onClick={handleOutsideClick}
    >
      <div 
        ref={modalRef}
        className="bg-gray-900 rounded-lg max-w-4xl w-full mx-4 relative overflow-hidden"
      >
        <button 
          onClick={() => dispatch(closeMovieModal())}
          className="absolute top-4 right-4 text-white text-2xl hover:text-red-500 z-10"
        >
          ✕
        </button>

        {/* Trailer */}
        {/* {trailerKey ? (
          <iframe
            className="w-full h-100"
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Trailer"
            allowFullScreen
          ></iframe>
        ) : (
          <img 
            src={`${IMAGE_BASE}${selectedMovie.backdrop_path || selectedMovie.poster_path}`}
            alt={selectedMovie.title || selectedMovie.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
        )} */}

        {/* Player / Trailer Section */}
        {player.isPlaying ? (
          <div className="relative">
            <video controls autoPlay className="w-full">
              <source 
                src={player.currentVideo || "demo.mp4"}
                type="video/mp4"
              />
            </video>

            <button 
              className="absolute bg-black/50 text-white px-4 py-2 rounded-lg top-4 left-4 hover:bg-black/70 transition-colors"
              onClick={() => dispatch(stopPlayback())}>
                ← Back
            </button>
          </div>
        ) : trailerKey ? (
          <iframe
            className="w-full h-100"
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Trailer"
            allowFullScreen
          ></iframe>
        ) : (
          <img 
            src={`${IMAGE_BASE}${selectedMovie.backdrop_path || selectedMovie.poster_path}`}
            alt={selectedMovie.title || selectedMovie.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
        )}

        {/* Info */}
        <div className="p-6 text-white">
          <h2 className="text-3xl font-bold mb-4">
            {selectedMovie?.title || selectedMovie?.name}
          </h2>

          <div className="flex">
            <button 
              onClick={() => dispatch(startPlayback("/demo.mp4"))}
              className="bg-red-600 hover:bg-red-700 px-2 rounded font-semibold"
            >
              ▶ Play
            </button>

            {selectedMovie?.media_type === "tv" && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold">Episodes</h3>

                <div className="space-y-2">
                  {[1, 2, 3].map((ep) => (
                    <div 
                      key={ep}
                      className="flex justify-between bg-gray p-3 rounded cursor-pointer hover:bg-gray-700"
                      onClick={() => {
                        dispatch(setEpisode(ep))
                        dispatch(startPlayback("/demo.mp4"))
                      }}
                    >
                      <span>Episode {ep}</span>
                      <span>▶</span>
                    </div>
                    ))}
                </div>
              </div>
            )}

            {selectedMovie.belongs_to_collection && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold">More Parts</h3>
                <p className="text-gray-400">
                  This movie is part of a collection.
                </p>
              </div>
            )}
          </div>

          <p className="mb-6">{selectedMovie?.overview}</p>

          <h3 className="text-xl font-semibold mb-4">Similar Movies</h3>

          <div className="flex">
            {(categories.similar || []).map((movie) => (
              <img
                key={movie.id}
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title || movie.name}
                className="w-24 h-36 object-cover rounded mr-4 cursor-pointer hover:scale-105 transition-transform"
                /* onClick={() => dispatch({type: "movies/openMovieModal", payload: movie})} */
                onClick={() => dispatch(openMovieModal(movie))}
              />
            ))}
          </div>
        </div>
        

        {/* <div className="p-6 text-white">
          <h2 className="text-3xl font-bold mb-4">{selectedMovie.title || selectedMovie.name}</h2>
          <p className="text-gray-300">{selectedMovie.overview}</p>
        </div> */}
      </div>
    </div>
  )
}

