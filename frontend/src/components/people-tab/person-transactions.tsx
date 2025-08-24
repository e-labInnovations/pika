import AsyncStateWrapper from '@/components/async-state-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CategoryTransactionIcon } from '@/components/category-transaction-icon';
import transactionUtils from '@/lib/transaction-utils';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import { usePersonTransactions } from '@/hooks/queries';
import ChartNoData from '../ui/chart-no-data';
import type { Person } from '@/services/api';

interface PersonTransactionsProps {
  person: Person;
}

const PersonTransactions = ({ person }: PersonTransactionsProps) => {
  const { data: personTransactions, isLoading, error } = usePersonTransactions(person.id, 10, 0);
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <AsyncStateWrapper isLoading={isLoading} error={error}>
      <Card className="gap-4">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm"
            onClick={() => navigate(`/transactions?personId=${person.id}&source=person`)}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent className="gap-4">
          <div className="space-y-3">
            {personTransactions?.map((transaction) => (
              <div
                onClick={() => navigate(`/transactions/${transaction.id}`)}
                key={transaction.id}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-800/70"
              >
                <div className="flex items-center space-x-3">
                  <CategoryTransactionIcon
                    transactionType={transaction.type}
                    iconName={transaction.category.icon}
                    color={transaction.category.color}
                    bgColor={transaction.category.bgColor}
                  />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{transaction.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {transactionUtils.formatDateTime(transaction.date)}
                    </p>
                  </div>
                </div>
                <span className={`font-semibold ${transactionUtils.getAmountColor(transaction.type)}`}>
                  {currencyUtils.formatAmount(transaction.amount, user?.settings?.currency)}
                </span>
              </div>
            ))}
            {personTransactions?.length === 0 && (
              <ChartNoData
                title="No Transactions Found"
                description={`No transaction data found for ${person.name ?? 'this person'}`}
                icon="list-ordered"
                className="h-64 sm:h-72 md:h-80"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </AsyncStateWrapper>
  );
};

export default PersonTransactions;
