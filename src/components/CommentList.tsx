import React, { useEffect, useState } from 'react';

interface Author {
  id: number;
  nickName: string;
}
interface Comment {
  id: number;
  description: string;
  createdAt?: string;
  author?: Author;
  user?: Author;
}
interface CommentListProps {
  postId: number;
  refreshTrigger: number;
}

const CommentList: React.FC<CommentListProps> = ({ postId, refreshTrigger }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:3000/comments/post/${postId}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error('No se pudieron obtener los comentarios.');
        }
        const data = await response.json();
        setComments(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Error de conexión con el servidor.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComments();

    return () => controller.abort(); // Limpieza del efecto
  }, [postId, refreshTrigger]);
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando comentarios...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return <div className="alert alert-warning py-2">{error}</div>;
  }
  if (comments.length === 0) {
    return (
      <div className="alert alert-info text-center py-3">
        Todavía no hay comentarios en este posteo. ¡Sé el primero en comentar!
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3">
      <h5 className="fw-bold">Comentarios ({comments.length})</h5>
      {comments.map((comment) => {
        const authorName =
          comment.author?.nickName || comment.user?.nickName || 'Usuario Anónimo';
        return (
          <div key={comment.id} className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold text-primary">@{authorName}</span>
                {comment.createdAt && (
                  <small className="text-muted">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </small>
                )}
              </div>
              <p className="card-text mb-0">{comment.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;