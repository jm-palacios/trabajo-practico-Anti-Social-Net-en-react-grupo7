import React, { useEffect, useState } from 'react';

export interface Comment {
  id: number;
  description: string;
  postId: number;
  userId: number;
  user?: {
    nickName: string;
  };
}

interface CommentListProps {
  postId: number;
  refreshTrigger?: number;
}

export const CommentList: React.FC<CommentListProps> = ({ postId, refreshTrigger = 0 }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/comments/post/${postId}`);
        if (!response.ok) {
          throw new Error('No se pudieron obtener los comentarios.');
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar comentarios.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId, refreshTrigger]);
  if (loading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border spinner-border-sm text-secondary" role="status">
          <span className="visually-hidden">Cargando comentarios...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return <div className="alert alert-warning small">{error}</div>;
  }
  if (comments.length === 0) {
    return (
      <div className="card card-body bg-light text-center text-muted py-4 small">
        💬 Todavía no hay comentarios en esta publicación. ¡Sé el primero en comentar!
      </div>
    );
  }
  return (
    <div className="d-flex flex-column gap-2">
      {comments.map((comment) => (
        <div key={comment.id} className="card shadow-sm border-0 bg-light">
          <div className="card-body py-2 px-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="fw-bold text-primary small">
                👤 {comment.user?.nickName || `Usuario #${comment.userId}`}
              </span>
              <span className="text-muted extra-small" style={{ fontSize: '0.75rem' }}>
                #Comentario {comment.id}
              </span>
            </div>
            <p className="card-text mb-0 small text-dark">{comment.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};