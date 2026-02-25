import axios from "axios";
import Movies from "../pages/Movies";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
})

/* Trending movies + TV shows of the week */
export const fetchTrending = () => 
  tmdb.get("/trending/all/week", {
    params: { api_key: API_KEY },
  })

/* Top rated movie + Tv */
export const fetchTopRated = async () => {
  const [movies, tv] = await Promise.all([
    tmdb.get("/movie/top_rated", { params: {  api_key: API_KEY} }),
    tmdb.get("/tv/top_rated", { params: {  api_key: API_KEY} }),
  ])

  return {
    data: {results: [...movies.data.results, ...tv.data.results]}
  }
}

/* Action movies + TV shows (28 for movies, 10759 for TV) */
export const fetchActionMixed = async () => {
  const [movies, tv] = await Promise.all([
    tmdb.get("/discover/movie", {
      params: { api_key: API_KEY, with_genres: 28 } }),
    tmdb.get("/discover/tv", {
      params: { api_key: API_KEY, with_genres: 10759 } }),
  ])

  return {
    data: {
      results: [...movies.data.results, ...tv.data.results]
    }
  }
}

/* Search movie + TV shows */
export const searchMulti = (query) =>
  tmdb.get("/search/multi", {
    params: { api_key: API_KEY, query },
  })


/* Details */
export const fetchMovieDetails = (movieId) =>
  tmdb.get(`/movie/${movieId}`, {
    params: {
      api_key: API_KEY,
      append_to_response: "videos,similar"
    }
  })

export const fetchTvDetails = (tvId) =>
  tmdb.get(`/tv/${tvId}`, {
    params: {
      api_key: API_KEY,
      append_to_response: "videos,similar"
    }
  })

export const fetchMovieVideos = (movieId) =>
  tmdb.get(`/movie/${movieId}/videos`, {
    params: { api_key: API_KEY },
  })

export const fetchSimilarMovies = (movieId) =>
  tmdb.get(`/movie/${movieId}/similar`, {
    params: { api_key: API_KEY },
  })

export const fetchKoreanMixed = async () => {
  const [movies, tv] = await Promise.all([
    tmdb.get("/discover/movie", {
      params: { api_key: API_KEY, with_genres: 28, with_original_language: "ko" } }),
    tmdb.get("/discover/tv", {
      params: { api_key: API_KEY, with_genres: 10759, with_original_language: "ko" } }),
  ])

  const moviesWithType = movies.data.results.map(movie => ({ ...movie, media_type: "movie" }))
  const tvWithType = tv.data.results.map(show => ({ ...show, media_type: "tv" }))

  return {
    data: {
      results: [...moviesWithType, ...tvWithType]
    }
  }
}

/* export const tvMixed = async () => {
  const [korean, other] = await Promise.all([
    tmdb.get("/discover/tv", {
      params: {api_key: API_KEY, with_genres: 10759, with_original_language: "ko" } }),
    tmdb.get("/discover/tv", {
      params: {api_key: API_KEY, with_genres: 10759, with_original_language: "en" } }),
    ])

  return {
    data: {
      results: [...korean.data.results, ...other.data.results]
    }
  }
} */

/* For Tv shows page: */
export const fetchWesternTv = () =>
  tmdb.get("/discover/tv", {
    params: { api_key: API_KEY, with_original_language: "en", sort_by: "popularity.desc" },
  })

  export const fetchKoreanTv = () =>
  tmdb.get("/discover/tv", {
    params: { api_key: API_KEY, with_original_language: "ko", sort_by: "popularity.desc" },
  })


export const fetchAnimeTv = () => 
  tmdb.get("/discover/tv", {
    params: { api_key: API_KEY, with_original_language: "ja", with_genres: 16 },
  })

export const fetchChineseTv = () =>
  tmdb.get("/discover/tv", {
    params: { api_key: API_KEY, with_original_language: "zh" },
  })

export const fetchTrendingTv = () =>
  tmdb.get("/trending/tv/week", {
    params: { api_key: API_KEY },
  })


/* For Movies page */
export const fetchWesternMovies = () =>
  tmdb.get("/discover/movie", {
    params: { api_key: API_KEY, with_original_language: "en", sort_by: "popularity.desc" },
  })

export const fetchKoreanMovies = () =>
  tmdb.get("/discover/movie", {
    params: { api_key: API_KEY, with_original_language: "ko", sort_by: "popularity.desc" },
  })

export const fetchAnimeMovies = () =>
  tmdb.get("/discover/movie", {
    params: { api_key: API_KEY, with_original_language: "ja", with_genres: 16 },
  })

export const fetchChineseMovies = () =>
  tmdb.get("/discover/movie", {
    params: { api_key: API_KEY, with_original_language: "zh" },
  })

export const fetchTrendingMovies = () =>
  tmdb.get("/trending/movie/week", {
    params: { api_key: API_KEY, sort_by: "popularity.desc" },
  })

export const fetchTopRatedMovies = () =>
  tmdb.get("/movie/top_rated", {
    params: { api_key: API_KEY, sort_by: "popularity.desc" },
  })

