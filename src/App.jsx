import { Routes, Route } from "react-router-dom"
import { useLocation } from "react-router-dom"

import Home from "./pages/Home"
import TvShows from "./pages/TvShows"
import MovieModal from "./components/MovieModal"
import Movies from "./pages/Movies"
import KDrama from "./pages/KDrama"

export default function App() {
  const location = useLocation()
  const state = location.state

  return(
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Home />} />
        <Route path="/tv-shows" element={<TvShows />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/kdrama" element={<KDrama />} />
        <Route path="/movie/:id" element={<Home />} />
        <Route path="/tv/:id" element={<Home />} />
        <Route path="/movies/:id" element={<Home />} />
      </Routes>
      <Routes>
        <Route path="/movie/:id" element={<MovieModal />} />
        <Route path="/tv/:id" element={<MovieModal />} />
        <Route path="/movies/:id" element={<MovieModal />} />
      </Routes>
    </>
  )
}
