// //#region Imports
// // Library ----------------------------------------------------------------------------------
// import {Logger} from '../lib/logger';
// import {FilePaths} from '../lib/file-paths.js';
// import {PuppeteerWrapper} from '../lib/puppeteer-wrapper';
// import {createCursor} from 'ghost-cursor';
//
// const speakeasy = require('speakeasy');
//
//
// //#endregion
//
// //#region Setup - Dependency Injection-----------------------------------------------
// const _logger = new Logger();
// const _filePaths = new FilePaths(_logger, "puppeteer-electron-quickstart");
// const _puppeteerWrapper = new PuppeteerWrapper(_logger, _filePaths,
//     { headless: false, width:1920, height: 1080 });
//
// //#endregion
//
// //#region Main ----------------------------------------------------------------------
//
// // const waxWalletUrl = 'https://all-access.wax.io';

// // let page;
//
// let tlmAmount = 0;
//
// async function main() {
//     let waxWalletPage = await _puppeteerWrapper.newPage();
//     const cursor = createCursor(waxWalletPage);
//
//     await waxWalletPage.goto('https://all-access.wax.io', {waitUntil: 'networkidle2'});
//
//     let usernameSelector = 'input[name=userName]';
//     let waxWalletPasswordSelector = 'input[name=password]';
//     let waxWalletLoginButtonSelector = '.button-primary';
//     let waxWalletContinueButtonSelector = '.button';
//     let login = 'igordyachenkowaxer@gmail.com';
//     let password = 'Tolkien!12';
//
//     await waxWalletPage.waitForSelector(usernameSelector);
//
//     await write(usernameSelector, login, cursor, waxWalletPage);
//     await write(waxWalletPasswordSelector, password, cursor, waxWalletPage);
//
//     await (await waxWalletPage.$(waxWalletLoginButtonSelector)).click();
//
//     let twoFaSelector = 'input[name=code]';
//     let secretKey = speakeasy.totp({
//         secret: 'IFM43ZIL5MTKNGEF',
//         encoding: 'base32'
//     });
//
//     await waxWalletPage.waitForSelector(twoFaSelector);
//     await write(twoFaSelector, secretKey, cursor, waxWalletPage);
//     await (await waxWalletPage.$(waxWalletContinueButtonSelector)).click();
//     _logger.logInfo('Logged in account: ' + login);
//
//     await waxWalletPage.waitForNavigation();
//     let tlmSelector = '.token-name > small';
//     await waxWalletPage.waitForSelector(tlmSelector);
//     let tlmAmount = await waxWalletPage.evaluate(() => {
//         return Number.parseFloat(document.querySelector(
//             "#root > div > div.animation > div > div > div.tokens-card.content-card.p-3.mb-3 > div:nth-child(2) > div > div:nth-child(2) > div.token-name > small")
//             .innerText).toFixed(1);
//     });
//     _logger.logInfo('TLM amount: ' + tlmAmount);
//
//     let alcorePage = await _puppeteerWrapper.newPage();
//     await alcorePage.goto('https://wax.alcor.exchange/trade/tlm-alien.worlds_wax-eosio.token', {waitUntil: 'domcontentloaded'})
//         // .then(wait(5000))
//         .then(alcorePage.screenshot({path: 'test.png'}));
//     _logger.logInfo('Loaded Alcor');
//
//     // let connectWaxWalletSelector = '.inner';
//     // await alcorePage.waitForSelector(connectWaxWalletSelector);
//     // await cursor.move(connectWaxWalletSelector);
//     // await cursor.click(connectWaxWalletSelector);
//     // await page.click
//     // await alcorePage.evaluate(() => {
//     //     document.querySelectorAll('.inner')[6].click();
//     // });
//     // _logger.logInfo('Click connectWaxWalletSelector');
//
//     // let waxCloudWalletSelector = 'body > div.el-dialog__wrapper > div > div.el-dialog__body > div > div:nth-child(1) > div:nth-child(1) > button';
//     // await alcorePage.waitForSelector(waxCloudWalletSelector, {visible: true});
//     // await (await alcorePage.$x(waxCloudWalletSelector)).click();
//     // _logger.logInfo('Logged in Alcor');
//
//
//     let marketTradeSelector ='#tab-1';
//     await alcorePage.waitForSelector(marketTradeSelector);
//     await alcorePage.evaluate(() => {
//         document.querySelectorAll(marketTradeSelector)[1].click();
//     });
//
//     let sellSelector = '#pane-1 > div > div > div:nth-child(2) > form > div:nth-child(2) > div > div > input';
//     await alcorePage.waitForSelector(sellSelector);
//     await write(sellSelector, tlmAmount, cursor, alcorePage);
//
//
//     // await wait(10000);
//
// }
//
// (async () => {
//     try {
//         const chromeSet = await _puppeteerWrapper.setup();
//         if (!chromeSet) {
//             return;
//         }
//
//         await main();
//     } catch(e) {
//         _logger.logError('Thrown error:');
//         _logger.logError(e);
//     }
//     // } finally {
//     //     await _puppeteerWrapper.cleanup();
//     // }
//
//     _logger.logInfo('Done. Close window to exit');
//
//     await _logger.exportLogs(_filePaths.logsPath());
// })();
//
//
// async function wait(milliseconds) {
//     await new Promise(resolve => setTimeout(resolve, milliseconds));
// }
//
// async function write(selector, value, cursor, page) {
//     await cursor.move(selector);
//     await cursor.click(selector);
//     await page.type(selector, value, {delay: 50});
// }
