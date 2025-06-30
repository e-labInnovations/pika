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
import { transactionService, type Transaction } from '@/services/api/transaction.service';

const TransactionsTab = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTransactionSearch, setShowTransactionSearch] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [filters, setFilters] = useState<Filter>(defaultFilterValues);
  const [sort, setSort] = useState<Sort>(defaultSort);
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    transactionService.list().then((response) => {
      setTransactions(response.data);
    });
  }, []);

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ filters:', filters);
  }, [filters]);

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ sort:', sort);
  }, [sort]);

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
        description: 'Your financial transactions',
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
    </TabsLayout>
  );
};

export default TransactionsTab;
