// Uncomment the code below and write your tests
import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';
import lodash from 'lodash';

describe('BankAccount', () => {
  let bankAccount: BankAccount;
  let bankAccountRecipient: BankAccount;

  beforeEach(() => {
    bankAccount = getBankAccount(100);
    bankAccountRecipient = getBankAccount(20);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should create account with initial balance', () => {
    expect(bankAccount.getBalance()).toEqual(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const withdrawSpy = jest.spyOn(bankAccount, 'withdraw');
    const withdrawAmount = 150;
    expect(() => {
      bankAccount.withdraw(withdrawAmount);
    }).toThrowError(InsufficientFundsError);
    expect(withdrawSpy).toHaveBeenCalledWith(withdrawAmount);
  });

  test('should throw error when transferring more than balance', () => {
    const transferSpy: jest.SpyInstance = jest.spyOn(bankAccount, 'transfer');
    const transferAmount = 150;

    expect(() => {
      bankAccount.transfer(transferAmount, bankAccountRecipient);
    }).toThrowError(InsufficientFundsError);
    expect(transferSpy).toHaveBeenCalledWith(
      transferAmount,
      bankAccountRecipient,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const transferSpy: jest.SpyInstance = jest.spyOn(bankAccount, 'transfer');
    const transferAmount = 10;

    expect(() => {
      bankAccount.transfer(transferAmount, bankAccount);
    }).toThrowError(TransferFailedError);
    expect(transferSpy).toHaveBeenCalledWith(transferAmount, bankAccount);
  });

  test('should deposit money', () => {
    const depositSpy: jest.SpyInstance = jest.spyOn(bankAccount, 'deposit');
    bankAccount.deposit(50);
    expect(depositSpy).toHaveBeenCalledWith(50);
    expect(bankAccount.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    const withdrawSpy = jest.spyOn(bankAccount, 'withdraw');
    bankAccount.withdraw(20);
    expect(withdrawSpy).toHaveBeenCalledWith(20);
    expect(bankAccount.getBalance()).toBe(80);
  });

  test('should transfer money', () => {
    const transferSpy: jest.SpyInstance = jest.spyOn(bankAccount, 'transfer');
    const withdrawSpy: jest.SpyInstance = jest.spyOn(bankAccount, 'withdraw');
    const depositSpy: jest.SpyInstance = jest.spyOn(
      bankAccountRecipient,
      'deposit',
    );
    bankAccount.transfer(20, bankAccountRecipient);

    expect(transferSpy).toHaveBeenCalledWith(20, bankAccountRecipient);
    expect(withdrawSpy).toHaveBeenCalledWith(20);
    expect(depositSpy).toHaveBeenCalledWith(20);
    expect(bankAccount.getBalance()).toBe(80);
    expect(bankAccountRecipient.getBalance()).toBe(40);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const randomSpy = jest.spyOn(lodash, 'random');
    randomSpy.mockReturnValue(1); // законстатируем возвращаемое значение
    const balance = await bankAccount.fetchBalance();
    expect(typeof balance).toBe('number');
    randomSpy.mockRestore();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const fetchBalanceSpy: jest.SpyInstance = jest.spyOn(
      bankAccount,
      'fetchBalance',
    );
    fetchBalanceSpy.mockResolvedValue(555);
    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toBe(555);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const fetchBalanceSpy: jest.SpyInstance = jest.spyOn(
      bankAccount,
      'fetchBalance',
    );
    fetchBalanceSpy.mockReturnValue(Promise.resolve(null));
    await expect(bankAccount.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );
  });
});
