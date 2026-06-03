import { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { FaPlay, FaStar } from "react-icons/fa"
import { IoClose } from "react-icons/io5"

import {
  closeMovieModal,
  getMoviesByCategory,
  openMovieModal,
  stopPlayback,
} from "../redux/movieSlice"
import { fetchDetails, fetchSimilar, fetchVideos, getMediaType } from "../services/tmdb"

const IMAGE_BASE = "https://image.tmdb.org/t/p/original"
const POSTER_BASE = "https://image.tmdb.org/t/p/w300"

const pickTrailer = (videos = []) => {
  const typePriority = {
    Trailer: 0,
    Teaser: 1,
    Clip: 2,
  }

  return videos
    .filter((video) => video.site === "YouTube" && video.key)
    .sort((first, second) => {
      const firstPriority = typePriority[first.type] ?? 9
      const secondPriority = typePriority[second.type] ?? 9

      if (firstPriority !== secondPriority) return firstPriority - secondPriority
      return Number(second.official) - Number(first.official)
    })[0]
}

const formatCount = (count, label) => {
  if (!count) return null
  return `${count} ${label}${count === 1 ? "" : "s"}`
}

export default function MovieModal() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const modalRef = useRef(null)
  const { selectedMovie, isModalOpen, categories } = useSelector((state) => state.movies)

  const routeMediaType = location.pathname.startsWith("/tv/") ? "tv" : "movie"
  const selectedId = selectedMovie?.id || id
  const mediaType = selectedMovie ? getMediaType(selectedMovie) : routeMediaType
  const routeModalIsOpen = Boolean(id)
  const modalIsOpen = isModalOpen || routeModalIsOpen
  const mediaKey = selectedId ? `${mediaType}-${selectedId}` : ""

  const [mediaState, setMediaState] = useState({
    key: "",
    details: null,
    trailerKey: null,
    error: "",
  })
  const [noticeState, setNoticeState] = useState({ key: "", message: "" })
  const [selectedSeasonState, setSelectedSeasonState] = useState({
    key: "",
    seasonNumber: null,
  })

  const activeMediaState =
    mediaState.key === mediaKey
      ? mediaState
      : { key: mediaKey, details: null, trailerKey: null, error: "" }
  const details = activeMediaState.details
  const trailerKey = activeMediaState.trailerKey
  const mediaError = activeMediaState.error
  const notice = noticeState.key === mediaKey ? noticeState.message : ""
  const selectedSeasonNumber =
    selectedSeasonState.key === mediaKey ? selectedSeasonState.seasonNumber : null
  const detailsMatch = details && String(details.id) === String(selectedId)
  const displayItem = detailsMatch ? details : selectedMovie
  const isTvShow = mediaType === "tv"

  const seasons = useMemo(
    () =>
      detailsMatch && isTvShow
        ? (details.seasons || []).filter((season) => season.season_number > 0 && season.episode_count > 0)
        : [],
    [details, detailsMatch, isTvShow],
  )

  const activeSeason =
    seasons.find((season) => season.season_number === selectedSeasonNumber) || seasons[0]
  const episodeNumbers = activeSeason
    ? Array.from({ length: activeSeason.episode_count }, (_, index) => index + 1)
    : []

  useEffect(() => {
    if (!modalIsOpen || !selectedId) return undefined

    let isCancelled = false
    const currentMediaKey = mediaKey

    const loadMedia = async () => {
      const [detailsResult, videosResult] = await Promise.allSettled([
        fetchDetails(selectedId, mediaType),
        fetchVideos(selectedId, mediaType),
      ])

      if (isCancelled) return

      let videos = []
      let nextDetails = null
      let nextError = ""

      if (detailsResult.status === "fulfilled") {
        nextDetails = detailsResult.value.data
        videos = detailsResult.value.data.videos?.results || []
      }

      if (videosResult.status === "fulfilled") {
        videos = videosResult.value.data.results || videos
      }

      const trailer = pickTrailer(videos)

      if (detailsResult.status === "rejected" && videosResult.status === "rejected") {
        nextError = "Details and trailer could not load right now."
      } else if (!trailer) {
        nextError = "Trailer is not available for now."
      }

      setMediaState({
        key: currentMediaKey,
        details: nextDetails,
        trailerKey: trailer?.key || null,
        error: nextError,
      })
    }

    loadMedia()

    dispatch(
      getMoviesByCategory({
        category: "similar",
        fetchFunction: () => fetchSimilar(selectedId, mediaType),
      }),
    )

    return () => {
      isCancelled = true
    }
  }, [dispatch, mediaKey, mediaType, modalIsOpen, selectedId])

  if (!modalIsOpen || !selectedId) return null

  const title = displayItem?.title || displayItem?.name || "Loading..."
  const overview = displayItem?.overview || "No overview available yet."
  const imagePath = displayItem?.backdrop_path || displayItem?.poster_path
  const releaseDate = displayItem?.release_date || displayItem?.first_air_date
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null
  const rating = displayItem?.vote_average ? displayItem.vote_average.toFixed(1) : null
  const runtime = isTvShow
    ? formatCount(displayItem?.number_of_seasons, "Season")
    : formatCount(displayItem?.runtime, "min")
  const genres = displayItem?.genres?.map((genre) => genre.name).slice(0, 4) || []
  const similarMovies = (categories.similar || []).filter((movie) => movie.poster_path)

  const handleClose = () => {
    dispatch(stopPlayback())
    dispatch(closeMovieModal())

    if (location.state?.backgroundLocation) {
      navigate(-1)
    } else {
      navigate("/", { replace: true })
    }
  }

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleClose()
    }
  }

  const handleUnavailable = () => {
    setNoticeState({
      key: mediaKey,
      message: isTvShow
        ? "Episodes are not available for now. You can still watch the trailer above."
        : "Full movie playback is not available for now. You can still watch the trailer above.",
    })
  }

  const handleSimilarClick = (movie) => {
    const nextMediaType = getMediaType(movie)

    dispatch(openMovieModal(movie))
    navigate(`/${nextMediaType}/${movie.id}`, {
      replace: true,
      state: location.state,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-3 py-6 animate-fadeIn sm:px-6"
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-gray-950 text-white shadow-2xl no-scrollbar"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 z-20 rounded-full bg-black/70 p-2 text-white transition hover:bg-red-600"
          aria-label="Close details"
        >
          <IoClose size={24} />
        </button>

        {trailerKey ? (
          <div className="aspect-video bg-black">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${trailerKey}?rel=0`}
              title={`${title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative h-72 bg-gray-900 sm:h-[28rem]">
            {imagePath ? (
              <img
                src={`${IMAGE_BASE}${imagePath}`}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                {title}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-black/40 to-transparent"></div>
            <div className="absolute bottom-5 left-5 right-5 text-sm text-gray-300">
              {mediaError || "Loading trailer..."}
            </div>
          </div>
        )}

        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-300">
                {releaseYear && <span>{releaseYear}</span>}
                {runtime && <span>{runtime}</span>}
                {rating && (
                  <span className="flex items-center gap-1 text-yellow-400">
                    <FaStar size={14} />
                    {rating}
                  </span>
                )}
              </div>

              {genres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {!isTvShow && (
              <button
                type="button"
                onClick={handleUnavailable}
                className="flex w-full items-center justify-center gap-2 rounded bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700 md:w-auto"
              >
                <FaPlay size={14} />
                Play Movie
              </button>
            )}
          </div>

          {notice && (
            <div className="mt-5 rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {notice}
            </div>
          )}

          <p className="mt-5 max-w-3xl text-sm leading-6 text-gray-300 sm:text-base">
            {overview}
          </p>

          {isTvShow && (
            <section className="mt-8 rounded border border-gray-800 bg-black/30 p-4 sm:p-5">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">Episodes</h3>
                <p className="text-sm text-gray-400">
                  Full episodes are not available for now. Trailer playback is available above when TMDB has one.
                </p>
              </div>

              {seasons.length > 0 ? (
                <>
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {seasons.map((season) => (
                      <button
                        key={season.id || season.season_number}
                        type="button"
                        onClick={() =>
                          setSelectedSeasonState({
                            key: mediaKey,
                            seasonNumber: season.season_number,
                          })
                        }
                        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                          activeSeason?.season_number === season.season_number
                            ? "bg-red-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        Season {season.season_number}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1 no-scrollbar">
                    {episodeNumbers.map((episodeNumber) => (
                      <button
                        key={episodeNumber}
                        type="button"
                        onClick={handleUnavailable}
                        className="flex w-full items-center justify-between gap-4 rounded bg-gray-900 px-4 py-3 text-left transition hover:bg-gray-800"
                      >
                        <span>
                          <span className="block font-medium">Episode {episodeNumber}</span>
                          <span className="text-xs text-gray-500">
                            Season {activeSeason.season_number}
                          </span>
                        </span>
                        <span className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-400">
                          Not available
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-4 rounded bg-gray-900 px-4 py-5 text-sm text-gray-400">
                  Season information is not available right now.
                </div>
              )}
            </section>
          )}

          {!isTvShow && displayItem?.belongs_to_collection && (
            <section className="mt-8 rounded border border-gray-800 bg-black/30 p-4 text-sm text-gray-300 sm:p-5">
              <h3 className="mb-2 text-xl font-semibold text-white">More Parts</h3>
              This movie is part of the {displayItem.belongs_to_collection.name} collection.
            </section>
          )}

          {similarMovies.length > 0 && (
            <section className="mt-8">
              <h3 className="mb-4 text-xl font-semibold">
                Similar {isTvShow ? "Shows" : "Movies"}
              </h3>

              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {similarMovies.map((movie) => (
                  <button
                    key={`${movie.media_type || mediaType}-${movie.id}`}
                    type="button"
                    onClick={() => handleSimilarClick(movie)}
                    className="h-36 min-w-24 overflow-hidden rounded bg-gray-800 transition hover:scale-105"
                    aria-label={`Open ${movie.title || movie.name}`}
                  >
                    <img
                      src={`${POSTER_BASE}${movie.poster_path}`}
                      alt={movie.title || movie.name}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
