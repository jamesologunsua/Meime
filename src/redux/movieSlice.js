import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const getMoviesByCategory = createAsyncThunk(
  "movies/getMoviesByCategory",
  async ({ category, fetchFunction }) => {
    const response = await fetchFunction()
    return { category, results: response.data.results }
  }
)

/* import {
  fetchTrending,
  fetchTopRated,
  fetchActionMovies,
} from "../services/tmdb"

export const getTrending = createAsyncThunk("movies/getTrending", async () => {
  const response = await fetchTrending()
  return response.data.results
})

export const getTopRated = createAsyncThunk(
  "movies/getTopRated",
  async () => {
    const response = await fetchTopRated()
    return response.data.results
  }
)

export const getActionMovies = createAsyncThunk(
  "movies/getActionMovies",
  async () => { 
    const response = await fetchActionMovies()
    return response.data.results
  }
) */

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    categories: {}, //Stores all categories dynamically
    loading: {}, //per-category loading state
    error: {}, //per-category error state
    selectedMovie: null, //For movie details page
    isModalOpen: false, //For movie details modal
    player: {
      isPlaying: false,
      currentVideo: null,
      currentSeason: null,
      currentEpisode: null,
    },
  },
  reducers: {
    openMovieModal: (state, action) => {
      state.selectedMovie = action.payload
      state.isModalOpen = true
    },
    closeMovieModal: (state) => {
      state.selectedMovie = null
      state.isModalOpen = false
    },
    startPlayback: (state, action) => {
      state.player.isPlaying = true
      state.player.currentVideo = action.payload
    },
    stopPlayback: (state) => {
      state.player.isPlaying = false
      state.player.currentVideo = null
    },
    setSeason: (state, action) => {
      state.player.currentSeason = action.payload
    },
    setEpisode: (state, action) => {
      state.player.currentEpisode = action.payload
    },
},
  extraReducers: (builder) => {
    builder
      .addCase(getMoviesByCategory.pending, (state, action) => {
        const category = action.meta.arg.category
        state.loading[category] = true
        state.error[category] = null
      })
      .addCase(getMoviesByCategory.fulfilled, (state, action) => {
        const { category, results } = action.payload
        state.categories[category] = results
        state.loading[category] = false
      })
      .addCase(getMoviesByCategory.rejected, (state, action) => {
        const category = action.meta.arg.category
        state.loading[category] = false
        state.error[category] = action.error.message
      })
  },
})

export const { openMovieModal, closeMovieModal, startPlayback, stopPlayback, setSeason, setEpisode } = moviesSlice.actions
export default moviesSlice.reducer
