import "reflect-metadata"
import { DataSource } from "typeorm"
import { ConfigurationEntity } from "./entity/configuration.entity"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [ConfigurationEntity],
    migrations: [],
    subscribers: [],
})
