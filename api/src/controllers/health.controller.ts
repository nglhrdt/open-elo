import { Get, JsonController } from "routing-controllers";
import { Service } from "typedi";

@Service()
@JsonController()
export class HealthController {
    @Get("/health-check")
    async getAllGames() {
        return { status: "ok" };
    }
}