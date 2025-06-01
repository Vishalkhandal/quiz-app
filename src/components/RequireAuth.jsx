import { Navigate, useLocation } from "react-router";
import { useFirebase } from "../context/FirebaseContext";

export default function RequireAuth({ children }) {
    const { user } = useFirebase();
    const location = useLocation();

    if (!user) {
        // Redirect to login, save current location for redirect after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}