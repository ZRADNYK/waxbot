import {logger, write} from "../lib/puppeteer-utils";
import {
    blocksMainPageUrl,
    blocksSetAwLandUrl, bloksAwAccountSelector, bloksAwLandIdSelector,
    bloksLoginSelector, bloksSetLandSubmitSelector,
    connectWaxWalletSelector
} from "../browser/bw-constants";
import {createCursor} from "ghost-cursor";
import {waxWalletContinueButtonSelector} from "../wax/wax-constants";

export async function startBlocks(browser, user, config) {
    let bloksPage = await browser.newPage();
    if (!!config.landId) {
        await loginToBloks(browser, user, blocksSetAwLandUrl, bloksPage);
        await setLand(browser, bloksPage, user, config);
    }
    else {
        await loginToBloks(browser, user, blocksMainPageUrl, bloksPage);
    }
}

async function loginToBloks(browser, user, url, bloksPage) {
    logger.log(user.email + ' - entering WAX Bloks');
    logger.log(user.wallet + ' - entering WAX Bloks');

    await bloksPage.goto(url);
    await bloksPage.waitForNavigation();

    await bloksPage.waitForSelector(bloksLoginSelector);
    await (await bloksPage.$(bloksLoginSelector)).click();

    await bloksPage.waitForSelector(connectWaxWalletSelector);
    await (await bloksPage.$(connectWaxWalletSelector)).click();
}

async function setLand(browser, bloksPage, user, config) {
    const cursor = createCursor(bloksPage);
    logger.log('wallet - ' + user.wallet)
    logger.log('land - ' + config.landId)
    await bloksPage.waitForSelector(bloksAwAccountSelector);
    await bloksPage.evaluate( () => document.querySelector('#top-container > div > div.ui.bottom.attached.active.tab.segment > div > div > div > div:nth-child(3) > div > div:nth-child(1) > div > div > input[type=text]').value = "")

    await write(bloksAwAccountSelector, user.wallet, cursor, bloksPage);

    await bloksPage.waitForSelector(bloksAwLandIdSelector);

    await write(bloksAwLandIdSelector, config.landId, cursor, bloksPage);

    await bloksPage.evaluate( () => document.querySelector('#push-transaction-btn').click());
    // await bloksPage.waitForSelector(bloksSetLandSubmitSelector);
    // await (await bloksPage.$(bloksSetLandSubmitSelector)).click();

}
