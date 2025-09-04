import { Service } from "typedi";

type Game = {
    id: string;
    players: string[];
    status: "started" | "ended";
    score: {
        home: number;
        away: number;
    };
    startTime: Date;
    endTime?: Date;
};

@Service()
export class GameService {
    private game: Game;

    constructor() {
        this.startGame();
    }

    public getGame(): Game {
        return this.game;
    }

    public startGame(): Game {
        this.game = {
            id: Math.random().toString(36).substring(2, 15),
            players: [],
            status: "started",
            score: {
                home: 0,
                away: 0,
            },
            startTime: new Date(),
        };

        return this.game;
    }

    public endGame(): Game {
        this.game.status = "ended";
        this.game.endTime = new Date();

        return this.game;
    }

    public getGameStatus(): string {
        return this.game.status;
    }
}