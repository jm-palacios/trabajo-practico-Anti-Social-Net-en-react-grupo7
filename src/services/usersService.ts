import type { User, CrearUsuario } from "../types";
import { API_URL, leerError } from "./api";

export async function obtenerUsuarios(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`);
    
    if (!response.ok) {
        throw new Error(await leerError(response, "Error al obtener los usuarios"));
    }
    
    const usuarios: User[] = await response.json();
    
    return usuarios;
}

export async function obtenerUsuarioPorId(id: number): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`);

    if (!response.ok) {
        throw new Error(await leerError(response, "No se pudo obtener al usuario"));
    }

    const usuario: User = await response.json();

    return usuario;
}

export async function crearUsuario(datos: CrearUsuario): Promise<User> {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });
    
    if (!response.ok) {
        throw new Error(await leerError(response, 'No se pudo crear al usuario'));
    }

    const usuario: User = await response.json();

    return usuario;
}