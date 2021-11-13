import {SinonSpy, spy} from 'sinon';
import hello from './hello';

interface ITestContext {
  consoleLogSpy: SinonSpy<
    Parameters<typeof console['log']>,
    ReturnType<typeof console['log']>
  >;
}

describe('Logger', () => {
  let context: ITestContext;

  beforeEach(() => {
    context = {
      consoleLogSpy: spy(console, 'log')
    };
  });

  afterEach(() => {
    context.consoleLogSpy.restore();
  });

  describe('hello()', () => {
    it('should call `console.log`', () => {
      hello();

      expect(context.consoleLogSpy.getCall(0).args[0]).toBe('Hello world!');
    });
  });
});
