import {
  Authorized,
  Body,
  JsonController,
  Post
} from "routing-controllers";
import { Service } from "typedi";
import { CreateMatchDTO } from "../dtos";
import { MatchService } from "../services/match.service";

@Service()
@JsonController("/matches")
export class MatchController {
  constructor(private matchService: MatchService) {}
}
