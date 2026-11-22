
import { useEffect, useState } from "react";
import { obtenerPosts } from "../services/postServices";
import type { Post } from "../types";
import PostCard from "../components/PostCard";

function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function cargarPosts() {
            try {
                const publicaciones = await obtenerPosts();
                const publicacionesOrdenadas = [...publicaciones].sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );
                setPosts(publicacionesOrdenadas);
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
            <header>
                <h1>UnaHur Anti-Social Net</h1>
                <h2>¡Bienvenidos a la red social menos social!</h2>
                <p>
                    Un espacio para compartir publicaciones,
                    descubrir contenido y conocer qué pasa en nuestra comunidad.
                </p>
            </header>
            <section>
                <h2>Sobre Nosotros</h2>
                <p>
                    UnaHur Anti-Social Net es una red social pensada para
                    compartir ideas, experiencias y publicaciones con
                    la comunidad universitaria.
                </p>
                <p> Podés explorar publicaciones, descubrir nuevos temas
                    y participar dejando comentarios.
                </p>
            </section>
            <section>
                <h2>¿Sabías que...?</h2>

                <h3>Una red social diferente</h3>
                <p>
                    Aunque nos llamamos Anti-Social Net,
                    nos encanta compartir ideas y experiencias.
                </p>

                <h3>Compartí lo que quieras</h3>
                <p>
                    Podés crear publicaciones, agregar imágenes
                    y organizarlas mediante etiquetas.
                </p>

                <h3>Participá en la comunidad</h3>
                <p>
                    También podés comentar las publicaciones
                    y descubrir lo que comparten otros usuarios.
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
                    <PostCard key={post.id} post={post} />
                ))}

            </section>
        </div >
    );
}

export default Home;

