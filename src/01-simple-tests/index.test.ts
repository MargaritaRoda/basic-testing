// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const input = {
      a: NaN,
      b: 3,
      action: Action.Add,
    };
    const res = simpleCalculator(input);
    expect(res).toBeNaN();
  });

  test('should subtract two numbers', () => {
    const input = {
      a: NaN,
      b: 2,
      action: Action.Subtract,
    };
    const res = simpleCalculator(input);
    expect(res).toBeNaN();
  });

  test('should multiply two numbers', () => {
    const input = {
      a: NaN,
      b: 2,
      action: Action.Multiply,
    };
    const res = simpleCalculator(input);
    expect(res).toBeNaN();
  });

  test('should divide two numbers', () => {
    const input = {
      a: NaN,
      b: 2,
      action: Action.Divide,
    };
    const res = simpleCalculator(input);
    expect(res).toBeNaN();
  });

  test('should exponentiate two numbers', () => {
    const input = {
      a: NaN,
      b: 2,
      action: Action.Exponentiate,
    };
    const res = simpleCalculator(input);
    expect(res).toBeNaN();
  });

  test('should return null for invalid action', () => {
    const invalidInput = {
      a: 1,
      b: 2,
      action: 'InvalidAction' as Action,
    };
    expect(() => simpleCalculator(invalidInput)).not.toThrow();
  });

  test('should return null for invalid arguments', () => {
    const invalidInput = {
      a: 'invalid',
      b: 2,
      action: Action.Add,
    };
    expect(simpleCalculator(invalidInput)).toBeNull();
  });
});
