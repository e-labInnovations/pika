import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { currencyUtils } from '@/lib/currency-utils';

interface MoneyInputProps {
  value: number | string;
  onChange: (value: number) => void;
  id: string;
  labelText?: string;
  placeholder?: string;
  currency?: string;
  className?: string;
}

const MoneyInput = ({ value, onChange, id, labelText, placeholder, className, ...props }: MoneyInputProps) => {
  const { user } = useAuth();
  const [inputString, setInputString] = useState(value === 0 ? '' : value.toString());
  const [inputFocused, setInputFocused] = useState(false);
  const decimalPlaces = currencyUtils.getCurrencyByCode(user?.settings.currency || 'INR').decimal_digits;

  useEffect(() => {
    setInputString(value === 0 ? '' : value.toString());
  }, [value]);

  const hasMoreThanDecimalPlaces = (numberInputString: string) => {
    const length = numberInputString.length;
    const decimalIndex = numberInputString.indexOf('.');
    if (decimalIndex !== -1 && decimalIndex === length - (decimalPlaces + 2)) {
      return true;
    }
    return false;
  };

  const isNegativeNumber = (numberString: string) => {
    return numberString.charAt(0) === '-' ? true : false;
  };

  const removeLeadingNegativeSign = (numberString: string) => {
    if (numberString.length > 0) {
      return numberString.substring(1);
    }
  };

  const removeLeadingZeroChars = (numberString: string) => {
    if (numberString !== '') {
      return parseFloat(numberString).toFixed(decimalPlaces).toString();
    }
  };

  const updateInputString = (numberInputString: string) => {
    // Don't update state if more than 2 decimal places specified.
    if (hasMoreThanDecimalPlaces(numberInputString)) {
      return;
    }
    // Restrict number input to positive values only
    if (isNegativeNumber(numberInputString)) {
      const positiveNumStr = removeLeadingNegativeSign(numberInputString);
      setInputString(positiveNumStr as string);
      return;
    }
    setInputString(numberInputString);
    onChange(Number(numberInputString));
  };

  const displayTextInput = () => {
    if (inputString !== '') {
      const prevInput = inputString;
      const currentInput = removeLeadingZeroChars(inputString);
      if (prevInput !== currentInput) {
        updateInputString(currentInput as string);
      }
    }
    setInputFocused(false);
  };

  const displayNumberInput = () => {
    setInputFocused(true);
  };

  const getValueToDisplay = () => {
    // display number string as it's being entered into the number input
    if (inputFocused) {
      return inputString;
    }
    // Else return the formatted number string to display in the text input
    // that will be rendered when the number input loses focus.
    if (inputString !== '') {
      const formatteNumStr = currencyUtils.formatAmount(Number(inputString), user?.settings.currency || 'INR');
      return formatteNumStr;
    }
    return inputString;
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{labelText}</Label>
      <Input
        className={cn('py-3', className)}
        type={inputFocused ? 'number' : 'text'}
        name={id}
        id={id}
        min="0"
        step="any"
        placeholder={placeholder ?? currencyUtils.formatAmount(0, user?.settings.currency || 'INR')}
        value={getValueToDisplay()}
        onFocus={() => {
          displayNumberInput();
        }}
        onBlur={() => {
          displayTextInput();
        }}
        onChange={(e) => {
          updateInputString(e.target.value);
        }}
        {...props}
      />
    </div>
  );
};

export default MoneyInput;
