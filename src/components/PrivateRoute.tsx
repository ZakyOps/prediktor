import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Optionnel : afficher un loader ou rien pendant le chargement
    return null; 
  }

  if (!user) {
    // Si l'utilisateur n'est pas connecté, il est redirigé vers la page de login
    return <Navigate to="/login" replace />;
  }

  // Si connecté, afficher le composant enfant
  return children;
};

export default PrivateRoute;