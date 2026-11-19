import type { Comment, CrearComment } from "../types";

const API_URL = `http://localhost:3001`;

export async function obtenerComentariosDelPost(postId: number): Promise<Comment[]> {
    const response = await fetch(`${API_URL}/comments?PostId=${postId}`);

    if (!response.ok) {
        throw new Error('No se pudieron obtener los comentarios del post');
    }

    const comentarios: Comment[] = await response.json();

    return comentarios;
}

export async function crearComentario(datos: CrearComment): Promise<Comment> {
    const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    if (!response.ok) {
        throw new Error('No se pudo crear el comentario');
    }

    const comentario: Comment = await response.json();

    return comentario;
}