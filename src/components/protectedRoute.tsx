import { useContext, type ReactNode } from "react";
import { Navigate } from 'react-router-dom';
import { AuthContext } from "../context/authContext";

interface ProtectedRouteProps {
    children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const contexto = useContext(AuthContext);

    if (!contexto) {
        return null;
    }

    if (!contexto.usuario) {
        return <Navigate to="/login" replace/>;
    }

    return children;
}

export default ProtectedRoute