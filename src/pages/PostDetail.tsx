import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';

interface PostImage {
  id: number;
  imageUrl: string;
}
interface Post {
  id: number;
  title: string;
  description: string;
  createdAt?: string;
  author?: {
    nickName: string;
  };
  tags?: Array<{ id: number; name: string } | string>;
}
interface PostDetailProps {
  currentUserId?: number;
}

const PostDetail: React.FC<PostDetailProps> = ({ currentUserId }) => {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const [post, setPost] = useState<Post | null>(null);
  const [images, setImages] = useState<PostImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCommentsTrigger, setRefreshCommentsTrigger] = useState(0);

  useEffect(() => {
    if (!postId || isNaN(postId)) {
      setError('Identificador de publicación inválido.');
      setLoading(false);
      return;
    }
    const fetchPostData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Petición al posteo
        const postRes = await fetch(`http://localhost:3000/posts/${postId}`);
        if (!postRes.ok) {
          throw new Error('Publicación no encontrada.');
        }
        const postData = await postRes.json();
        setPost(postData);
        // Petición a las imágenes del posteo
        const imgRes = await fetch(
          `http://localhost:3000/postimages/post/${postId}`
        );
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          setImages(imgData);
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar la publicación.');
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [postId]);
  const handleCommentAdded = () => {
    setRefreshCommentsTrigger((prev) => prev + 1);
  };
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando publicación...</span>
        </div>
      </div>
    );
  }
  if (error || !post) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h4>Ocurrió un error</h4>
          <p>{error || 'No se pudo encontrar la publicación solicitada.'}</p>
          <Link to="/" className="btn btn-outline-danger mt-2">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Botón de regreso */}
      <Link to="/" className="btn btn-outline-secondary mb-3 btn-sm">
        &larr; Volver al feed
      </Link>
      {/* Tarjeta del Posteo */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="card-title fw-bold">{post.title}</h2>
          <div className="text-muted mb-3">
            <small>
              Publicado por{' '}
              <strong>@{post.author?.nickName || 'Anónimo'}</strong>
              {post.createdAt &&
                ` el ${new Date(post.createdAt).toLocaleDateString()}`}
            </small>
          </div>
          <p className="card-text fs-5">{post.description}</p>
          {/* Renderizado de etiquetas si existen */}
          {post.tags && post.tags.length > 0 && (
            <div className="d-flex gap-2 my-3">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="badge bg-secondary">
                  #{typeof tag === 'string' ? tag : tag.name}
                </span>
              ))}
            </div>
          )}
          {/* Galería de imágenes si existen */}
          {images.length > 0 && (
            <div className="row g-2 mt-3">
              {images.map((img) => (
                <div key={img.id} className="col-12 col-md-6">
                  <img
                    src={img.imageUrl}
                    alt="Imagen del post"
                    className="img-fluid rounded border shadow-sm"
                    style={{ maxHeight: '350px', objectFit: 'cover', width: '100%' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Sección de Comentarios */}
      <div className="row">
        <div className="col-12 col-lg-8 mx-auto">
          <CommentForm
            postId={postId}
            currentUserId={currentUserId}
            onCommentAdded={handleCommentAdded}
          />
          <CommentList
            postId={postId}
            refreshTrigger={refreshCommentsTrigger}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;