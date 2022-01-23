import {IClient, Browser} from '@king-prawns/pine-runner';

const client = (): IClient => {
  return {
    open: async (browser: Browser): Promise<void> => {
      const page = await browser.newPage();
      await page.goto('http://localhost:8081');
    }
  };
};

export default client;
