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
    <>
        <section className="bg-dark text-white text-center py-5">
            <div className="container">
                <h1 className="display-5 fw-bold">UnaHur Anti-Social Net</h1>
                <p className="lead mb-1">¡Bienvenidos a la red social menos social!</p>
                <p className="text-white-50 mb-0">
                    Un espacio para compartir publicaciones, descubrir contenido
                    y conocer qué pasa en nuestra comunidad.
                </p>
            </div>
        </section>

        <div className="container py-4">
            <section className="mb-5">
                <h2 className="h3 mb-3">Sobre nosotros</h2>
                <p>
                    UnaHur Anti-Social Net es una red social pensada para compartir
                    ideas, experiencias y publicaciones con la comunidad universitaria.
                </p>
                <p className="mb-0">
                    Podés explorar publicaciones, descubrir nuevos temas y
                    participar dejando comentarios.
                </p>
            </section>

            <section className="mb-5">
                <h2 className="h3 mb-3">¿Sabías que...?</h2>
                <div className="row g-3">
                    <div className="col-12 col-md-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h3 className="h5 card-title">Una red social diferente</h3>
                                <p className="card-text mb-0">
                                    Aunque nos llamamos Anti-Social Net, nos encanta
                                    compartir ideas y experiencias.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h3 className="h5 card-title">Compartí lo que quieras</h3>
                                <p className="card-text mb-0">
                                    Podés crear publicaciones, agregar imágenes y
                                    organizarlas mediante etiquetas.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <h3 className="h5 card-title">Participá en la comunidad</h3>
                                <p className="card-text mb-0">
                                    También podés comentar las publicaciones y descubrir
                                    lo que comparten otros usuarios.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="h3 mb-3">Publicaciones recientes</h2>

                {cargando && (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando publicaciones...</span>
                        </div>
                    </div>
                )}

                {error && <div className="alert alert-danger">{error}</div>}

                {!cargando && !error && posts.length === 0 && (
                    <div className="alert alert-info">Todavía no hay publicaciones.</div>
                )}

                <div className="row g-4">
                    {posts.map((post) => (
                        <div key={post.id} className="col-12 col-md-6 col-lg-4">
                            <PostCard post={post} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    </>
);
}

export default Home;

