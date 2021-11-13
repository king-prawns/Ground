import hello from './hello';

describe('hello', () => {
  it('should call `console.log`', () => {
    expect(hello()).toBe('Hello world!');
  });
});
