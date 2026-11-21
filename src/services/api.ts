export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function leerError(response: Response, mensajePorDefecto: string): Promise<string> {
    const data = await response.json().catch(() => null);
    return data?.error ?? mensajePorDefecto;
}