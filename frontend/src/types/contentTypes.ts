export interface Post {
    id: string;
    content: string;
    userId: string;
    picture?: string;
    firstName: string;
    lastName: string;
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

export interface UploadedImage {
    id: string;
    title: string;
    file: string;
    created: string;
}