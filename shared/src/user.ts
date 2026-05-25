import type { GAME } from "./league";

export type ROLE = 'user' | 'admin' | 'guest';

export type User = {
    id: string;
    username: string;
    email: string;
    role: ROLE;
    favoriteLeague: {
        id: string;
        name: string;
        game: GAME;
        season: {
            id: string;
            seasonNumber: number;
        };
    };
}

export type Profile = {
    id: string;
    username: string;
    email: string;
    role: ROLE;
    favoriteLeague: {
        id: string;
        name: string;
        game: GAME;
        season: {
            id: string;
            seasonNumber: number;
        };
    };
}