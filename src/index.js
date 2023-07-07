import {createBrowser, filePaths, logger} from "./lib/puppeteer-utils";
import {getUsersFromFile} from "./user/user-service";
import {startBrowser} from "./browser/bw-launcher";
import {waxBotConfig} from "./config/config-service";
import {areAccountsUpdated, writeAccountsToFile} from "./wax/tlm/tlm-service";

let users;
async function main() {
    logger.logInfo('Reading users');
    users = await getUsersFromFile(waxBotConfig.inputFile);
    logger.logInfo('Found ' + users.length + ' users, creating browsers');
    let browsers = [];
    if(waxBotConfig.updateTokens === "true") {
        launchAccountsChecker();
    }
    for(let user in users) {
        browsers.push(await createBrowser());
    }
    for (let i = 0; i < browsers.length; i++) {
        startBrowser(browsers[i], users[i]);
    }

}


function launchAccountsChecker() {
    logger.logInfo("ACCOUNTS - waiting for all tokens");
    let interval = setInterval(function () {
        if (areAccountsUpdated(users.length)) {
            logger.logInfo("ACCOUNTS - all accounts are updated, saving...");
            clearInterval(interval);
            writeAccountsToFile();
        }
    }, 500);
}


(async () => {
    await main();
    await logger.exportLogs(filePaths.logsPath());
})();
