import { createContext, useContext, useState,  type ReactNode } from "react";
import type { User } from "../types";

interface AuthContextType {
    usuario: User | null;
    iniciarSesion: (usuario: User) => void;
    cerrarSesion: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
    const [usuario, setUsuario] = useState<User | null>(() => {
        try {
            const guardado = localStorage.getItem("usuario");
            return guardado ? (JSON.parse(guardado) as User) : null;
        } catch {
            localStorage.removeItem("usuario");
            return null;
        }
    });

    function iniciarSesion(usuario: User) {
        setUsuario(usuario);
        localStorage.setItem("usuario", JSON.stringify(usuario));
    }

    function cerrarSesion() {
        setUsuario(null);
        localStorage.removeItem("usuario")
    }

    return (
        <AuthContext.Provider value ={{ usuario, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const contexto = useContext(AuthContext);
    if (!contexto) {
        throw new Error("useAuth debe usarse dentro de AuthProvider")
    }
    return contexto;
}