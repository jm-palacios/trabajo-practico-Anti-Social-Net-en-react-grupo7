
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Representa una imagen asociada a una publicación
interface PostImage {
    id: number;
    url: string;
    PostId: number;
}

// Representa una publicación recibida desde la API
interface Post {
    id: number;
    description: string;
    createdAt: string;
    UserId: number;
}

// Representa una publicación junto con sus imágenes
interface PostWithImages extends Post {
    images: PostImage[];
}

function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState<PostWithImages[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Obtenemos las publicaciones del usuario que inició sesión
    useEffect(() => {
        const fetchPosts = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:3001/posts?userId=${user.id}`
                );

                if (!response.ok) {
                    throw new Error('No se pudieron obtener las publicaciones.');
                }

                const postsData: Post[] = await response.json();

                // Obtenemos las imágenes correspondientes a cada publicación
                const postsWithImages = await Promise.all(
                    postsData.map(async (post) => {
                        try {
                            const imageResponse = await fetch(
                                `http://localhost:3001/postimages/post/${post.id}`
                            );

                            if (!imageResponse.ok) {
                                return { ...post, images: [] };
                            }

                            const images: PostImage[] = await imageResponse.json();

                            return { ...post, images };
                        } catch {
                            return { ...post, images: [] };
                        }
                    })
                );

                setPosts(postsWithImages);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Ocurrió un error al cargar el perfil.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user]);

    // Cerramos la sesión y volvemos al login
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="container mt-4">
            <h2>Mi perfil</h2>

            <h4>Bienvenido, {user?.nickName}</h4>

            <button
                type="button"
                onClick={handleLogout}
                className="btn btn-danger mb-4"
            >
                Cerrar sesión
            </button>

            <h3>Mis publicaciones</h3>

            {loading && <p>Cargando publicaciones...</p>}

            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && posts.length === 0 && (
                <p>Todavía no tenés publicaciones.</p>
            )}

            {posts.map((post) => (
                <div className="card mb-3" key={post.id}>
                    <div className="card-body">
                        <h5 className="card-title">
                            Publicación #{post.id}
                        </h5>

                        <p className="card-text">
                            {post.description}
                        </p>

                        <small className="text-muted">
                            {new Date(post.createdAt).toLocaleString()}
                        </small>

                        <div className="mt-3">
                            {post.images.length > 0 ? (
                                post.images.map((image) => (
                                    <img
                                        key={image.id}
                                        src={image.url}
                                        alt={`Imagen de la publicación ${post.id}`}
                                        className="img-fluid me-2 mb-2"
                                        style={{ maxWidth: '200px' }}
                                    />
                                ))
                            ) : (
                                <p>Esta publicación no tiene imágenes.</p>
                            )}
                        </div>

                        <Link
                            to={`/posts/${post.id}`}
                            className="btn btn-primary mt-2"
                        >
                            Ver más
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Profile;
