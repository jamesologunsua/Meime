import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import MovieRow from "../components/MovieRow"
import { getMoviesByCategory } from "../redux/movieSlice"
import { fetchKoreanMixed, fetchKoreanMovies, fetchKoreanTv } from "../services/tmdb"

export default function KDrama() {
  const dispatch = useDispatch()
  const { categories, loading, error } = useSelector((state) => state.movies)
  const hasSearchResults = Object.prototype.hasOwnProperty.call(categories, "searchResults")

  useEffect(() => {
    dispatch(getMoviesByCategory({ category: "trending", fetchFunction: fetchKoreanMixed }))
    dispatch(getMoviesByCategory({ category: "koreanTv", fetchFunction: fetchKoreanTv }))
    dispatch(getMoviesByCategory({ category: "koreanMovies", fetchFunction: fetchKoreanMovies }))
  }, [dispatch])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />

      <div className="-mt-32 relative z-20">
        {error.searchResults && (
          <p className="px-6 sm:px-10 mb-4 text-sm text-red-400">Search failed: {error.searchResults}</p>
        )}

        {hasSearchResults && (
          <MovieRow
            title="Search Results"
            movies={categories.searchResults || []}
            isLoading={loading.searchResults}
          />
        )}

        <MovieRow title="K-Dramas" movies={categories.koreanTv || []} isLoading={loading.koreanTv} />
        <MovieRow
          title="Korean Movies"
          movies={categories.koreanMovies || []}
          isLoading={loading.koreanMovies}
        />
      </div>
    </div>
  )
}
