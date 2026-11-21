import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_URL, leerError } from '../services/api';
import type { Tag } from '../types';

function CreatePost() {

    // Obtiene los datos del usuario que inició sesión
    const { user } = useAuth();

    // Permite navegar entre las páginas de la aplicación
    const navigate = useNavigate();

    // Estados del formulario
    const [description, setDescription] = useState('');
    const [imageUrls, setImageUrls] = useState<string[]>(['']);

    // Estados para almacenar y controlar las etiquetas recibidas de la API
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [loadingTags, setLoadingTags] = useState(true);
    const [errorTags, setErrorTags] = useState('');

    // Controla el envío de la publicación
    const [loading, setLoading] = useState(false);

    // Guarda mensajes de error o confirmación
    const [message, setMessage] = useState('');

    const [creado, setCreado] = useState(false);

    // Consulta las etiquetas disponibles cuando se carga el componente
    useEffect(() => {

        // Función asincrónica para obtener las etiquetas desde el servidor
        const fetchTags = async () => {
            try {
                const response = await fetch(`${API_URL}/tags`);

                // Verifica si la respuesta del servidor fue correcta
                if (!response.ok) {
                    throw new Error(await leerError(response, 'No se pudieron cargar las etiquetas.'));
                }

                // Convierte la respuesta a JSON y guarda las etiquetas
                const data: Tag[] = await response.json();
                setTags(data);

            } catch (error) {
                // Guarda un mensaje si ocurre algún problema durante la consulta
                setErrorTags(
                    error instanceof Error
                        ? error.message
                        : 'Error al conectar con el servidor.'
                );
            } finally {
                // Finaliza el estado de carga, haya ocurrido un error o no
                setLoadingTags(false);
            }
        };

        fetchTags();

    }, []);

    // Actualiza la URL de una imagen según la posición del campo
    const handleImageChange = (index: number, value: string) => {
        const updatedImages = [...imageUrls];
        updatedImages[index] = value;
        setImageUrls(updatedImages);
    };

    // Agrega un nuevo campo vacío para ingresar otra imagen
    const addImageField = () => {
        setImageUrls([...imageUrls, '']);
    };

    // Elimina el campo de imagen seleccionado
    const removeImageField = (index: number) => {
        setImageUrls(imageUrls.filter((_, i) => i !== index));
    };

    // Envía la publicación y luego registra sus imágenes en la API
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Limpia mensajes anteriores
        setMessage('');

        // Verifica que la descripción no esté vacía
        if (!description.trim()) {
            setMessage('La descripción es obligatoria.');
            return;
        }

        // Verifica que exista un usuario autenticado
        if (!user) {
            setMessage('Debés iniciar sesión para crear una publicación.');
            return;
        }

        try {
            // Activa el estado de carga
            setLoading(true);

            // PASO 1: Crear la publicación
            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: description.trim(),
                    userId: user.id,
                    tagIds: selectedTags,
                }),
            });

            // Verifica si el servidor respondió correctamente
            if (!response.ok) {
                throw new Error(await leerError(response, 'No se pudo crear la publicación.'));
            }

            // Obtiene los datos de la publicación creada
            const createdPost = await response.json();

            // Obtiene el ID de la publicación
            const postId = createdPost.id;

            // Filtra los campos de imagen que no estén vacíos
            const validImageUrls = imageUrls.filter(
                (url) => url.trim() !== ''
            );

            // PASO 2: Registrar las imágenes de la publicación
            for (const url of validImageUrls) {
                const imageResponse = await fetch(
                    `${API_URL}/postimages`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            url: url.trim(),
                            postId: postId,
                        }),
                    }
                );

                // Verifica si el servidor registró correctamente la imagen
                if (!imageResponse.ok) {
                    throw new Error(
                        await leerError(
                            imageResponse,
                            'La publicación se creó, pero no se pudo registrar una imágen'
                        )
                    );
                }
            }

            // Muestra la confirmación y la cantidad de imágenes registradas
            setMessage(
                `Publicación creada correctamente. ID: ${postId}. Imágenes registradas: ${validImageUrls.length}.`
            );

            setCreado(true);

            // Redirige al perfil después de que el usuario esté confirmado que inicio sesión
            setTimeout(() => navigate('/profile'), 1500);

        } catch (error) {
            // Muestra el error si falla alguna operación
            setMessage(
                error instanceof TypeError
                    ? 'No se pudo conectar con el servidor'
                    : error instanceof Error
                        ? error.message
                        : 'Error al conectar con el servidor'
            );
        } finally {
            // Finaliza el estado de carga
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Crear publicación</h2>

            <form onSubmit={handleSubmit}>

                {/* Campo para escribir la descripción de la publicación */}
                <div className="mb-3">
                    <label className="form-label">
                        Descripción
                    </label>

                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="¿Qué querés compartir?"
                        required
                    />
                </div>

                {/* Selector para elegir una o varias etiquetas */}
                <div className="mb-3">
                    <label className="form-label">
                        Etiquetas
                    </label>

                    {loadingTags ? (
                        <p>Cargando etiquetas...</p>
                    ) : errorTags ? (
                        <p className="text-danger">{errorTags}</p>
                    ) : (
                        <select
                            className="form-select"
                            multiple
                            value={selectedTags.map((id) => id.toString())}
                            onChange={(e) => {
                                const selectedOptions = Array.from(
                                    e.target.selectedOptions,
                                    (option) => Number(option.value)
                                );

                                setSelectedTags(selectedOptions);
                            }}
                        >
                            {tags.map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>
                    )}

                    <small className="text-muted">
                        Podés seleccionar varias etiquetas manteniendo
                        presionada la tecla Ctrl.
                    </small>
                </div>

                {/* Campos dinámicos para ingresar las URLs de las imágenes */}
                <div className="mb-3">
                    <label className="form-label">
                        Imágenes (URLs)
                    </label>

                    {imageUrls.map((url, index) => (
                        <div className="d-flex gap-2 mb-2" key={index}>
                            <input
                                type="url"
                                className="form-control"
                                value={url}
                                onChange={(e) =>
                                    handleImageChange(index, e.target.value)
                                }
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />

                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => removeImageField(index)}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}

                    {/* Botón para agregar otro campo de imagen */}
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={addImageField}
                    >
                        Agregar imagen
                    </button>
                </div>

                {/* Botón para enviar la publicación */}
                <div className="mb-3">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || creado}
                    >
                        {loading ? 'Publicando...' : 'Publicar'}
                    </button>
                </div>

                {/* Mensaje de confirmación o error */}
                {message && (
                    <div role="status" className={`alert mt-2 ${creado ? 'alert-success' : 'alert-danger'}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}

export default CreatePost;
