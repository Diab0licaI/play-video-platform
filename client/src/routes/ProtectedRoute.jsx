import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#121212] text-white">
        Loading...
      </div>
    );
  }
  
  console.log({
  isAuthenticated,
  loading
});

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;