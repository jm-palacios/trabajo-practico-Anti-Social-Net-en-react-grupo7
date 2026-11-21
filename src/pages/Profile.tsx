import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import type { Post } from "../types";
import { buscarPostPorUsuario } from "../services/postServices";
import { obtenerComentariosDelPost } from "../services/commentsServices";

function Profile() {
    const { usuario, cerrarSesion } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState<Post[]>([]);
    const [comentarios, setComentarios] = useState<Record<number, number>>({});
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const usuarioId = usuario?.id;

    useEffect(() => {
        if (usuarioId === undefined) return;

        async function cargar(id: number) {
            try {
                const publicaciones = await buscarPostPorUsuario(id);
                setPosts(publicaciones);

                const conteos = await Promise.all(
                    publicaciones.map(async (p) => {
                        const lista = await obtenerComentariosDelPost(p.id);
                        return [p.id, lista.length] as const;
                    })
                );
                setComentarios(Object.fromEntries(conteos));
            } catch (e) {
                setError(e instanceof Error ? e.message: "No se pudieron cargar las publicaciones");
            } finally {
                setCargando(false);
            }
        }
        cargar(usuarioId);
    }, [usuarioId]);

    function handleLogout() {
        cerrarSesion();
        navigate("/");
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">{usuario?.nickName}</h1>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
            {cargando && <p>Cargando publicaciones...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!cargando && !error && posts.length === 0 && (
                <p>Todavía no tenés publicaciones.</p>
            )}

            {!cargando && !error && posts.map((post) => (
                <div key={post.id} className="card mb-3">
                    <div className="card-body">
                        <p className="card-text">{post.description}</p>
                        <p className="text-muted small mb-2">
                            {comentarios[post.id] ?? 0} comentarios
                        </p>
                        <Link to={`/post/${post.id}`} className="btn btn-primary btn-sm">
                            Ver más
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Profile; 