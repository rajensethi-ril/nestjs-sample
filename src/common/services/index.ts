import { ConfigService } from "./config/config.service";
import { CryptographerService } from "./cryptographer/cryptographer.service";

export const CommonProviders = [
    CryptographerService,
    ConfigService,
]