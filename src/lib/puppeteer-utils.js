import {Logger} from "./logger";
import {FilePaths} from "./file-paths";
import {PuppeteerWrapper} from "./puppeteer-wrapper";

export const logger = new Logger();
export const filePaths = new FilePaths(logger, "waxbot");
export const puppeteerWrapper = new PuppeteerWrapper(logger, filePaths,
    { headless: false, width:1920, height: 1080 });


export async function wait(milliseconds) {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
}

export async function write(selector, value, cursor, page) {
    await cursor.move(selector);
    await cursor.click(selector);
    await page.type(selector, value, {delay: 10});
}

export async function clear(selector, cursor, page) {
    await cursor.move(selector);
    await cursor.click(selector);
    for (let i = 0; i < 6; i++) {
        await page.keyboard.press('Backspace');
    }
}


export async function createBrowser() {
    let chromeSet;
    try {
        chromeSet = await puppeteerWrapper.setup();
    } catch(e) {
        logger.logError('Thrown error:');
        logger.logError(e);
    }
    return chromeSet;
}

