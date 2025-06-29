import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import EditProfilePage from "./pages/EditProfilePage";
import PublicationsPage from "./pages/PublicationsPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import RoutinesPage from "./pages/RoutinesPage";

function App() {
  const { token } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/rutinas" element={<RoutinesPage />} />

        <Route
          path="/dashboard"
          element={token ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-profile"
          element={token ? <EditProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/publications"
          element={token ? <PublicationsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={token ? <PublicProfilePage /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
