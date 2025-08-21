import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DynamicIcon } from '@/components/lucide';
import { useEffect, useState } from 'react';
import AccountAvatar from '../account-avatar';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import type { Account } from '@/services/api';

interface AccountsProps {
  accounts: Account[];
}
const Accounts = ({ accounts = [] }: AccountsProps) => {
  const { user } = useAuth();
  const [showMoney, setShowMoney] = useState(false);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    setTotalBalance(accounts ? accounts.reduce((sum, account) => sum + Number(account.balance), 0) : 0);
  }, [accounts]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Accounts</h3>
        <Button size="icon" variant="outline" className="rounded-full" onClick={() => setShowMoney(!showMoney)}>
          {showMoney ? <DynamicIcon name="eye-off" /> : <DynamicIcon name="eye" />}
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3 md:grid-cols-4">
        {accounts.map((account) => (
          <Card key={account.id} className="py-4">
            <CardContent className="h-full px-2 py-0">
              <div className="flex h-full flex-col items-center justify-between gap-2">
                <AccountAvatar account={account} size="md" />
                <span className="text-center text-xs md:text-sm">{account.name}</span>
                <span
                  className={`font-semibold ${
                    account.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {showMoney
                    ? currencyUtils.formatAmount(account.balance, user?.settings?.currency)
                    : `${currencyUtils.getCurrencySymbol(user?.settings?.currency)}----`}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-0 text-white shadow-lg">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DynamicIcon name="wallet" className="h-4 w-4" />
              <span className="text-sm font-medium">Total Balance</span>
            </div>
            <span className="text-lg font-bold tracking-tight">
              {showMoney
                ? currencyUtils.formatAmount(totalBalance, user?.settings?.currency)
                : `${currencyUtils.getCurrencySymbol(user?.settings?.currency)}----`}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Accounts;
