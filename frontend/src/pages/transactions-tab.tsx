import { TransactionsList } from '@/components/transactions-list';
import TabsLayout from '@/layouts/tabs';
import { useEffect, useState } from 'react';
import TransactionsFilter from '@/components/transactions-tab/filter';
import { defaultFilterValues, type Filter, type FilterTab } from '@/components/transactions-tab/filter/types';
import TransactionsSort from '@/components/transactions-tab/sort';
import { defaultSort, type Sort } from '@/components/transactions-tab/sort/types';
import FilterSortBar from '@/components/transactions-tab/filter-sort-bar';
import SearchBar from '@/components/search-bar';
import HeaderRightActions from '@/components/transactions-tab/header-right-actions';
import { transactionsService, type Transaction } from '@/services/api';
import { useSearchParams } from 'react-router-dom';
import AsyncStateWrapper from '@/components/async-state-wrapper';

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
  const linkBackward = personId ? `/people/${personId}` : undefined;
  const [description, setDescription] = useState('Your financial transactions');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    transactionsService
      .list({
        personId: personId ?? undefined,
      })
      .then((response) => {
        setTransactions(response.data);
        setDescription(personId ? `Transactions with ${response.data[0].person.name}` : 'Your financial transactions');
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [personId]);

  useEffect(() => {}, [filters]);

  useEffect(() => {}, [sort]);

  const getFilterCount = () => {
    return Object.keys(filters).filter((key) => {
      const value = filters[key as keyof Filter];
      return Array.isArray(value) && value.length > 0;
    }).length;
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
            filterCount={getFilterCount()}
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
