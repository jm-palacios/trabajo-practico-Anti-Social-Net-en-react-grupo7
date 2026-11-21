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
        <div>
            <p>{post.description}</p>
            {post.Tags?.map((tag) => (
                <span key={tag.id}>
                    #{tag.name}{" "}
                </span>
            ))}
            {imagenes.map((imagen) => (
                <img
                    key={imagen.id}
                    src={imagen.url}
                    alt="Imagen de la publicación"
                    style={{ maxWidth: "300px" }}
                />
            ))}
            <p>Comentarios: {cantidadComentarios}</p>
            <Link to={`/post/${post.id}`}>
                Ver más
            </Link>
        </div>
    );
}

export default PostCard;

