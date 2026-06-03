import axios from "axios"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
})

const withApiKey = (params = {}) => ({
  api_key: API_KEY,
  ...params,
})

const hasArtwork = (item) => item.poster_path || item.backdrop_path

const tagResults = (results = [], mediaType) =>
  results
    .filter((item) => item && hasArtwork(item))
    .map((item) => ({ ...item, media_type: item.media_type || mediaType }))

const filterMediaResults = (results = []) =>
  results.filter((item) => ["movie", "tv"].includes(item.media_type) && hasArtwork(item))

const getTaggedResults = async (path, params, mediaType) => {
  const response = await tmdb.get(path, {
    params: withApiKey(params),
  })

  return {
    ...response,
    data: {
      ...response.data,
      results: tagResults(response.data.results, mediaType),
    },
  }
}

export const getMediaType = (item) => {
  if (item?.media_type === "tv" || item?.media_type === "movie") return item.media_type
  return item?.first_air_date || item?.name ? "tv" : "movie"
}

export const fetchTrending = async () => {
  const response = await tmdb.get("/trending/all/week", {
    params: withApiKey(),
  })

  return {
    ...response,
    data: {
      ...response.data,
      results: filterMediaResults(response.data.results),
    },
  }
}

export const fetchTopRated = async () => {
  const [movies, tv] = await Promise.all([
    tmdb.get("/movie/top_rated", { params: withApiKey() }),
    tmdb.get("/tv/top_rated", { params: withApiKey() }),
  ])

  return {
    data: {
      results: [
        ...tagResults(movies.data.results, "movie"),
        ...tagResults(tv.data.results, "tv"),
      ],
    },
  }
}

export const fetchActionMixed = async () => {
  const [movies, tv] = await Promise.all([
    tmdb.get("/discover/movie", {
      params: withApiKey({ with_genres: 28 }),
    }),
    tmdb.get("/discover/tv", {
      params: withApiKey({ with_genres: 10759 }),
    }),
  ])

  return {
    data: {
      results: [
        ...tagResults(movies.data.results, "movie"),
        ...tagResults(tv.data.results, "tv"),
      ],
    },
  }
}

export const searchMulti = async (query) => {
  const response = await tmdb.get("/search/multi", {
    params: withApiKey({ query }),
  })

  return {
    ...response,
    data: {
      ...response.data,
      results: filterMediaResults(response.data.results),
    },
  }
}

export const fetchDetails = (id, mediaType = "movie") =>
  tmdb.get(`/${mediaType}/${id}`, {
    params: withApiKey({ append_to_response: "videos,similar" }),
  })

export const fetchVideos = (id, mediaType = "movie") =>
  tmdb.get(`/${mediaType}/${id}/videos`, {
    params: withApiKey(),
  })

export const fetchSimilar = async (id, mediaType = "movie") => {
  const response = await tmdb.get(`/${mediaType}/${id}/similar`, {
    params: withApiKey(),
  })

  return {
    ...response,
    data: {
      ...response.data,
      results: tagResults(response.data.results, mediaType),
    },
  }
}

export const fetchMovieDetails = (movieId) => fetchDetails(movieId, "movie")
export const fetchTvDetails = (tvId) => fetchDetails(tvId, "tv")
export const fetchMovieVideos = (movieId) => fetchVideos(movieId, "movie")
export const fetchSimilarMovies = (movieId) => fetchSimilar(movieId, "movie")

export const fetchKoreanMixed = async () => {
  const [movies, tv] = await Promise.all([
    tmdb.get("/discover/movie", {
      params: withApiKey({ with_original_language: "ko" }),
    }),
    tmdb.get("/discover/tv", {
      params: withApiKey({ with_original_language: "ko" }),
    }),
  ])

  return {
    data: {
      results: [
        ...tagResults(movies.data.results, "movie"),
        ...tagResults(tv.data.results, "tv"),
      ],
    },
  }
}

export const fetchWesternTv = () =>
  getTaggedResults(
    "/discover/tv",
    { with_original_language: "en", sort_by: "popularity.desc" },
    "tv",
  )

export const fetchKoreanTv = () =>
  getTaggedResults(
    "/discover/tv",
    { with_original_language: "ko", sort_by: "popularity.desc" },
    "tv",
  )

export const fetchAnimeTv = () =>
  getTaggedResults(
    "/discover/tv",
    { with_original_language: "ja", with_genres: 16 },
    "tv",
  )

export const fetchChineseTv = () =>
  getTaggedResults("/discover/tv", { with_original_language: "zh" }, "tv")

export const fetchTrendingTv = () =>
  getTaggedResults("/trending/tv/week", undefined, "tv")

export const fetchWesternMovies = () =>
  getTaggedResults(
    "/discover/movie",
    { with_original_language: "en", sort_by: "popularity.desc" },
    "movie",
  )

export const fetchKoreanMovies = () =>
  getTaggedResults(
    "/discover/movie",
    { with_original_language: "ko", sort_by: "popularity.desc" },
    "movie",
  )

export const fetchAnimeMovies = () =>
  getTaggedResults(
    "/discover/movie",
    { with_original_language: "ja", with_genres: 16 },
    "movie",
  )

export const fetchChineseMovies = () =>
  getTaggedResults("/discover/movie", { with_original_language: "zh" }, "movie")

export const fetchTrendingMovies = () =>
  getTaggedResults("/trending/movie/week", { sort_by: "popularity.desc" }, "movie")

export const fetchTopRatedMovies = () =>
  getTaggedResults("/movie/top_rated", { sort_by: "popularity.desc" }, "movie")
