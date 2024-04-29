export interface Post {
    id: string;
    content: string;
    comments: string[],
}

export interface Comment {
    id: string;
    content: string;
}