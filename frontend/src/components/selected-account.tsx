import { Button } from '@/components/ui/button';
import AccountAvatar from '@/components/account-avatar';
import type { Account } from '@/services/api';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/components/lucide';
import transactionUtils from '@/lib/transaction-utils';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';

interface SelectedAccountProps {
  account: Account;
  onEdit: () => void;
  showBalance?: boolean;
  className?: string;
}

const SelectedAccount = ({ account, onEdit, showBalance = true, className = '' }: SelectedAccountProps) => {
  const { user } = useAuth();

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20',
        className,
      )}
    >
      <div className="flex items-center space-x-3">
        <AccountAvatar account={account} size="md" />
        <div>
          <span className="font-medium text-slate-900 dark:text-white">{account.name}</span>
          {showBalance && (
            <p className={cn('text-sm font-semibold', transactionUtils.getBalanceColor(account.balance))}>
              {currencyUtils.formatAmount(account.balance, user?.settings?.currency)}
            </p>
          )}
          {account.description && <p className="text-xs text-slate-500 dark:text-slate-400">{account.description}</p>}
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
        <DynamicIcon name="pencil" className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SelectedAccount;
