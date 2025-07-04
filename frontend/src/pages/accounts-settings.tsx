import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import AccountAvatar from '@/components/account-avatar';
import { useNavigate } from 'react-router-dom';
import { cn, runWithLoaderAndError } from '@/lib/utils';
import transactionUtils from '@/lib/transaction-utils';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import { accountService, type Account } from '@/services/api';
import { useLookupStore } from '@/store/useLookupStore';
import { useConfirmDialog } from '@/store/useConfirmDialog';

const AccountsSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const accounts = useLookupStore((state) => state.accounts);

  const handleDeleteAccount = async (account: Account) => {
    useConfirmDialog.getState().open({
      title: 'Delete Account',
      message: `Are you sure you want to delete "${account.name}"?`,
      onConfirm: () => {
        runWithLoaderAndError(
          async () => {
            await accountService.delete(account.id);
            await useLookupStore.getState().fetchAccounts();
          },
          {
            loaderMessage: 'Deleting account...',
            successMessage: 'Account deleted successfully',
          },
        );
      },
    });
  };

  return (
    <TabsLayout
      header={{
        title: 'Accounts',
        description: 'Manage your accounts',
        rightActions: (
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => navigate('/settings/accounts/add')}
          >
            <Plus className="h-4 w-4" />
          </Button>
        ),
        linkBackward: '/settings',
      }}
    >
      <div className="flex flex-col gap-2">
        {accounts.map((account) => (
          <Card key={account.id} className="p-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AccountAvatar account={account} size="md" />
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">{account.name}</span>
                    <p className="text-muted-foreground text-sm">{account.description}</p>
                    <p className={cn('text-xs', transactionUtils.getBalanceColor(account.balance))}>
                      {currencyUtils.formatAmount(account.balance, user?.settings.currency)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/settings/accounts/${account.id}/edit`)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleDeleteAccount(account);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsLayout>
  );
};

export default AccountsSettings;
