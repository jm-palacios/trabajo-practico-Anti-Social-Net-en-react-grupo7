export interface User {
    id: number;
    nickName: string;
    email: string;
}

export interface CrearUsuario {
    nickName: string;
    email: string;
}

export interface Post {
    id: number;
    description: string;
    UserId: number;
    User?: User;
    Tags?: Tag[];
    images?: PostImage[];
}

export interface CrearPost {
    description: string;
    UserId: number;
    User?: User;
    Tags?: Tag[];
    images?: PostImage[];
}

export interface Comment {
    id: number;
    content: string;
    UserId: number;
    PostId: number;
    User?: User;
}

export interface CrearComment {
    content: string;
    UserId: number;
    PostId: number;
    User?: User;
}

export interface Tag {
    id: number;
    name: string;
}

export interface PostImage {
    id: number;
    url: string;
    postId: number;
}

export interface CrearPostImage {
    url: string;
    postId: number;
}