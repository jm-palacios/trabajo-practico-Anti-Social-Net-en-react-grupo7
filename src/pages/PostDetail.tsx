import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CommentForm } from '../components/CommentForm';
import { CommentList } from '../components/CommentList';

interface PostDetailData {
  id: number;
  description: string;
  userId: number;
  user?: {
    nickName: string;
  };
}

interface PostImage {
  id: number;
  url: string;
  postId: number;
}

interface PostDetailProps {
  currentUserId?: number;
}

export const PostDetail: React.FC<PostDetailProps> = ({ currentUserId }) => {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  const [post, setPost] = useState<PostDetailData | null>(null);
  const [images, setImages] = useState<PostImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCommentsTrigger, setRefreshCommentsTrigger] = useState<number>(0);

  useEffect(() => {
    if (!postId || isNaN(postId)) {
      setError('ID de publicación no válido.');
      setLoading(false);
      return;
    }

    const fetchPostData = async () => {
      setLoading(true);
      setError(null);
      try {
        const postRes = await fetch(`http://localhost:3000/posts/${postId}`);
        if (!postRes.ok) throw new Error('No se pudo encontrar la publicación.');
        const postData = await postRes.json();
        setPost(postData);

        const imgRes = await fetch(`http://localhost:3000/postimages/post/${postId}`);
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          setImages(imgData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la publicación.');
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
        <div className="alert alert-danger" role="alert">
          {error || 'La publicación solicitada no existe.'}
        </div>
        <Link to="/" className="btn btn-outline-primary btn-sm">
          ← Volver al Feed
        </Link>
      </div>
    );
  }
  return (
    <div className="container py-4">
      <div className="mb-3">
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          ← Volver al Feed
        </Link>
      </div>

      <article className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="badge bg-secondary">
              👤 Publicado por: {post.user?.nickName || `Usuario #${post.userId}`}
            </span>
            <span className="text-muted small">Post #{post.id}</span>
          </div>

          <p className="card-text fs-5">{post.description}</p>

          {images.length > 0 && (
            <div className="row g-2 my-3">
              {images.map((img) => (
                <div key={img.id} className="col-12 col-md-6">
                  <img
                    src={img.url}
                    alt={`Imagen de post ${post.id}`}
                    className="img-fluid rounded border w-100"
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
      <section className="mt-4">
        <h4 className="mb-3">Sección de Comentarios</h4>

        {currentUserId ? (
          <CommentForm
            postId={postId}
            currentUserId={currentUserId}
            onCommentAdded={handleCommentAdded}
          />
        ) : (
          <div className="alert alert-info small mb-4">
            🔒 Debes <Link to="/login">iniciar sesión</Link> para dejar un comentario.
          </div>
        )}

        <CommentList postId={postId} refreshTrigger={refreshCommentsTrigger} />
      </section>
    </div>
  );
};