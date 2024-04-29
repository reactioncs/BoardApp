import { User } from "./authTypes";
import { Post } from "./contentTypes";

export interface PreferenceState {
    mode: string;
}

export interface AuthState {
    user: User | null;
    posts: Post[];
}