import { currencies, type Currency } from '@/data/currencies';

type CurrencyCode = keyof typeof currencies;

class CurrencyUtils {
  currencies: Record<CurrencyCode, Currency>;
  constructor() {
    this.currencies = currencies;
  }

  getCurrencyByCode(code: CurrencyCode) {
    return this.currencies[code];
  }

  /**
   * Format an amount with a currency symbol and decimal places
   * @param amount - The amount to format
   * @param currencyCode - The currency code
   * @param options - The options to format the amount
   * @returns The formatted amount
   */
  formatAmount(
    amount: string | number,
    currencyCode: CurrencyCode | undefined,
    options?: {
      showSymbol?: boolean;
      showDecimal?: boolean;
      showNegative?: boolean;
      showEmptyForZero?: boolean;
    },
  ) {
    if (!currencyCode) return `${amount}`;
    const currency = this.getCurrencyByCode(currencyCode);
    const _options = {
      showSymbol: true,
      showDecimal: true,
      showNegative: true,
      showEmptyForZero: false,
      ...(options ?? {}),
    };
    const minimumFractionDigits = _options.showDecimal ? currency.decimal_digits : 0;
    const maximumFractionDigits = _options.showDecimal ? currency.decimal_digits : 0;
    let formattedAmount = Number(amount).toLocaleString('en-US', {
      minimumFractionDigits,
      maximumFractionDigits,
    });
    if (!_options.showNegative) formattedAmount = formattedAmount.replace('-', '');
    if (_options.showEmptyForZero && formattedAmount === '0') return '';
    return `${_options.showSymbol ? currency.symbol : ''}${formattedAmount}`;
  }

  formatBalance(balance: number, currencyCode: CurrencyCode | undefined) {
    if (balance === 0) return 'Even';
    return this.formatAmount(Math.abs(balance), currencyCode);
  }

  getCurrencies() {
    return Object.values(this.currencies).sort((a, b) => a.code.localeCompare(b.code));
  }

  getCurrencySymbol(currencyCode: CurrencyCode | undefined) {
    if (!currencyCode) return '$';
    const currency = this.getCurrencyByCode(currencyCode);
    return currency.symbol;
  }
}

export const currencyUtils = new CurrencyUtils();
export { type CurrencyCode, type Currency };
