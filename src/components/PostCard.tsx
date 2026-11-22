import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Post, PostImage } from "../types";
import { obtenerImagenesDelPost } from "../services/imagesServices";
import { obtenerComentariosDelPost } from "../services/commentsServices";

interface PostCardProps {
    post: Post;
}

function PostCard({ post }: PostCardProps) {
    const [imagenes, setImagenes] = useState<PostImage[]>([]);
    const [cantidadComentarios, setCantidadComentarios] = useState(0);
    useEffect(() => {
        async function cargarImagenes() {
            try {
                const imagenesDelPost = await obtenerImagenesDelPost(post.id);
                setImagenes(imagenesDelPost);
            } catch {
                console.error("No se pudieron cargar las imágenes");
            }
        }

        cargarImagenes();
    }, [post.id]);
    useEffect(() => {
        async function cargarComentarios() {
            try {
                const comentarios = await obtenerComentariosDelPost(post.id);
                setCantidadComentarios(comentarios.length);
            } catch {
                console.error("No se pudieron cargar los comentarios");
            }
        }

        cargarComentarios();
    }, [post.id]);
    return (
    <div className="card h-100 shadow-sm post-card">
        {imagenes.length > 0 && (
            <div className="d-flex">
                {imagenes.map((imagen) => (
                    <img
                        key={imagen.id}
                        src={imagen.url}
                        alt="Imagen de la publicación"
                        className="w-100"
                        style={{ minWidth: 0, height: "180px", objectFit: "cover" }}
                    />
                ))}
            </div>
        )}
        <div className="card-body d-flex flex-column">
            <p className="card-text">{post.description}</p>
            {post.Tags && post.Tags.length > 0 && (
                <div className="d-flex flex-wrap gap-1 mb-3">
                    {post.Tags.map((tag) => (
                        <span key={tag.id} className="badge bg-secondary">
                            #{tag.name}
                        </span>
                    ))}
                </div>
            )}
            <div className="mt-auto d-flex justify-content-between align-items-center">
                <small className="text-muted">
                    {cantidadComentarios} comentarios
                </small>
                <Link to={`/post/${post.id}`} className="btn btn-primary btn-sm">
                    Ver más
                </Link>
            </div>
        </div>
    </div>
);
}

export default PostCard;

