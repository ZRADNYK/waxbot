import puppeteer from 'puppeteer-core';


/**
 * chromePath:  the path of the chrome executable in our pc
 * setup() :    initialize Puppeteer
 * cleanup():   clearnup Puppeteer
 * browser:     global Puppeteer browser instance
 * newPage():   get new page with default user agent and dimensions
 */

/**
 * options: {headless, width, height}
 */
export class PuppeteerWrapper {
    constructor(logger, filePaths, options) {
        this._logger = logger;
        this._filePaths = filePaths;
        this._options = options || { headless: false, slowMo: 250, };

        this.browser = undefined;
    }

    async setup() {
        let args = [ '--enable-automation', '--no-sandbox', '--start-maximized'];

        this.browser = await puppeteer.launch({
            headless: false,
            executablePath: 'node_modules/puppeteer/.local-chromium/win64-970485/chrome-win/chrome.exe',
            defaultViewport: null,
            args
        });

        this.browser.on('targetcreated', async target => {
            if (target.url().includes('tampermonkey.net') || target.url().includes('chrome-extension')) {
                try {
                    const page = await target.page();
                    await page.close();
                } catch (e) {}
            }
        });

        return this.browser;
    }

    async cleanup() {
        if (this.browser) await this.browser.close();
    }

    async newPage() {
        const page = await this.browser.newPage();
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36');

        if (this._options.width) {
            await page._client.send('Emulation.clearDeviceMetricsOverride');
        }
        return page;
    }
}
