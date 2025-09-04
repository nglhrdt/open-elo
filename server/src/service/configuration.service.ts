import { Service } from "typedi";
import repository from "../repository/configuration.repository";

type ConfigurationDTO = {
    id?: string;
    tableName: string;
}

@Service()
class ConfigurationService {

    create(tableName: string): Promise<ConfigurationDTO> {
        const config = repository.create({ tableName });
        return repository.save(config);
    }

    async update(id, data: { tableName: string }): Promise<ConfigurationDTO> {
        await repository.update(id, { tableName: data.tableName });
        return this.getConfiguration();
    }

    async getConfiguration(): Promise<ConfigurationDTO> {
        const configs = await repository.find();

        if (configs.length !== 1) {
            return null;
        }

        return configs[0];
    }
}

export default ConfigurationService;