import puppeteer from 'puppeteer-core';
import {PATH_TO_CHROME} from './const';
import {IClient} from '@king-prawns/pine-runner';

const client = async (): Promise<IClient> => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: PATH_TO_CHROME
  });

  return {
    open: async (): Promise<void> => {
      const page = await browser.newPage();
      await page.goto('http://localhost:8081');
    },
    close: async (): Promise<void> => {
      await browser.close();
    }
  };
};

export default client;
