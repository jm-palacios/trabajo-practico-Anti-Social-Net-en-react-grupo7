import React, { useState } from 'react';

interface CommentFormProps {
  postId: number;
  currentUserId?: number;
  onCommentAdded: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  currentUserId = 1, // Usuario por defecto si no hay sesión
  onCommentAdded,
}) => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const cleanText = description.trim();
    if (!cleanText) {
      setError('El comentario no puede estar vacío.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: cleanText,
          postId,
          userId: currentUserId,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Error al publicar el comentario');
      }
      setDescription('');
      setSuccess('¡Comentario publicado exitosamente!');
      onCommentAdded(); // Recarga la lista de comentarios automáticamente
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al enviar el comentario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Dejá tu comentario</h5>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        {success && <div className="alert alert-success py-2">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows={3}
              placeholder="Escribí un comentario respetuoso..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Enviando...
              </>
            ) : (
              'Publicar Comentario'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentForm;