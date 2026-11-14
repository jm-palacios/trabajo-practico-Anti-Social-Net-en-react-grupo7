import React, { useState } from 'react';

interface CommentFormProps {
  postId: number;
  currentUserId: number;
  onCommentAdded?: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  currentUserId,
  onCommentAdded,
}) => {
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'danger';
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description.trim()) {
      setAlert({
        type: 'danger',
        message: 'El comentario no puede estar vacío.',
      });
      return;
    }
    setIsSubmitting(true);
    setAlert(null);
    try {
      const response = await fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description.trim(),
          postId,
          userId: currentUserId,
        }),
      });
      if (!response.ok) {
        throw new Error('No se pudo publicar el comentario.');
      }
      setDescription('');
      setAlert({
        type: 'success',
        message: '¡Comentario publicado con éxito!',
      });
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      setAlert({
        type: 'danger',
        message:
          err instanceof Error ? err.message : 'Error al enviar el comentario.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h6 className="card-title mb-3">💬 Dejá tu comentario</h6>
        {alert && (
          <div
            className={`alert alert-${alert.type} alert-dismissible fade show small`}
            role="alert"
          >
            {alert.message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setAlert(null)}
            ></button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows={3}
              placeholder="Escribí lo que pensás sobre este posteo..."
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              disabled={isSubmitting}
            ></textarea>
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary btn-sm px-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Publicar Comentario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};