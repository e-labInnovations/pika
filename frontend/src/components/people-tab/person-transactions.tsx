import { useEffect, useState } from 'react';
import AsyncStateWrapper from '@/components/async-state-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { transactionsService, type Transaction } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { CategoryTransactionIcon } from '@/components/category-transaction-icon';
import transactionUtils from '@/lib/transaction-utils';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';

interface PersonTransactionsProps {
  personId: string | null;
}

const PersonTransactions = ({ personId }: PersonTransactionsProps) => {
  const [personTransactions, setPersonTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!personId) {
      setError('Something went wrong with the person ID');
      return;
    }
    setIsLoading(true);
    transactionsService
      .getPersonTransactions(personId, 10, 0)
      .then((res) => {
        setPersonTransactions(res.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [personId]);

  return (
    <AsyncStateWrapper isLoading={isLoading} error={error}>
      <Card className="gap-4">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm"
            onClick={() => navigate(`/transactions?personId=${personId}&source=person`)}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent className="gap-4">
          <div className="space-y-3">
            {personTransactions.map((transaction) => (
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
          </div>
        </CardContent>
      </Card>
    </AsyncStateWrapper>
  );
};

export default PersonTransactions;
