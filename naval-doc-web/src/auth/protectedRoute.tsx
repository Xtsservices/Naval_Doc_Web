import { Navigate, Outlet } from "react-router-dom";

// Decode and validate JWT token
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload)); // base64 decode

    const currentTime = Math.floor(Date.now() / 1000); // in seconds
    return decodedPayload.exp && decodedPayload.exp > currentTime;
  } catch (error) {
    console.error('Invalid token format:', error);
    return false;
  }
};

const ProtectedRoute = () => {
  const token = localStorage.getItem("Token");
  const isAuthUser = isTokenValid(token);
console.log("isAuthUser",isAuthUser)
  // auto-clear expired token
  if (!isAuthUser && token) {
    localStorage.removeItem("Token");
  }

  return isAuthUser ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
