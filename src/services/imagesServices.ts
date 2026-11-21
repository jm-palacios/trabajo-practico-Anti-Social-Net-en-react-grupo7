import type { PostImage, CrearPostImage } from "../types";
import { API_URL, leerError } from "./api";

export async function obtenerImagenesDelPost(postId: number): Promise<PostImage[]> {
    const response = await fetch(`${API_URL}/postimages/post/${postId}`);

    if (!response.ok) {
        throw new Error(await leerError(response, 'No se pudieron obtener las imágenes del post'));
    }

    const imagenes: PostImage[] = await response.json();

    return imagenes;
}

export async function crearImagen(datos: CrearPostImage): Promise<PostImage> {
    const response = await fetch(`${API_URL}/postimages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    if (!response.ok) {
        throw new Error(await leerError(response, 'No se pudo crear la imagen'));
    }

    const imagen: PostImage = await response.json();

    return imagen;
}