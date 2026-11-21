import type { ReactNode } from "react";
import { Navigate } from 'react-router-dom';
import { AuthContext, useAuth } from "../context/authContext";

interface ProtectedRouteProps {
    children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { usuario } = useAuth();

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute