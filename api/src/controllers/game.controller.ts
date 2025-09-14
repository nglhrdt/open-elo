import { Authorized, Body, Get, JsonController, Post } from "routing-controllers";
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
  @Authorized()
  async getAllGames() {
    return this.gameService.getAllGames();
  }

  @Post("/")
  @Authorized()
  async createGame(@Body() gameData: CreateGame) {
    return this.gameService.createGame(gameData);
  }
}
