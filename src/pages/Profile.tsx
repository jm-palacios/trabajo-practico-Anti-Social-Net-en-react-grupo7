import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import type { Post } from "../types";
import { buscarPostPorUsuario } from "../services/postServices";

function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState<Post[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const usuarioId = user?.id;

    useEffect(() => {
        if (usuarioId === undefined) return;

        async function cargar(id: number) {
            try {
                const publicaciones = await buscarPostPorUsuario(id);
                setPosts(publicaciones);
            } catch (e) {
                setError(e instanceof Error ? e.message : "No se pudieron cargar las publicaciones");
            } finally {
                setCargando(false);
            }
        }
        cargar(usuarioId);
    }, [usuarioId]);

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">{user?.nickName}</h1>
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>
            {cargando && (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando publicaciones...</span>
                    </div>
                </div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}
            {!cargando && !error && posts.length === 0 && (
                <div className="alert alert-info">Todavía no tenés publicaciones.</div>
            )}

            <div className="row g-4">
                {!cargando && !error && posts.map((post) => (
                    <div key={post.id} className="col-12 col-md-6 col-lg-4">
                        <PostCard post={post} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Profile; 