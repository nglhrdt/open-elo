import "reflect-metadata";
import { AppDataSource } from "./database/data-source";

import dotenv from 'dotenv';
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { AuthController } from "./controllers/auth.controller";
import { GameController } from "./controllers/game.controller";
import { HealthController } from "./controllers/health.controller";
import { LeagueController } from "./controllers/league.controller";
import { ProfileController } from "./controllers/profile.controller";
import { RankingController } from "./controllers/ranking.controller";
import { UserController } from "./controllers/user.controller";
import { AuthService } from "./services/auth.service";

dotenv.config();
useContainer(Container);

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established successfully.");

    createExpressServer({
      validation: true,
      authorizationChecker: (action, roles) => Container.get(AuthService).isAuthenticated(action, roles),
      currentUserChecker: (action) => Container.get(AuthService).getCurrentUser(action),
      cors: {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
      },
      controllers: [AuthController, GameController, HealthController, LeagueController, ProfileController, RankingController, UserController],
      middlewares: [],
      interceptors: [],
    }).listen(3000);
    console.log("Server is running on http://localhost:3000");
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
  }
}

main();
