import { Navigate } from "react-router";
import { useFirebase } from "../context/FirebaseContext";

export default function RequireAdmin({ children }) {
  const { user } = useFirebase();
  // Replace with your admin email or logic
  const isAdmin = user && user.email === "admin@email.com";
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}