import type { DexieDbType } from "../database";
import type { GlobalConfig } from "../types/global-config";

export class GlobalConfigRepository {
  constructor(private db: DexieDbType) {}

  public async getGlobalConfig() {
    let config = await this.db.globalConfig.limit(1).first();
    if (config === undefined) {
      config = await this.initGlobalConfig();
    }
    return config;
  }

  private async initGlobalConfig() {
    const config: Omit<GlobalConfig, "id"> = {
      selectedProfileId: undefined,
    };
    const id = await this.db.globalConfig.add(config);
    return {
      ...config,
      id,
    };
  }

  public async updateGlobalConfig(config: Partial<Omit<GlobalConfig, "id">>) {
    const currentConfig = await this.getGlobalConfig();
    const id = currentConfig.id;
    await this.db.globalConfig.update(id, config);
    const newConfig = await this.db.globalConfig.get(id);
    if (newConfig === undefined) {
      throw new Error("Global config not found after update");
    }
    return newConfig;
  }
}
