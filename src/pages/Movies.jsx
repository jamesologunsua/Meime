import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import MovieRow from "../components/MovieRow"
import { useSelector } from "react-redux"
import { getMoviesByCategory } from "../redux/movieSlice"
import { fetchWesternMovies, fetchKoreanMovies, fetchAnimeMovies, fetchChineseMovies, fetchTrendingMovies, fetchTopRatedMovies } from "../services/tmdb"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export default function Movies() {
  const dispatch = useDispatch()

  const { categories, loading, error } = useSelector((state) => state.movies)
  const hasSearchResults = Object.prototype.hasOwnProperty.call(categories, "searchResults")

  useEffect(() => {
    dispatch(getMoviesByCategory({ category: "trending", fetchFunction: fetchTrendingMovies }))
    dispatch(getMoviesByCategory({ category: "topRated", fetchFunction: fetchTopRatedMovies }))
    dispatch(getMoviesByCategory({ category: "popular", fetchFunction: fetchWesternMovies }))
    dispatch(getMoviesByCategory({ category: "korean", fetchFunction: fetchKoreanMovies }))
    dispatch(getMoviesByCategory({ category: "anime", fetchFunction: fetchAnimeMovies }))
    dispatch(getMoviesByCategory({ category: "chinese", fetchFunction: fetchChineseMovies }))
  }, [dispatch])

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />

      <div className="-mt-32 relative z-20">
        {error.searchResults && (
          <p className="px-10 mb-4 text-sm text-red-400">Search failed: {error.searchResults}</p>
        )}

        {hasSearchResults && (
          <MovieRow
            title="Search Results"
            movies={categories.searchResults || []}
            isLoading={loading.searchResults}
          />
        )}

        <MovieRow title="Trending Movies" movies={categories.trending || []} isLoading={loading.trending} />
        <MovieRow title="Top Rated Movies" movies={categories.topRated || []} isLoading={loading.topRated} />
        <MovieRow title="Popular Movies" movies={categories.popular || []} isLoading={loading.popular} />
        <MovieRow title="Korean Movies" movies={categories.korean || []} isLoading={loading.korean} />
        <MovieRow title="Anime Movies" movies={categories.anime || []} isLoading={loading.anime} />
        <MovieRow title="Chinese Movies" movies={categories.chinese || []} isLoading={loading.chinese} />
        <MovieRow title="Discover Movies" movies={categories.trending || []} isLoading={loading.trending} />
      </div>
    </div>
  )
}