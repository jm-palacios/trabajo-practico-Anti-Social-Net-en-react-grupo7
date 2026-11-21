import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Post, PostImage } from "../types";
import { obtenerImagenesDelPost } from "../services/imagesServices";

interface PostCardProps {
    post: Post;
}

function PostCard({ post }: PostCardProps) {
    return (
        <div>
            <p>{post.description}</p>
            {imagenes.map((imagen) => (
                <img
                    key={imagen.id}
                    src={imagen.url}
                    alt="Imagen de la publicación"
                    style={{ maxWidth: "300px" }}
                />
            ))}
            <Link to={`/post/${post.id}`}>
                Ver más
            </Link>
        </div>
    );
}

export default PostCard;

