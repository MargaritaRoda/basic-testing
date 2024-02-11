// Uncomment the code below and write your tests
import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';
jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  const baseURL = 'https://jsonplaceholder.typicode.com';
  const relativeUrl = '/posts/1';
  jest.useFakeTimers();

  afterEach(() => {
    jest.advanceTimersByTime(5001);
    jest.restoreAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const axiosSpy = jest.spyOn(axios, 'create').mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: 'Mocked data' }),
    } as unknown as AxiosInstance);
    await throttledGetDataFromApi(relativeUrl);
    expect(axiosSpy).toHaveBeenCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    const getMock = jest.fn().mockReturnValue({ data: 'test data' });
    jest.spyOn(axios, 'create').mockReturnValue({
      get: getMock,
    } as unknown as AxiosInstance);
    await throttledGetDataFromApi(relativeUrl);
    expect(getMock).toHaveBeenCalledWith(relativeUrl);
  });
  test('should return response data', async () => {
    const axiosInstance = {
      get: jest.fn().mockResolvedValue({ data: 'Mocked data' }),
    } as unknown as AxiosInstance; // Cast the mocked Axios instance to AxiosInstance
    jest.spyOn(axios, 'create').mockReturnValue(axiosInstance);

    // Call throttledGetDataFromApi with a relative URL
    const responseData = await throttledGetDataFromApi(relativeUrl);

    // Assert that the returned value matches the expected response data
    expect(responseData).toEqual('Mocked data');
  });
});
