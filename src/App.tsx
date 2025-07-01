import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import CrearGrupoPage from "./pages/Grupo/CrearGrupoPage";
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
import DetalleRutinaPage from "./pages/Rutina/DetalleRutinaPage";
import PlanesAlimentacionPage from "./pages/Alimento/PlanesAlimentacionPage";   
import CrearPlanAlimenticioPage from "./pages/Alimento/CrearPlanAlimenticioPage";
import DetallePlanAlimentacion from "./pages/Alimento/DetallePlanAlimentacion";
import MisGruposPage from "./pages/Grupo/MisGruposPage";
import EditarGrupoPage from "./pages/Grupo/EditarGrupoPage";
import GroupDetails from "./pages/Grupo/GroupDetails";
import MisPublicaciones from "./pages/Publicaciones/MisPublicaciones";
import PublicGroups from "./pages/Grupo/PublicGroups";

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
        <Route path="/planes-alimentacion/:id" element={<DetallePlanAlimentacion />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={token ? <DashboardPage /> : <Navigate to="/login" replace />}
        />
         <Route
          path="/grupos/publicos"
          element={token ? <PublicGroups /> : <Navigate to="/login" replace />}
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

        <Route path="/rutinas/:id" element={<DetalleRutinaPage />} />

        <Route
          path="/planes-alimentacion"
          element={token ? <PlanesAlimentacionPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/planes-alimentacion/crear"
          element={token ? <CrearPlanAlimenticioPage /> : <Navigate to="/login" replace />}
        />
        <Route 
          path="*"
          element={<NotFoundPage />}
        />
        <Route
          path="/grupos/misgrupos"
          element={token ? <MisGruposPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/grupos/crear"
          element={token ? <CrearGrupoPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/grupos/:grupoId/editar"
          element={token ? <EditarGrupoPage /> : <Navigate to="/login" replace />}
        />
         <Route
          path="/grupos/:grupoId"
          element={token ? <GroupDetails /> : <Navigate to="/login" replace />}
        />
         <Route
          path="/mis-publicaciones"
          element={token ? <MisPublicaciones /> : <Navigate to="/login" replace />}
        />

    </Routes>
  </BrowserRouter>
  );
}

export default App;
