import type { CrearPost, Post } from "../types";

const API_URL = `http://localhost:3001`;

export async function obtenerPosts(): Promise<Post[]> {
    const response = await fetch(`${API_URL}/posts`);

    if (!response.ok) {
        throw new Error('No se pudieron obtener los posts');
    }

    const posts: Post[] = await response.json();

    return posts;
}

export async function obtenerPostPorId(id: number): Promise<Post> {
    const response = await fetch(`${API_URL}/posts/${id}`);

    if (!response.ok) {
        throw new Error('No se pudo obtener el post');
    }

    const post: Post = await response.json();

    return post;
}

export async function buscarPostPorUsuario(userId: number): Promise<Post[]> {
    const response = await fetch(`${API_URL}/posts?userId=${userId}`);

    if (!response.ok) {
        throw new Error('No se pudieron obtener los posts del usuario');
    }

    const posts: Post[] = await response.json();

    return posts;
}

export async function crearPost(datos: CrearPost): Promise<Post> {
    const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    if (!response.ok) {
        throw new Error('No se pudo crear el post');
    }

    const post: Post = await response.json();

    return post;
}