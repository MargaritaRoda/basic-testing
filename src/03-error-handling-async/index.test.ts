// Uncomment the code below and write your tests
import {
  resolveValue,
  throwError,
  throwCustomError,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const resolveResult = await resolveValue('Margo');
    expect(resolveResult).toBe('Margo');
  });
});

describe('throwError', () => {
  test('should throw error with provided message', async () => {
    const errorMessage = 'Oops!';
    await expect(async () => throwError(errorMessage)).rejects.toThrow(
      errorMessage,
    );
  });
  test('should throw error with default message if message is not provided', async () => {
    await expect(async () => throwError()).rejects.toThrow();
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    const customError = new MyAwesomeError();
    expect(async () => throwCustomError()).rejects.toThrow(customError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    const customError = new MyAwesomeError();
    await expect(async () => rejectCustomError()).rejects.toThrow(customError);
  });
});
