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

  formatAmount(amount: string | number, currencyCode: CurrencyCode | undefined) {
    if (!currencyCode) return `${amount}`;
    const currency = this.getCurrencyByCode(currencyCode);
    return `${currency.symbol}${Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: currency.decimal_digits,
      maximumFractionDigits: currency.decimal_digits,
    })}`;
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
