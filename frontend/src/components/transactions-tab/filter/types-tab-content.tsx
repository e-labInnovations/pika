import { CircleCheck } from 'lucide-react';
import FilterTabHeader from './filter-tab-header';
import { useState } from 'react';
import SearchItem from './search-item';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { type Filter } from './types';
import TransactionUtils, { type TransactionType } from '@/lib/transaction-utils';
import { IconRenderer } from '@/components/icon-renderer';

interface TypesTabContentProps {
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
}

const TypesTabContent = ({ filters, setFilters }: TypesTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter functions for search within tabs
  const getFilteredTypes = () => {
    return TransactionUtils.types.filter((type) => type.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  // Select/Unselect all functions
  const handleSelectAllTypes = () => {
    const allSelected = getFilteredTypes().length === filters.types.length;
    setFilters((prev: Filter) => ({
      ...prev,
      types: allSelected ? [] : getFilteredTypes().map((type) => type.id),
    }));
  };

  const handleTypeToggle = (typeId: TransactionType) => {
    setFilters((prev: Filter) => ({
      ...prev,
      types: prev.types.includes(typeId) ? prev.types.filter((id: string) => id !== typeId) : [...prev.types, typeId],
    }));
  };

  return (
    <div className="flex h-full flex-grow flex-col gap-2">
      <div className="flex flex-col gap-2">
        <FilterTabHeader
          title="Transaction Types"
          handleSelectAll={handleSelectAllTypes}
          isAllSelected={
            filters.types.length === getFilteredTypes().length
              ? true
              : filters.types.length > 0
                ? 'indeterminate'
                : false
          }
        />

        <SearchItem searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search types..." />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-1">
        {getFilteredTypes().map((type) => {
          return (
            <CheckboxPrimitive.Root
              key={type.id}
              checked={filters.types.includes(type.id)}
              onCheckedChange={() => handleTypeToggle(type.id)}
              className="ring-border text-muted-foreground data-[state=checked]:ring-primary data-[state=checked]:text-primary hover:bg-accent/50 relative rounded-lg border border-slate-200 px-4 py-3 text-start ring-[0.25px] data-[state=checked]:ring-[1.5px] dark:border-slate-700"
            >
              <div className="flex items-center space-x-3">
                <IconRenderer iconName={type.icon} size="md" className={`${type.bgColor} ${type.color}`} />
                <div className="flex-1">
                  <p className="font-medium">{type.name}</p>
                  <p className="text-muted-foreground text-sm">{type.description}</p>
                </div>
              </div>
              <CheckboxPrimitive.Indicator className="absolute top-2 right-2">
                <CircleCheck className="fill-primary text-primary-foreground" />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
          );
        })}
      </div>
    </div>
  );
};

export default TypesTabContent;
