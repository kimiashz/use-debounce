/* global describe, it, jest, beforeEach, expect */

import debounce from '../debounce';

jest.useFakeTimers();

describe('debounce', () => {
  let func;
  let debouncedFunc;
  const runner = (input, options, wait = 3) => {
    const timer = (new Date()).getTime();
    const calls = [];

    const callback = (char) => {
      calls.push(`${char}:${(new Date()).getTime() - timer}`);
    };

    const debounced = debounce(callback, wait, options);

    input.forEach((call) => {
      const [char, time] = call.split(':');
      setTimeout(() => {
        debounced(char);
      }, time);
    });

    jest.advanceTimersByTime(100);
    return calls;
  };

  beforeEach(() => {
    func = jest.fn();
  });

  it('1 : debounce', () => {
    expect(runner(['A:0'])).toEqual(['A:3']);
  });

  it('2 : debounce', () => {
    expect(runner(['A:0', 'B:1'])).toEqual(['B:4']);
  });

  it('3 : debounce', () => {
    expect(runner(['A:0', 'B:1', 'C:2'])).toEqual(['C:5']);
  });

  it('4 : debounce', () => {
    expect(runner(['A:0', 'B:1', 'C:2', 'D:5'])).toEqual(['D:8']);
  });

  it('5 : debounce { leading: true, trailing: true }', () => {
    expect(runner(['A:0'], { leading: true, trailing: true })).toEqual(['A:0']);
  });

  it('6 : debounce { leading: true, trailing: false }', () => {
    expect(runner(['A:0'], { leading: true, trailing: false })).toEqual(['A:0']);
  });

  it('7 : debounce { leading: false, trailing: false }', () => {
    expect(runner(['A:0'], { leading: false, trailing: false })).toEqual([]);
  });

  it('8 : debounce { leading: false, trailing: true }', () => {
    expect(runner(['A:0', 'B:1'], { leading: false, trailing: true })).toEqual(['B:4']);
  });

  it('9 : debounce { leading: true, trailing: true }', () => {
    expect(runner(['A:0', 'B:1'], { leading: true, trailing: true })).toEqual(['A:0', 'B:4']);
  });

  it('10 : debounce { leading: true, trailing: false }', () => {
    expect(runner(['A:0', 'B:1'], { leading: true, trailing: false })).toEqual(['A:0']);
  });

  it('11 : debounce { leading: true, trailing: false }', () => {
    expect(runner(['A:1', 'B:2', 'C:3', 'D:5', 'E:11', 'F:13', 'G:14'], { leading: false, trailing: true }))
      .toEqual(['D:8', 'G:17']);
  });

  it('12 : debounce { leading: true, trailing: false }', () => {
    expect(runner(['A:1', 'B:2', 'C:3', 'D:5', 'E:11', 'F:13', 'G:14'], { leading: true, trailing: true }))
      .toEqual(['A:1', 'D:8', 'E:11', 'G:17']);
  });

  it('13 : debounce { leading: true, trailing: false }', () => {
    expect(runner(['A:1', 'B:2', 'C:3', 'D:5', 'E:11', 'F:13', 'G:14'], { leading: true, trailing: false }))
      .toEqual(['A:1', 'E:11']);
  });

  it('14 : debounce : execute just once', () => {
    debouncedFunc = debounce(func, 100);
    for (let i = 0; i < 100; i++) debouncedFunc(func, 100);
    jest.runAllTimers();
    expect(func).toBeCalledTimes(1);
  });

  it('15 : debounce { leading: true, trailing: true } : execute twice', () => {
    debouncedFunc = debounce(func, 100, { leading: true, trailing: true });
    for (let i = 0; i < 100; i++) debouncedFunc();
    jest.runAllTimers();
    expect(func).toBeCalledTimes(2);
  });
});
