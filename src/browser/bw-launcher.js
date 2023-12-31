import {loginToCloudWallet, loginToWax} from "../wax/wax-service";
import {logger} from "../lib/puppeteer-utils";
import {alcorUrl} from "./bw-constants";
import {waxBotConfig} from "../config/config-service";

export async function startBrowser(browser, user) {
    if(waxBotConfig.useWax === "true") {
        await loginToWax(browser, user);
    }
    if(waxBotConfig.useAlcor === "true") {
        // await startAlcor(browser, user);
    }
    if(waxBotConfig.useCloudWallet === "true") {
        await loginToCloudWallet(browser, user);
    }
}

async function startAlcor(browser, user) {
    logger.log(user.email + ' - entering Alcor');
    let fwPage = await browser.newPage();
    await fwPage.goto(alcorUrl);
}


