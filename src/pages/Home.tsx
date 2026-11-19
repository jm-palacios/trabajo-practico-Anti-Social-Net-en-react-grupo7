
import { useEffect, useState } from "react";
import { obtenerPosts } from "../services/postServices";
import type { Post } from "../types";

function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarPosts() {
            try {
                const publicaciones = await obtenerPosts();
                setPosts(publicaciones);
            } catch {
                setError("No se pudieron cargar las publicaciones");
            } finally {
                setCargando(false);
            }
        }

        cargarPosts();
    }, []);

    return (
        <div>
            <h1>UnaHur Anti-Social Net</h1>

            <section>
                <h2>Sobre Nosotros</h2>
                <p>
                    Bienvenido a la red social menos social de todas.
                </p>
            </section>

            <section>
                <h2>Publicaciones</h2>

                {cargando && <p>Cargando publicaciones...</p>}

                {error && <p>{error}</p>}

                {!cargando && !error && posts.length === 0 && (
                    <p>Todavía no hay publicaciones.</p>
                )}

                {posts.map((post) => (
                    <div key={post.id}>
                        <p>{post.description}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default Home;

