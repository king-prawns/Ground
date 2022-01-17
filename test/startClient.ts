import puppeteer from 'puppeteer-core';

// https://github.com/puppeteer/puppeteer#q-what-features-does-puppeteer-not-support
const PATH_TO_CHROME =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const startClient = async (): Promise<void> => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: PATH_TO_CHROME
  });
  const page = await browser.newPage();
  page.goto('http://localhost:8081');
};

export default startClient;
