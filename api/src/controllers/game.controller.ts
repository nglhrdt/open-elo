import {
  Authorized,
  Get,
  JsonController
} from "routing-controllers";
import { Service } from "typedi";
import { GameService } from "../services/game.service";

@Service()
@JsonController("/games")
export class GameController {
  constructor(private gameService: GameService) { }

  @Get("/")
  @Authorized()
  async getAllGames() {
    return this.gameService.getAllGames();
  }
}
