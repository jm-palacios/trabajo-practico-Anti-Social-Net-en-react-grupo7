import React, { useEffect, useState } from 'react';
import type { Comment } from '../types';
import { obtenerComentariosDelPost } from '../services/commentsServices';

interface CommentListProps {
  postId: number;
  refreshTrigger: number;
}

const CommentList: React.FC<CommentListProps> = ({ postId, refreshTrigger }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    async function cargar() {
      setLoading(true);
      setError(null);
      try {
        const data = await obtenerComentariosDelPost(postId);
        if (activo) setComments(data)
      } catch (err) {
        if (activo) setError(err instanceof Error ? err.message: 'Error de conexión con el servidor')
      } finally {
        if (activo) setLoading(false);
      }
    }  

    cargar();
    return () => { activo = false };
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
          comment.User?.nickName || 'Usuario Anónimo';
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
              <p className="card-text mb-0">{comment.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;