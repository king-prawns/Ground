import puppeteer from 'puppeteer-core';
import {createPineRunner} from '@king-prawns/pine-runner';
import {PATH_TO_CHROME} from './const';
import client from './client';
import badNetworkConditions from './scenario/badNetworkConditions';
import optimalNetworkConditions from './scenario/optimalNetworkConditions';

const runner = createPineRunner({
  puppet: puppeteer,
  executablePath: PATH_TO_CHROME,
  headless: false
});

(async (): Promise<void> => {
  await runner.run(optimalNetworkConditions, client);
  await runner.run(badNetworkConditions, client);
})();
