import type { PostImage, CrearPostImage } from "../types";

const API_URL = `http://localhost:3001`;

export async function obtenerImagenesDelPost(postId: number): Promise<PostImage[]> {
    const response = await fetch(`${API_URL}/postImages/post/${postId}`);

    if (!response.ok) {
        throw new Error('No se pudieron obtener las imágenes del post');
    }

    const imagenes: PostImage[] = await response.json();

    return imagenes;
}

export async function crearImagen(datos: CrearPostImage): Promise<PostImage> {
    const response = await fetch(`${API_URL}/postImages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    if (!response.ok) {
        throw new Error('No se pudo crear la imagen');
    }

    const imagen: PostImage = await response.json();

    return imagen;
}