import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DynamicIcon } from '@/components/lucide';
import { cn } from '@/lib/utils';

interface ApiInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const ApiInput = ({ value, onChange, placeholder, className, ...props }: ApiInputProps) => {
  const [showKey, setShowKey] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handlePaste = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        onChange(text);
      })
      .catch(() => {
        toast.error('Failed to paste from clipboard');
      });
  };

  const toggleVisibility = () => {
    setShowKey(!showKey);
  };

  const clearInput = () => {
    onChange('');
  };

  return (
    <div
      className={cn(
        'flex w-full items-center rounded-md border bg-transparent px-2 py-1 text-base transition-colors outline-none',
        'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
        'border-input',
        props['aria-invalid'] ? 'ring-destructive/20 dark:ring-destructive/40 border-destructive' : '',
        className,
      )}
    >
      <input
        type={showKey ? 'text' : 'password'}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn('flex-1 border-none bg-transparent pr-24 shadow-none outline-none')}
        {...props}
      />
      <div className="-ml-20 flex items-center gap-1">
        {value && (
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={clearInput} tabIndex={-1} type="button">
            <DynamicIcon name="x" className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handlePaste} tabIndex={-1} type="button">
          <DynamicIcon name="clipboard" className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={toggleVisibility}
          tabIndex={-1}
          type="button"
        >
          {showKey ? (
            <DynamicIcon name="eye-off" className="h-4 w-4" />
          ) : (
            <DynamicIcon name="eye" className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ApiInput;
