import {createCursor} from "ghost-cursor";
import speakeasy from "speakeasy";
import {clear, logger, wait, write} from "../lib/puppeteer-utils";
import {Account} from "./tlm/account-model";
import {pushNewAccount} from "./tlm/tlm-service";
import {waxBotConfig} from "../config/config-service";
import {
    accountNameSelector,
    cloudWalletContinueButtonSelector,
    cloudWalletPasswordSelector,
    cloudWalletSignInSelector,
    cloudWalletUrl,
    cloudWalletUsernameSelector,
    waxWalletContinueButtonSelector,
    waxWalletLoginButtonSelector,
    waxWalletPasswordSelector,
    waxWalletUrl,
    waxWalletUsernameSelector
} from "./wax-constants";

export async function loginToWax(browser, user) {
    logger.log(user.email + ' - WAX login');
    let waxWalletPage = await browser.newPage();
    await waxWalletPage.goto(waxWalletUrl, {waitUntil: 'networkidle2'});
    const cursor = createCursor(waxWalletPage);

    await waxWalletPage.waitForSelector(waxWalletUsernameSelector);
    await write(waxWalletUsernameSelector, user.email, cursor, waxWalletPage);
    await write(waxWalletPasswordSelector, user.password, cursor, waxWalletPage);
    await (await waxWalletPage.$(waxWalletLoginButtonSelector)).click();

    let twoFaSelector = 'input[name=code]';
    let secretKey = speakeasy.totp({
        secret: user.secretKey,
        encoding: 'base32'
    });

    await waxWalletPage.waitForSelector(twoFaSelector);
    await write(twoFaSelector, secretKey, cursor, waxWalletPage);
    await (await waxWalletPage.$(waxWalletContinueButtonSelector)).click();
    logger.logInfo(user.email + ' - logged in');

    await waxWalletPage.waitForNavigation();
}

export async function loginToCloudWallet(browser, user) {
    logger.log(user.email + ' - Cloud Wallet login');
    let cloudWalletPage = await browser.newPage();
    await cloudWalletPage.goto(cloudWalletUrl, {waitUntil: 'networkidle2'});

    const cursor = createCursor(cloudWalletPage);
    await cloudWalletPage.waitForSelector(cloudWalletUsernameSelector);

    await write(cloudWalletUsernameSelector, user.email, cursor, cloudWalletPage);
    await write(cloudWalletPasswordSelector, user.password, cursor, cloudWalletPage);
    await (await cloudWalletPage.$(cloudWalletSignInSelector)).click();

    let twoFaSelector = '#tfacode';
    await cloudWalletPage.waitForSelector(twoFaSelector);
    let secretKey = speakeasy.totp({
        secret: user.secretKey,
        encoding: 'base32'
    });
    await write(twoFaSelector, secretKey, cursor, cloudWalletPage);
    await (await cloudWalletPage.$(cloudWalletContinueButtonSelector)).click();
    await wait(2000);
    if(await cloudWalletPage.$('#root > div > div.diag-container > div.diag-container-div-1 > div > div > div.p-1.error-portion > div > ul > li') != null) {
        logger.logInfo(user.email + " - 2FA failed, retrying...");
        await clear(twoFaSelector, cursor, cloudWalletPage);
        secretKey = speakeasy.totp({
            secret: user.secretKey,
            encoding: 'base32'
        });
        await write(twoFaSelector, secretKey, cursor, cloudWalletPage);
        await (await cloudWalletPage.$(cloudWalletContinueButtonSelector)).click();
    }

    logger.logInfo(user.email + ' - logged in');
    if(waxBotConfig.updateTokens === "true") {
        logger.logInfo(user.email + " - updating token");
        await cloudWalletPage.waitForSelector(accountNameSelector);
        await wait(2000);
        let accountName = await cloudWalletPage.evaluate(() => {return document.querySelector('.avatar-div-container').innerText; });
        const cookies = await cloudWalletPage.cookies('https://www.mycloudwallet.com');
        const cookie = cookies.find(obj => obj.name === "session_token");
        const waxToken = cookie ? cookie.value : undefined;
        let account = new Account(accountName, waxToken);
        pushNewAccount(account);
    }
}