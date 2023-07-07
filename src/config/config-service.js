import path from "path";
import fs from "fs";
import {configPath} from "./config-constants";
import {Config} from "./config-model";

export let waxBotConfig = readConfig();

function readConfig() {
    let configJson = JSON.parse(fs.readFileSync(path.resolve(configPath), 'utf8'));
    return new Config(configJson.inputFile, configJson.useAlcor, configJson.useBloks,
        configJson.landId, configJson.useWax, configJson.useCloudWallet, configJson.updateTokens);
}
