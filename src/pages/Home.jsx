import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import MovieRow from "../components/MovieRow"
import { getMoviesByCategory } from "../redux/movieSlice"
import { fetchTrending, fetchTopRated, fetchActionMixed, fetchKoreanMixed } from "../services/tmdb"

export default function Home() {
  const dispatch = useDispatch()
  const { categories, loading, error } = useSelector((state) => state.movies)
  const hasSearchResults = Object.prototype.hasOwnProperty.call(categories, "searchResults")

  useEffect(() => {
    dispatch(getMoviesByCategory({ category: "trending", fetchFunction: fetchTrending }))
    dispatch(getMoviesByCategory({ category: "topRated", fetchFunction: fetchTopRated }))
    dispatch(getMoviesByCategory({ category: "action", fetchFunction: fetchActionMixed }))
    dispatch(getMoviesByCategory({ category: "koreanMixed", fetchFunction: fetchKoreanMixed }))
  }, [dispatch])

  return (
    <div className="bg-black text-white min-h-screen">
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

        <MovieRow title="Trending Now" movies={categories.trending || []} isLoading={loading.trending} />
        <MovieRow title="Top Rated" movies={categories.topRated || []} isLoading={loading.topRated} />
        <MovieRow title="Action Movies" movies={categories.action || []} isLoading={loading.action} />
        <MovieRow title="Korean Mixed" movies={categories.koreanMixed || []} isLoading={loading.koreanMixed} />
      </div>
    </div>
  )
}
