import type { Tag } from "../types";
import { API_URL, leerError } from "./api";

export async function obtenerTags(): Promise<Tag[]> {
    const response = await fetch(`${API_URL}/tags`);

    if (!response.ok) {
        throw new Error(await leerError(response, 'No se pudieron obtener los tags'));
    }

    const tags: Tag[] = await response.json();

    return tags;
}