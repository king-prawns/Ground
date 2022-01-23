import {createPineRunner} from '@king-prawns/pine-runner';
import client from './client';

// https://github.com/puppeteer/puppeteer#q-what-features-does-puppeteer-not-support
export const PATH_TO_CHROME =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const runner = createPineRunner({
  executablePath: PATH_TO_CHROME,
  headless: false
});

runner.run(client);
