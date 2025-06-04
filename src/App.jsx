import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./Context";
import HomeView from "./Views/HomeView";
import LoginView from "./Views/LoginView";
import RegisterView from "./Views/RegisterView";
import ErrorView from "./Views/ErrorView";
import DetailView from "./Views/DetailView";
import MoviesView from "./Views/MoviesView";
import GenreView from "./Views/GenreView";
import CartView from "./Views/CartView";
import SettingsView from "./Views/SettingsView";
import SearchView from "./Views/SearchView";
import ProtectedRoutes from './Views/ProtectedRoutes';

function App() {

  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/movies" element={<MoviesView />} >
              <Route path="genres/:genre_id" element={<GenreView />} />
              <Route path="details/:id" element={<DetailView />} />
              <Route path="search/:search_id" element={<SearchView />} />
            </Route>
            <Route path="settings" element={<SettingsView />} />
            <Route path="cart" element={<CartView />} />
          </Route>
          <Route path="*" element={<ErrorView />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App