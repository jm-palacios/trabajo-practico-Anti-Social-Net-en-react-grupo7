import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import { useAuth } from '../context/AuthContext';
import type { Post, PostImage } from '../types';
import { obtenerPostPorId } from '../services/postServices';
import { obtenerImagenesDelPost } from '../services/imagesServices';

const PostDetail: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const idInvalido = !postId || isNaN(postId);
  const [post, setPost] = useState<Post | null>(null);
  const [images, setImages] = useState<PostImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCommentsTrigger, setRefreshCommentsTrigger] = useState(0);

  useEffect(() => {
    if (idInvalido) return;
    const fetchPostData = async () => {
      setLoading(true);
      setError(null);
      try {
        const postData = await obtenerPostPorId(postId);
        setPost(postData);
        try {
          setImages(await obtenerImagenesDelPost(postId));
        } catch {
          setImages([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la publicación.');
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [postId, idInvalido]);
  const handleCommentAdded = () => {
    setRefreshCommentsTrigger((prev) => prev + 1);
  };
  if (loading && !idInvalido) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando publicación...</span>
        </div>
      </div>
    );
  }
  if (idInvalido || error || !post) {
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
          <div className="text-muted mb-3">
            <small>
              Publicado por{' '}
              <strong>@{post.User?.nickName || 'Anónimo'}</strong>
              {post.createdAt &&
                ` el ${new Date(post.createdAt).toLocaleDateString()}`}
            </small>
          </div>
          <p className="card-text fs-5">{post.description}</p>
          {/* Renderizado de etiquetas si existen */}
          {post.Tags && post.Tags.length > 0 && (
            <div className="d-flex gap-2 my-3">
              {post.Tags.map((tag, idx) => (
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
                    src={img.url}
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
            currentUserId={user?.id}
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