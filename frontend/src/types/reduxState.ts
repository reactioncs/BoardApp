import { User } from "./authTypes";
import { Post } from "./contentTypes";

export interface AuthState {
    mode: string;
    user: User | null;
    posts: Post[];
}