import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowBigRightDash } from 'lucide-react';
import { SwipeableTransaction } from '@/components/swipeable-transaction';
import type { Transaction } from '@/services/api';
import type { Filter } from './transactions-tab/filter/types';
import type { Sort } from './transactions-tab/sort/types';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { CategoryTransactionIcon } from './category-transaction-icon';
import AccountAvatar from './account-avatar';
import { TagChip } from './tag-chip';
import transactionUtils from '@/lib/transaction-utils';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import { getInitials } from '@/lib/utils';

interface TransactionsListProps {
  transactions: Transaction[];
  onClearSearchAndFilters: () => void;
  searchTerm: string;
  filters: Filter;
  sort: Sort;
}

export function TransactionsList({
  transactions,
  searchTerm,
  onClearSearchAndFilters,
  filters,
  sort,
}: TransactionsListProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const matchesSearch =
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.person?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.person?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Type filter
    const matchesType = filters.types.length === 0 || filters.types.includes(transaction.type);

    // Category filter
    const matchesCategory = filters.categories.length === 0 || filters.categories.includes(transaction.category.id);

    // Tags filter
    const matchesTags =
      filters.tags.length === 0 || filters.tags.some((tag) => transaction.tags.some((t) => t.id === tag));

    // People filter
    const matchesPeople =
      filters.people.length === 0 ||
      filters.people.some((personId) => {
        const transactionPersonId = transaction.person?.id?.toString();
        return transactionPersonId === personId;
      });

    // Date range filter
    const matchesDateRange = (() => {
      if (!filters.dateRange.from && !filters.dateRange.to) return true;
      const transactionDate = new Date(transaction.date);
      const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
      const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : null;

      if (fromDate && toDate) {
        return transactionDate >= fromDate && transactionDate <= toDate;
      } else if (fromDate) {
        return transactionDate >= fromDate;
      } else if (toDate) {
        return transactionDate <= toDate;
      }
      return true;
    })();

    // Amount filter
    const matchesAmount = (() => {
      if (!filters.amount.value1) return true;
      const transactionAmount = Math.abs(transaction.amount);
      const value1 = Number.parseFloat(filters.amount.value1);
      const value2 = filters.amount.value2 ? Number.parseFloat(filters.amount.value2) : null;

      switch (filters.amount.operator) {
        case 'between':
          return value2 ? transactionAmount >= value1 && transactionAmount <= value2 : true;
        case 'greater':
          return transactionAmount > value1;
        case 'less':
          return transactionAmount < value1;
        case 'equal':
          return transactionAmount === value1;
        case 'not_equal':
          return transactionAmount !== value1;
        case 'greater_equal':
          return transactionAmount >= value1;
        case 'less_equal':
          return transactionAmount <= value1;
        default:
          return true;
      }
    })();

    return (
      matchesSearch &&
      matchesType &&
      matchesCategory &&
      matchesTags &&
      matchesPeople &&
      matchesDateRange &&
      matchesAmount
    );
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let valueA, valueB;

    // Extract values based on sort field
    switch (sort.field) {
      case 'date':
        valueA = new Date(a.date).getTime();
        valueB = new Date(b.date).getTime();
        break;
      case 'amount':
        valueA = Math.abs(a.amount);
        valueB = Math.abs(b.amount);
        break;
      case 'category':
        valueA = a.category.name.toLowerCase();
        valueB = b.category.name.toLowerCase();
        break;
      case 'tags':
        valueA = a.tags[0]?.name.toLowerCase() || '';
        valueB = b.tags[0]?.name.toLowerCase() || '';
        break;
      case 'title':
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
        break;
      case 'person':
        valueA = (a.person?.name || '').toLowerCase();
        valueB = (b.person?.name || '').toLowerCase();
        break;
      default:
        valueA = a[sort.field as keyof Transaction];
        valueB = b[sort.field as keyof Transaction];
    }

    // Compare values based on sort direction
    if (sort.direction === 'asc') {
      return valueA && valueB ? (valueA > valueB ? 1 : valueA < valueB ? -1 : 0) : 0;
    } else {
      return valueA && valueB ? (valueA < valueB ? 1 : valueA > valueB ? -1 : 0) : 0;
    }
  });

  const getActiveFiltersCount = () => {
    return (
      filters.types.length +
      filters.categories.length +
      filters.tags.length +
      filters.people.length +
      (filters.dateRange.from || filters.dateRange.to ? 1 : 0) +
      (filters.amount.value1 ? 1 : 0)
    );
  };

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete "${id}"?`)) {
      console.log('Delete transaction with id:', id);
    }
  };

  const handleEdit = (id: string) => {
    alert(`Edit functionality for transaction with id: ${id}`);
  };

  const handleSelect = (id: string) => {
    alert(`Open functionality for transaction with id: ${id}`);
    navigate(`/transactions/${id}`);
  };

  return (
    <div className="space-y-6 px-0 py-0">
      {/* Transactions List */}
      <div className="space-y-3">
        {sortedTransactions.map((transaction) => (
          <SwipeableTransaction
            key={transaction.id}
            onEdit={() => {
              handleEdit(`${transaction.id}`);
            }}
            onDelete={() => {
              handleDelete(`${transaction.id}`);
            }}
            onClick={() => handleSelect(`${transaction.id}`)}
          >
            <Card className="p-0 transition-all duration-200">
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex flex-1 items-center space-x-3">
                    <CategoryTransactionIcon
                      transactionType={transaction.type}
                      iconName={transaction.category.icon}
                      size="md"
                      bgColor={transaction.category.bgColor}
                      color={transaction.category.color}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="truncate font-medium text-slate-900 dark:text-white">{transaction.title}</h4>
                        <span className={`font-semibold ${transactionUtils.getAmountColor(transaction.type)}`}>
                          {currencyUtils.formatAmount(transaction.amount, user?.settings?.currency)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex grow flex-col gap-2">
                          <div className="mt-1 flex items-center space-x-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              {transactionUtils.formatDateTime(transaction.date)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <AccountAvatar account={transaction.account} size="xs" />
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {transaction.account.name}
                              </span>
                            </div>
                            {transaction.toAccount && (
                              <>
                                <ArrowBigRightDash className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                <div className="flex items-center gap-2">
                                  <AccountAvatar account={transaction.toAccount} size="xs" />
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {transaction.toAccount.name}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {transaction.person && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={transaction.person?.avatar?.url}
                                alt={transaction.person?.name}
                                className="rounded-full"
                              />
                              <AvatarFallback>{getInitials(transaction.person?.name)}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {transaction.tags.map((tag) => (
                          <div>
                            <TagChip
                              name={tag.name}
                              iconName={tag.icon}
                              bgColor={tag.bgColor}
                              color={tag.color}
                              size="xs"
                              key={tag.id}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SwipeableTransaction>
        ))}
      </div>

      {sortedTransactions.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-slate-500 dark:text-slate-400">No transactions found</p>
          {(searchTerm || getActiveFiltersCount() > 0) && (
            <Button variant="outline" size="sm" onClick={onClearSearchAndFilters} className="mt-2">
              Clear search and filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
