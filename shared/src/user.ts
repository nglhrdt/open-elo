export type User = {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin' | 'guest';
    favoriteLeague: {
        id: string;
        name: string;
        game: "TABLE_SOCCER";
        season: {
            id: string;
            seasonNumber: number;
        };
    };
}
