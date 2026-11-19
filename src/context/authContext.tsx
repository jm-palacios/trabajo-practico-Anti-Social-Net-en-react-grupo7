import { createContext, useState,  type ReactNode } from "react";
import type { User } from "../types";

interface AuthContextType {
    usuario: User | null;
    iniciarSesion: (usuario: User) => void;
    cerrarSesion: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [usuario, setUsuario] = useState<User | null>(() => {
        const usuarioGuardado = localStorage.getItem('usuario');

        if (usuarioGuardado) {
            return JSON.parse(usuarioGuardado) as User;
        }

        return null;
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);