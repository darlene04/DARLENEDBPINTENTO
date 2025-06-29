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
import PerfilPage from "./pages/PerfilPage";
import CrearRutinaPage from "./pages/Rutina/CrearRutinaPage";

function App() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-center mt-10">Cargando sesión...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/rutinas" element={<RoutinesPage />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={token ? <DashboardPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/edit-profile"
          element={token ? <EditProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/publications"
          element={token ? <PublicationsPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile/:username"
          element={token ? <PublicProfilePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/perfil"
          element={token ? <PerfilPage /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/rutinas/crear"
          element={token ? <CrearRutinaPage /> : <Navigate to="/login" />}
        />


        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
