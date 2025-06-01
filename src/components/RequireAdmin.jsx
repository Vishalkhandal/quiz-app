import { Navigate } from "react-router";
import { useFirebase } from "../context/FirebaseContext";

export default function RequireAdmin({ children }) {
  const firebase = useFirebase();

  const isAdmin = firebase.user && firebase.user.email === "admin@gmail.com";
  
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;  
}