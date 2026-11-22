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
    createdAt: string;
    User?: User;
    Tags?: Tag[];
}

export interface CrearPost {
    description: string;
    userId: number;
    tagIds: number[];
}

export interface Comment {
    id: number;
    content: string;
    UserId: number;
    PostId: number;
    User?: User;
    createdAt?: string;
}

export interface CrearComment {
    content: string;
    userId: number;
    postId: number;
}

export interface Tag {
    id: number;
    name: string;
}

export interface PostImage {
    id: number;
    url: string;
    PostId: number;
}

export interface CrearPostImage {
    url: string;
    postId: number;
}