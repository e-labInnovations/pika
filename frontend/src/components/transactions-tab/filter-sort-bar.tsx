import { amountOperators, defaultFilterValues, type Filter, type FilterTab } from './filter/types';
import FilterChip from './filter/filter-chip';
import { Badge } from '../ui/badge';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '../ui/button';
import { accounts, categories, people, tags } from '@/data/dummy-data';
import { useEffect, useState } from 'react';
import { defaultSort, type Sort, sortOptions } from './sort/types';
import TransactionUtils from '@/lib/transaction-utils';

interface FilterSortBarProps {
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
  sort: Sort;
  onSortClick: () => void;
  onFilterClick: (action: 'open' | 'remove', type: FilterTab, value: string) => void;
}

const FilterSortBar = ({ filters, setFilters, sort, onSortClick, onFilterClick }: FilterSortBarProps) => {
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  useEffect(() => {
    setActiveFilterCount(
      Object.keys(filters).filter((key) => {
        const value = filters[key as keyof Filter];
        return Array.isArray(value) && value.length > 0;
      }).length,
    );
    console.log('activeFilterCount', activeFilterCount);
  }, [activeFilterCount, filters]);

  const getSortLabel = () => {
    const sortOption = sortOptions.find((opt) => opt.value === sort.field);
    const directionLabel = sort.direction === 'asc' ? 'Asc' : 'Des';
    return `${sortOption?.label} (${directionLabel})`;
  };

  const clearFilters = () => {
    setFilters(defaultFilterValues);
  };

  const getCategory = (categoryId: string) => {
    let category = null;
    for (const parent of categories) {
      if (parent.id === categoryId) {
        category = parent;
        break;
      }
      const child = parent.children?.find((c) => c.id === categoryId);
      if (child) {
        category = child;
        break;
      }
    }
    return category;
  };

  if (filters === defaultFilterValues && sort.field === defaultSort.field && sort.direction === defaultSort.direction) {
    return null;
  }

  const formattedDateRange = () => {
    const from = new Date(filters.dateRange.from);
    const to = new Date(filters.dateRange.to);
    const fromDate = from.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const toDate = to.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return `${filters.dateRange.from ? fromDate : ''} - ${filters.dateRange.to ? toDate : ''}`;
  };

  const formattedAmount = () => {
    const operator = amountOperators.find((o) => o.value === filters.amount.operator);
    if (operator?.value === 'between') {
      return `${filters.amount.value1} - ${filters.amount.value2}`;
    }
    return `${operator?.shortLabel} ${filters.amount.value1}`;
  };

  return (
    <div className="flex w-full items-center gap-2">
      {/* Active Filters */}
      <div className="flex grow items-center gap-2 overflow-x-auto">
        {activeFilterCount > 0 && (
          <>
            <div className="flex items-center gap-2 overflow-x-auto">
              {filters.types.map((type) => {
                const typeInfo = TransactionUtils.types.find((t) => t.id === type);
                return typeInfo ? (
                  <FilterChip
                    id={type}
                    name={typeInfo.name}
                    onClick={() => onFilterClick('remove', 'types', typeInfo.id)}
                    shouldShowRemove={true}
                  />
                ) : null;
              })}
              {filters.categories.slice(0, 2).map((categoryId) => {
                const category = getCategory(categoryId);
                return category ? (
                  <FilterChip
                    id={categoryId}
                    name={category.name}
                    onClick={() => onFilterClick('remove', 'categories', categoryId)}
                    shouldShowRemove={true}
                    bgColor="bg-purple-100 dark:bg-purple-900"
                    color="text-purple-800 dark:text-purple-200"
                  />
                ) : null;
              })}
              {filters.categories.length > 2 && (
                <FilterChip
                  id="more-categories"
                  name={`+${filters.categories.length - 2} more`}
                  onClick={() => onFilterClick('open', 'categories', '')}
                  shouldShowRemove={false}
                  color="text-slate-500"
                  bgColor="bg-slate-100 dark:bg-slate-800"
                />
              )}
              {filters.tags.slice(0, 2).map((tagId) => {
                const tag = tags.find((t) => t.id === tagId);
                return tag ? (
                  <FilterChip
                    id={tagId}
                    name={tag.name}
                    onClick={() => onFilterClick('remove', 'tags', tagId)}
                    shouldShowRemove={true}
                    bgColor="bg-emerald-100 dark:bg-emerald-900"
                    color="text-emerald-800 dark:text-emerald-200"
                  />
                ) : null;
              })}
              {filters.tags.length > 2 && (
                <FilterChip
                  id="more-tags"
                  name={`+${filters.tags.length - 2} more`}
                  onClick={() => onFilterClick('open', 'tags', '')}
                  shouldShowRemove={false}
                  color="text-slate-500"
                  bgColor="bg-slate-100 dark:bg-slate-800"
                />
              )}
              {filters.people.slice(0, 1).map((personId) => {
                const person = people.find((p) => p.id?.toString() === personId || p.name === personId);
                return person ? (
                  <FilterChip
                    id={personId}
                    name={person.name}
                    onClick={() => onFilterClick('remove', 'people', personId)}
                    shouldShowRemove={true}
                    bgColor="bg-orange-100 dark:bg-orange-900"
                    color="text-orange-800 dark:text-orange-200"
                  />
                ) : null;
              })}
              {filters.people.length > 1 && (
                <FilterChip
                  id="more-people"
                  name={`+${filters.people.length - 1} more`}
                  onClick={() => onFilterClick('open', 'people', '')}
                  shouldShowRemove={false}
                  color="text-slate-500"
                  bgColor="bg-slate-100 dark:bg-slate-800"
                />
              )}
              {(filters.dateRange.from || filters.dateRange.to) && (
                <FilterChip
                  id="date-range"
                  name={formattedDateRange()}
                  onClick={() => onFilterClick('open', 'date', '')}
                  shouldShowRemove={false}
                  bgColor="bg-cyan-100 dark:bg-cyan-900"
                  color="text-cyan-800 dark:text-cyan-200"
                />
              )}
              {filters.amount.value1 && (
                <FilterChip
                  id="amount"
                  name={formattedAmount()}
                  onClick={() => onFilterClick('open', 'amount', '')}
                  shouldShowRemove={false}
                  bgColor="bg-pink-100 dark:bg-pink-900"
                  color="text-pink-800 dark:text-pink-200"
                />
              )}
              {filters.accounts.slice(0, 1).map((accountId) => {
                const account = accounts.find((a) => a.id?.toString() === accountId || a.name === accountId);
                return account ? (
                  <FilterChip
                    id={accountId}
                    name={account.name}
                    onClick={() => onFilterClick('remove', 'accounts', accountId)}
                    shouldShowRemove={true}
                    bgColor="bg-orange-100 dark:bg-orange-900"
                    color="text-orange-800 dark:text-orange-200"
                  />
                ) : null;
              })}
              {filters.accounts.length > 1 && (
                <FilterChip
                  id="more-accounts"
                  name={`+${filters.accounts.length - 1} more`}
                  onClick={() => onFilterClick('open', 'accounts', '')}
                  shouldShowRemove={false}
                  color="text-slate-500"
                  bgColor="bg-slate-100 dark:bg-slate-800"
                />
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-auto flex-shrink-0 px-2 py-1 text-xs text-slate-500 hover:text-slate-700"
            >
              Clear all
            </Button>
          </>
        )}
      </div>

      {/* Sort indicator */}
      {(sort.direction !== defaultSort.direction || sort.field !== defaultSort.field) && (
        <Badge
          variant="outline"
          className="flex-shrink-0 cursor-pointer px-2 py-1 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={onSortClick}
        >
          {sort.direction === 'asc' ? <ArrowUp className="mr-1 h-2 w-2" /> : <ArrowDown className="mr-1 h-2 w-2" />}
          {getSortLabel()}
        </Badge>
      )}
    </div>
  );
};

export default FilterSortBar;
