import { AppDataSource } from "../database/data-source";
import { ConfigurationEntity } from "../database/entity/configuration.entity";

const ConfigurationRepository = AppDataSource.getRepository(ConfigurationEntity);

export default ConfigurationRepository;
