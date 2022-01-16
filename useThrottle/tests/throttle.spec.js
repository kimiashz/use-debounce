/* global describe, it, jest, beforeEach, expect */

import throttle from '../throttle';

jest.useFakeTimers();

describe('throttle', () => {
  let func;
  let debouncedFunc;
  const runner = (input, options, wait = 3) => {
    const timer = (new Date()).getTime();
    const calls = [];

    const callback = (char) => {
      calls.push(`${char}:${(new Date()).getTime() - timer}`);
    };

    const throttled = throttle(callback, wait, options);

    input.forEach((call) => {
      const [char, time] = call.split(':');
      setTimeout(() => {
        throttled(char);
      }, time);
    });

    jest.advanceTimersByTime(100);
    return calls;
  };

  beforeEach(() => {
    func = jest.fn();
  });

  it('1 : throttle', () => {
    expect(runner(['A:0'])).toEqual(['A:0']);
  });

  it('2 : throttle', () => {
    expect(runner(['A:0', 'B:1'])).toEqual(['A:0', 'B:3']);
  });

  it('3 : throttle', () => {
    expect(runner(['A:0', 'B:1', 'C:2'])).toEqual(['A:0', 'C:3']);
  });

  it('4 : throttle', () => {
    expect(runner(['A:0', 'B:1', 'C:2', 'D:3'])).toEqual(['A:0', 'D:3']);
  });

  it('5 : throttle { leading: true, trailing: true }', () => {
    expect(runner(['A:0'], { leading: true, trailing: true })).toEqual(['A:0']);
  });

  it('6 : throttle { leading: true, trailing: true }', () => {
    expect(runner(['A:0', 'B:1'], { leading: true, trailing: true })).toEqual(['A:0', 'B:3']);
  });

  it('7 : throttle { leading: true, trailing: false }', () => {
    expect(runner(['A:0', 'B:1'], { leading: true, trailing: false })).toEqual(['A:0']);
  });

  it('8 : throttle { leading: false, trailing: true }', () => {
    expect(runner(['A:0', 'B:1'], { leading: false, trailing: true }))
      .toEqual(['B:3']);
  });

  it('9 : throttle { leading: false, trailing: true }', () => {
    expect(runner(['A:0', 'B:1'], { leading: false, trailing: true }))
      .toEqual(['B:3']);
  });

  it('10 : throttle { leading: true, trailing: true }', () => {
    expect(runner(['A:0', 'B:1'], { leading: false, trailing: false }))
      .toEqual([]);
  });

  it('11 : throttle { leading: true, trailing: true }', () => {
    expect(runner(['A:1', 'B:2', 'C:3', 'D:5', 'E:11', 'F:13', 'G:14'], { leading: true, trailing: true }))
      .toEqual(['A:1', 'C:4', 'D:7', 'E:11', 'G:14']);
  });

  it('12 : throttle { leading: true, trailing: false }', () => {
    expect(runner(['A:1', 'B:2', 'C:3', 'D:5', 'E:11', 'F:13', 'G:14'], { leading: true, trailing: false }))
      .toEqual(['A:1', 'D:5', 'E:11']);
  });

  it('13 : throttle { leading: true, trailing: false }', () => {
    expect(runner(['A:1', 'B:2', 'C:3', 'D:5', 'E:11', 'F:13', 'G:14'], { leading: false, trailing: true }))
      .toEqual(['C:4', 'D:7', 'G:14']);
  });

  it('14 : throttle : execute twice', () => {
    debouncedFunc = throttle(func, 100);
    for (let i = 0; i < 100; i++) debouncedFunc(func, 100);
    jest.runAllTimers();
    expect(func).toBeCalledTimes(2);
  });

  it('15 : throttle { leading: true, trailing: false } : execute just once', () => {
    debouncedFunc = throttle(func, 100, { leading: true, trailing: false });
    for (let i = 0; i < 100; i++) debouncedFunc();
    jest.runAllTimers();
    expect(func).toBeCalledTimes(1);
  });
});
