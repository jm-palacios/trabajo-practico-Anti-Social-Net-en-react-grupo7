import type { Tag } from "../types";

const API_URL = `http://localhost:3001`;

export async function obtenerTags(): Promise<Tag[]> {
    const response = await fetch(`${API_URL}/tags`);

    if (!response.ok) {
        throw new Error('No se pudieron obtener los tags');
    }

    const tags: Tag[] = await response.json();

    return tags;
}