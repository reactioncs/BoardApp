export interface Post {
    id: string;
    content: string;
    comments: string[],
}

export interface Comment {
    id: string;
    content: string;
}

export interface Friend {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
}