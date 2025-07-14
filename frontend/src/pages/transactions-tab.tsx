import { TransactionsList } from '@/components/transactions-list';
import TabsLayout from '@/layouts/tabs';
import { useEffect, useState } from 'react';
import TransactionsFilter from '@/components/transactions-tab/filter';
import {
  defaultFilterValues,
  type Filter,
  type FilterTab,
  type AmountOperator,
} from '@/components/transactions-tab/filter/types';
import TransactionsSort from '@/components/transactions-tab/sort';
import { defaultSort, type Sort } from '@/components/transactions-tab/sort/types';
import FilterSortBar from '@/components/transactions-tab/filter-sort-bar';
import SearchBar from '@/components/search-bar';
import HeaderRightActions from '@/components/transactions-tab/header-right-actions';
import { transactionsService, type Transaction } from '@/services/api';
import { useSearchParams } from 'react-router-dom';
import AsyncStateWrapper from '@/components/async-state-wrapper';
import { type TransactionType } from '@/lib/transaction-utils';

const TransactionsTab = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTransactionSearch, setShowTransactionSearch] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [filters, setFilters] = useState<Filter>(defaultFilterValues);
  const [sort, setSort] = useState<Sort>(defaultSort);
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const personId = searchParams.get('personId');
  const source = searchParams.get('source');
  const linkBackward = personId ? `/people/${personId}` : undefined;
  const [description, setDescription] = useState('Your financial transactions');
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  // Extract all filter values from URL on component mount
  useEffect(() => {
    const urlFilters: Filter = { ...defaultFilterValues };

    // Extract array filters from URL
    const types = searchParams.get('types')?.split(',').filter(Boolean) || [];
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const people = searchParams.get('people')?.split(',').filter(Boolean) || [];
    const accounts = searchParams.get('accounts')?.split(',').filter(Boolean) || [];

    // Extract date range filters - epoch timestamps
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Extract amount range filters
    const amountFrom = searchParams.get('amountFrom');
    const amountTo = searchParams.get('amountTo');
    const amountOperator = searchParams.get('amountOperator');

    // Extract search term
    const searchTerm = searchParams.get('search');

    // Update filters state with URL values
    if (types.length > 0) urlFilters.types = types as TransactionType[];
    if (categories.length > 0) urlFilters.categories = categories;
    if (tags.length > 0) urlFilters.tags = tags;
    if (people.length > 0) urlFilters.people = people;
    if (accounts.length > 0) urlFilters.accounts = accounts;

    // Handle date filtering
    if (dateFrom || dateTo) {
      urlFilters.dateRange = {
        from: dateFrom ? new Date(Number(dateFrom)).toISOString() : undefined,
        to: dateTo ? new Date(Number(dateTo)).toISOString() : undefined,
      };
    }

    // Handle amount filtering
    if (amountFrom || amountTo || amountOperator) {
      urlFilters.amount = {
        operator: (amountOperator as AmountOperator) || 'between',
        value1: amountFrom || '',
        value2: amountTo || '',
      };
    }

    // Set filters and search term
    setFilters(urlFilters);
    if (searchTerm) setSearchTerm(searchTerm);
  }, [searchParams]);

  useEffect(() => {
    fetchTransactions();
  }, [source]);

  useEffect(() => {
    let count = 0;

    // Count array filters that have items
    if (filters.types.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.people.length > 0) count++;
    if (filters.accounts.length > 0) count++;

    // Count date range filter if either from or to is set
    if (filters.dateRange.from || filters.dateRange.to) count++;

    // Count amount filter if value1 is set
    if (filters.amount.value1) count++;

    setActiveFilterCount(count);
  }, [filters]);

  useEffect(() => {}, [sort]);

  const fetchTransactions = () => {
    setIsLoading(true);
    setError(null);

    if (source === 'person' && personId) {
      transactionsService
        .list({
          personId: personId ?? undefined,
        })
        .then((response) => {
          setTransactions(response.data);
          if (response.data.length > 0) {
            setDescription(`Transactions with ${response.data[0].person.name}`);
          } else {
            setDescription('Transactions with person');
          }
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      transactionsService
        .list()
        .then((response) => {
          setTransactions(response.data);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const clearSearchAndFilters = () => {
    setSearchTerm('');
    setFilters(defaultFilterValues);
    setSort(defaultSort);
    setShowTransactionSearch(false);
  };

  const handleFilterClick = (action: 'open' | 'remove', filterType: FilterTab, value: string) => {
    if (action === 'open') {
      setActiveFilterTab(filterType);
      setShowFilterModal(true);
    } else if (action === 'remove') {
      if (
        filterType === 'types' ||
        filterType === 'categories' ||
        filterType === 'tags' ||
        filterType === 'people' ||
        filterType === 'accounts'
      ) {
        setFilters((prev) => ({
          ...prev,
          [filterType]: prev[filterType].filter((item) => item !== value),
        }));
      }
    }
  };

  return (
    <TabsLayout
      header={{
        title: 'Transactions',
        description: description,
        linkBackward: linkBackward,
        rightActions: (
          <HeaderRightActions
            showTransactionSearch={showTransactionSearch}
            setShowTransactionSearch={setShowTransactionSearch}
            showFilterModal={showFilterModal}
            handleFilterOpen={() => handleFilterClick('open', 'types', '')}
            showSortModal={showSortModal}
            setShowSortModal={setShowSortModal}
            filterCount={activeFilterCount}
          />
        ),
      }}
    >
      <AsyncStateWrapper isLoading={isLoading} error={error}>
        <FilterSortBar
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          onSortClick={() => setShowSortModal(true)}
          onFilterClick={handleFilterClick}
          activeFilterCount={activeFilterCount}
        />

        {showTransactionSearch && (
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearchToggle={setShowTransactionSearch}
            placeholder="Search transactions..."
          />
        )}

        <TransactionsList
          transactions={transactions}
          searchTerm={searchTerm}
          onClearSearchAndFilters={clearSearchAndFilters}
          filters={filters}
          sort={sort}
          refreshTransactions={fetchTransactions}
        />

        <TransactionsFilter
          open={showFilterModal}
          setOpen={setShowFilterModal}
          filters={filters}
          setFilters={setFilters}
          defaultTab={activeFilterTab}
        />

        <TransactionsSort open={showSortModal} setOpen={setShowSortModal} sort={sort} setSort={setSort} />
      </AsyncStateWrapper>
    </TabsLayout>
  );
};

export default TransactionsTab;
