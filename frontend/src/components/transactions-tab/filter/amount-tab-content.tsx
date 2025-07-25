import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import FilterTabHeader from './filter-tab-header';
import { amountOperators, defaultFilterValues, type AmountOperator, type Filter } from './types';
import { Button } from '@/components/ui/button';

interface AmountTabContentProps {
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
}

const AmountTabContent = ({ filters, setFilters }: AmountTabContentProps) => {
  const handleOperatorChange = (operator: AmountOperator) => {
    setFilters((prev) => ({
      ...prev,
      amount: { ...prev.amount, operator },
    }));
  };

  return (
    <div className="flex h-full flex-grow flex-col gap-2">
      <div className="flex flex-col gap-2">
        <FilterTabHeader
          title="Amount"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  amount: defaultFilterValues.amount,
                }))
              }
            >
              Clear
            </Button>
          }
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-1">
        <div className="flex flex-col gap-3">
          <Label htmlFor="amount-operator" className="px-1">
            Condition
          </Label>
          <Select
            value={filters.amount.operator}
            onValueChange={(value) => handleOperatorChange(value as AmountOperator)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {amountOperators.map((operator) => (
                <SelectItem key={operator.value} value={operator.value}>
                  {operator.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="amount-value1" className="px-1">
            {filters.amount.operator === ('between' as keyof typeof amountOperators) ? 'Minimum Amount' : 'Amount'}
          </Label>
          <Input
            id="amount-value1"
            type="number"
            placeholder="0.00"
            value={filters.amount.value1}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                amount: { ...prev.amount, value1: e.target.value },
              }))
            }
            className="mt-1"
          />
        </div>
        {filters.amount.operator === 'between' && (
          <div className="flex flex-col gap-3">
            <Label htmlFor="amount-value2" className="px-1">
              Maximum Amount
            </Label>
            <Input
              id="amount-value2"
              type="number"
              placeholder="0.00"
              value={filters.amount.value2 || ''}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  amount: { ...prev.amount, value2: e.target.value },
                }))
              }
              className="mt-1"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AmountTabContent;
