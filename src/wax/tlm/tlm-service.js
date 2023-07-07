import {waxBotConfig} from "../../config/config-service";
import {logger} from "../../lib/puppeteer-utils";

const path = require('path');
const fs = require('fs');

let accounts = [];

export function pushNewAccount(account) {
    logger.logInfo("ACCOUNTS - updated token for " + account.name);
    accounts.push(account);
}

export function writeAccountsToFile() {
    let fileName = waxBotConfig.inputFile.split(".")[0] + "-accounts.json";
    const filePath = path.resolve(fileName);
    const jsonData = JSON.stringify(accounts, null, 1);

    try {
        fs.writeFileSync(filePath, jsonData, 'utf8');
        logger.logInfo('Accounts are written into the file: ' + fileName);
    } catch (err) {
        logger.logError('Error writing to file: ' + err);
    }
}

export function areAccountsUpdated(usersNumber) {
    return accounts.length === usersNumber && accounts.filter(a => a.waxToken !== undefined).length === accounts.length;
}