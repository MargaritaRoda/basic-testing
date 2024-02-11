// Uncomment the code below and write your tests

import {
  doStuffByInterval,
  doStuffByTimeout,
  readFileAsynchronously,
} from './index';

import { join } from 'path';
import fs, { existsSync } from 'fs';
import * as fsPromises from 'fs/promises';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 500;
    doStuffByTimeout(callback, timeout);
    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 500;
    doStuffByTimeout(callback, timeout);
    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 500;
    doStuffByTimeout(callback, interval);
    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 500;
    doStuffByInterval(callback, interval);
    jest.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(6);
  });
});

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFile: jest.fn().mockImplementation((_path, callback) => {
    callback(null, 'Mocked file content');
  }),
}));

jest.mock('fs/promises');
jest.mock('path', () => ({
  join: jest.fn(),
}));
describe('readFileAsynchronously', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should call join with pathToFile', async () => {
    const pathToFile = 'example.txt';

    // Mock existsSync to return true, indicating file exists
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    (fsPromises.readFile as jest.Mock).mockResolvedValue('File content');
    await readFileAsynchronously(pathToFile);
    expect(join).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    // Mock existsSync to return false, indicating file does not exist
    (existsSync as jest.Mock).mockReturnValue(false);

    // Call the function with a non-existent file
    const fileContent = await readFileAsynchronously('test.txt');
    expect(fileContent).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const fileContent = 'This is the content of the file.';
    const pathToFile = 'example.txt';

    // Mocking the behavior of existsSync to return true
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    // Mocking the behavior of readFile to return fileContent
    (fsPromises.readFile as jest.Mock).mockResolvedValue(fileContent);

    const content = await readFileAsynchronously(pathToFile);
    expect(content).toEqual(fileContent);

    // Verify that fs.existsSync is called with the correct path
    expect(fs.existsSync).toHaveBeenCalledWith(join(__dirname, pathToFile));

    // Verify that fs.readFile is called with the correct path
    expect(fsPromises.readFile).toHaveBeenCalledWith(
      join(__dirname, pathToFile),
    );
  });
});
