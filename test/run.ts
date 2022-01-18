import puppeteer from 'puppeteer-core';
import {createPineRunner} from '@king-prawns/pine-runner';
import optimalNetworkConditions from './scenario/optimalNetworkConditions';
import client from './client';
import {PATH_TO_CHROME} from './const';
import badNetworkConditions from './scenario/badNetworkConditions';

const runner = createPineRunner({
  puppet: puppeteer,
  executablePath: PATH_TO_CHROME,
  headless: false
});

(async (): Promise<void> => {
  await runner.run(optimalNetworkConditions, client);
  await runner.run(badNetworkConditions, client);
})();
