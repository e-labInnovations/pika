import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEffect, useRef, useState } from 'react';
import { DynamicIcon } from '@/components/lucide';

interface ColorPickerProps {
  color: string;
  setColor: (color: string) => void;
  label?: string;
}

const ColorPicker = ({ color, setColor, label = '' }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(color);
  const [hexError, setHexError] = useState('');
  const popupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setHexInput(color);
  }, [color]);

  const suggestedColors = [
    // Row 1 - Bright colors
    ['#3B82F6', '#06B6D4', '#10B981', '#84CC16', '#EAB308', '#F97316', '#EF4444', '#EC4899'],
    // Row 2 - Lighter variants
    ['#93C5FD', '#67E8F9', '#6EE7B7', '#BEF264', '#FDE047', '#FDBA74', '#FCA5A5', '#F9A8D4'],
    // Row 3 - Medium variants
    ['#1D4ED8', '#0891B2', '#059669', '#65A30D', '#CA8A04', '#EA580C', '#DC2626', '#DB2777'],
    // Row 4 - Dark variants
    ['#1E3A8A', '#164E63', '#064E3B', '#365314', '#92400E', '#9A3412', '#991B1B', '#BE185D'],
    // Gray scale colors
    ['#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B', '#475569', '#334155'],
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleColorSelect = (newColor: string) => {
    setColor(newColor);
    setHexInput(newColor);
    setHexError('');
    setIsOpen(false);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHexInput(value);

    // Validate 6-digit hex color with #
    const hexRegex = /^#[A-Fa-f0-9]{6}$/;
    if (hexRegex.test(value)) {
      setColor(value);
      setHexError('');
    } else if (value.length === 7) {
      setHexError('Invalid hex color format');
    } else {
      setHexError('');
    }
  };

  const handleHexInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const hexRegex = /^#[A-Fa-f0-9]{6}$/;
      if (hexRegex.test(hexInput)) {
        setColor(hexInput);
        setHexError('');
        setIsOpen(false);
      } else {
        setHexError('Invalid color');
      }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:focus:border-blue-400 dark:focus:ring-blue-400"
        >
          <div className="flex items-center space-x-2">
            <div
              className="h-4 w-4 rounded border border-slate-200 dark:border-slate-600"
              style={{ backgroundColor: color }}
            />
            <span className="text-slate-700 dark:text-slate-200">{label}</span>
          </div>
          <DynamicIcon name="chevron-down" className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="flex w-auto flex-col gap-4 overflow-hidden p-2 dark:border-slate-700 dark:bg-slate-800"
        align="start"
      >
        {/* Suggested Colors */}
        <div className="grid grid-cols-8 gap-1">
          {suggestedColors.map((row, rowIndex) =>
            row.map((suggestedColor, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleColorSelect(suggestedColor)}
                className={`h-5 w-5 rounded border-1 transition-transform hover:scale-110 hover:cursor-pointer ${
                  color === suggestedColor
                    ? 'border-slate-800 dark:border-slate-200'
                    : 'border-slate-200 dark:border-slate-600'
                }`}
                style={{ backgroundColor: suggestedColor }}
                title={suggestedColor}
              />
            )),
          )}
        </div>

        {/* Hex Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={hexInput}
              onChange={handleHexInputChange}
              onKeyDown={handleHexInputKeyDown}
              className={`flex-1 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 ${
                hexError
                  ? 'border-red-300 focus:border-red-500 dark:border-red-500 dark:focus:border-red-400'
                  : 'border-slate-200 focus:border-blue-500 dark:border-slate-600 dark:focus:border-blue-400'
              }`}
              placeholder="#000000"
            />
            <div
              className="h-8 w-8 flex-shrink-0 rounded-full border border-slate-200 dark:border-slate-600"
              style={{ backgroundColor: color }}
            />
          </div>
          {hexError && (
            <div className="flex items-center gap-1">
              <DynamicIcon name="info" className="h-4 w-4 text-red-600 dark:text-red-400" />
              <p className="text-xs text-red-600 dark:text-red-400">{hexError}</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
