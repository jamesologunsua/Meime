import Navbar from "../components/Navbar"
import Hero from "../components/Hero"

import { useSelector, useDispatch} from "react-redux"
import MovieRow from "../components/MovieRow"
import { fetchWesternTv, fetchKoreanTv, fetchAnimeTv, fetchChineseTv, fetchTrendingTv } from "../services/tmdb"
import { getMoviesByCategory } from "../redux/movieSlice"
import { useEffect } from "react"

export default function TvShows() {
  const dispatch = useDispatch()
  const { categories, loading, error } = useSelector((state) => state.movies)
  const hasSearchResults = Object.prototype.hasOwnProperty.call(categories, "searchResults")

  useEffect(() => {
    dispatch(getMoviesByCategory({ category: "trending", fetchFunction: fetchTrendingTv }))
    dispatch(getMoviesByCategory({ category: "popular", fetchFunction: fetchWesternTv }))
    dispatch(getMoviesByCategory({ category: "kdrama", fetchFunction: fetchKoreanTv }))
    dispatch(getMoviesByCategory({ category: "anime", fetchFunction: fetchAnimeTv }))
    dispatch(getMoviesByCategory({ category: "chinese", fetchFunction: fetchChineseTv }))
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

        <MovieRow title="Trending TV Shows" movies={categories.trending || []} isLoading={loading.trending} />
        <MovieRow title="Popular TV Shows" movies={categories.popular || []} isLoading={loading.popular} />
        <MovieRow title="K-Dramas" movies={categories.kdrama || []} isLoading={loading.kdrama} />
        <MovieRow title="Anime TV Shows" movies={categories.anime || []} isLoading={loading.anime} />
        <MovieRow title="Chinese TV Shows" movies={categories.chinese || []} isLoading={loading.chinese} />
      </div>
    </div>
  )
}