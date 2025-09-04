import { Body, Get, JsonController, Post } from "routing-controllers";
import { Service } from "typedi";
import { CreateGame, GameService } from "../services/game.service";

@Service()
@JsonController("/games")
export class GameController {
  constructor(
    private gameService: GameService
  ) {
  }

  @Get("/")
  async getAllGames() {
    return this.gameService.getAllGames();
  }

  @Post("/")
  async createGame(@Body() gameData: CreateGame) {
    return this.gameService.createGame(gameData);
  }
}
